console.log("git-index loaded!");

const { protocol, host } = window.location,
      devmode    = host.includes('127.0.0.1'),
      username   = "cmdruid",       // Username on Github.
      repository = "web-dev",       // Name of the repository.
      branch     = 'master',        // Name of the branch you want to index.
      selector   = '#cardDeck',     // CSS selector for the card container.
      endpoint   = `https://api.github.com/repos/${username}/${repository}`;

renderCards();

function getRootURL() {
  /** Returns origin URL for the webpage DOM. */
  if (devmode) return `${protocol}//${host}/`;
  return `${protocol}//${host}/${repository}/`;
}

async function fetchRepoSHA() {
  /** Fetches the SHA key for a given repository.
      This key is required for further indexing. */
  const res  = await fetch(`${endpoint}/branches/${branch}`),
        data = await res.json();
  if (!(res.ok && data)) console.error("Bad response: " + res);
  return data.commit.sha;
}

async function fetchBranchIndex(sha) {
  /** Fetches folder names within the given
      SHA key index and returns them in a list. */
  const res  = await fetch(`${endpoint}/git/trees/${sha}`),
        data = await res.json();
  if (!(res.ok && data)) console.log("Bad response: " + res);
  return data.tree.filter(t => t.type === "tree").map(t => t.path);
}

async function fetchPage(dirName) {
  /** Fetches the HTML content of a given 
      webpage and returns it as a DOM element. */
  const res    = await fetch(getRootURL() + dirName),
        text   = await res.text(),
        parser = new DOMParser(),
        html   = parser.parseFromString(text, 'text/html');
  if (!(res.ok && html)) console.log("Bad response: " + res);
  return html;
}

async function getCover(root, url, page) {
  /** If cover metatag is specified, return image url. */
  let cover = page.querySelector('meta[name="cover"]');
  if (cover)    return url + cover.getAttribute("content");
  if (!devmode) return getCacheCover(root, url);
}

async function getCacheCover(root, url) {
  /** Fetch thumbnail of site using web service,
      fall-back to default image. */
  let res = await fetch(`//image.thum.io/get/${url}`);
  return (res.ok)
    ? `//image.thum.io/get/${url}`
    : `${root}default-cover.png`;
}

async function generateCard(dir, page) {
  /** Scrapes the title, description, and meta-tag
      information from a given webpage, then uses it 
      to construct (and return) an HTML element. */
  const root    = getRootURL(),
        url     = root + dir + "/",
        title   = page.querySelector('title'),
        desc    = page.querySelector('meta[name="description"]'),
        image   = await getCover(root, url, page);

  const card    = document.createElement('a'),
        content = document.createElement('div'),
        header  = document.createElement('div');

  const div = document.createElement('div'),
        img = document.createElement('img');

  img.setAttribute('class', 'ui image');
  img.setAttribute('src', image);
        
  div.setAttribute('class', 'image');
  div.appendChild(img);
  card.appendChild(div);

  card.setAttribute('class', 'ui card raised centered');
  card.setAttribute('href', url);
  content.setAttribute('class', 'content');
  card.appendChild(content);

  header.textContent = (title) ? title.innerText : dir;
  header.setAttribute('class', 'header');
  content.appendChild(header);

  if (desc) {
    const description = document.createElement('div');
    description.setAttribute('class', 'description');
    description.textContent = desc.getAttribute("content");
    content.appendChild(description);
  }
  return card;
}

async function renderCards() {
  /** Main function. Fetches the webpage contained in
      each sub-folder of the repo, and constructs a 
      deck of card elements that highlight each page. */

  try {
    const sha       = await fetchRepoSHA(),
          dirs      = await fetchBranchIndex(sha),
          container = document.querySelector(selector);
    for (const dir of dirs) {
      const page = await fetchPage(dir),
            card = await generateCard(dir, page);
      container.appendChild(card);
    }
  } catch(err) { console.log(err); }
}
