const rootURL  =  getRootURL(),
      treeSHA  = "bcfbe96e352d054b547b7825e3099020eb4d973c",
      endpoint = "https://api.github.com/repos/cmdruid/web-dev/git/trees/",
      options  = {
          method: 'GET',
          headers: { 'Content-Type': 'text/html' }
      };

function getRootURL() {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/`;
}

async function fetchRepoIndex(url, options) {

    const res  = await fetch(url, options),
          data = await res.json(),
          dirs = [];

    if (!(res && res.status === 200)) throw new Error("Bad response: " + res);
    if (!(data && data.tree.length)) throw new Error("Bad object: " + data);

    data.tree.forEach(tree => { if (tree.type === "tree") dirs.push(tree.path); });

    return dirs;
}

async function fetchPage(dirName) {

    const res    = await fetch(rootURL + dirName, options),
          text   = await res.text(),
          parser = new DOMParser(),
          html   = parser.parseFromString(text, 'text/html');

    if (!(res && html && res.status === 200)) throw new Error("Bad response: " + res);

    return html;
}

function generateCard(dir, page) {
    /* Check if cover.jpg or readme.md files exist for 
       project. Build content card for project and return. */

    const title   = page.querySelector('title'),
          summary = page.querySelector('meta[name="summary"]'),
          cover   = page.querySelector('meta[name="cover"]'),
          url     = getRootURL() + dir + "/";

    const card    = document.createElement('div'),
          content = document.createElement('div'),
          header  = document.createElement('a');

    card.setAttribute('class', 'ui card');
    content.setAttribute('class', 'content');
    card.appendChild(content);

    header.textContent = (title) ? title.innerText : dir;
    header.setAttribute('class', 'header');
    header.setAttribute('href', url);
    content.appendChild(header);

    if (cover) {

        const image = document.createElement('div'),
              img   = document.createElement('img');

        img.setAttribute('class', 'ui image');
        img.setAttribute('src', url + cover.getAttribute("content"));
        image.setAttribute('class', 'image');
        image.appendChild(img);
        content.appendChild(image);
    }

    if (summary) {

        const desc = document.createElement('div');

        desc.setAttribute('class', 'description');
        desc.textContent = summary.getAttribute("content");
        content.appendChild(desc);
    }

    return card;
}

async function renderCards() {
    /* Fetch data using fetchRepoIndex. Format/validate 
       return data and pass into createCard function. 
       Generate card list and pass to DOM. */

    try {
        const dirs      = ['fibloop'], //await fetchRepoIndex(endpoint + treeSHA, options);
              container = document.querySelector('#cardDeck');

        container.setAttribute('class', 'container');

        for (const dir of dirs) {
            const page = await fetchPage(dir),
                  card = generateCard(dir, page);
                  //header = card.content.header;

            // header.setAttribute('href', url + dir);
            container.appendChild(card);
        }
    } catch(err) { console.log(err); }
}

renderCards();
console.log("git-index loaded!");



