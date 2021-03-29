console.log("navbar.js loaded!");

async function main() {
  /* Main event loop. All declarations are wrapped within 
     this scope. */
  const [ _, repo, path = '' ] = getURL();
  const ghURL    = `https://github.com/cmdruid/${repo}/tree/master/${path}`,
        cssURL   = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.css',
        localdir = document.currentScript.src.match(/^.*\//)[0];
  console.log('Github URL set to: ', ghURL);
  loadLink('fomantic-ui', cssURL);
  loadNav(localdir + 'navbar.html');

  async function loadNav(path) {
    /* Handles loading of the navigation bar. */
    const navbar  = loadHTML(await fetchHTML(path)),
          homeBtn = navbar.querySelector('#home-link'),
          ghBtn   = navbar.querySelector('#github-link');
    if (!navbar) console.log("Elements failed to load!");
    document.body.prepend(navbar);
    homeBtn.setAttribute('onclick', `location.href='${window.location.origin}';`);
    ghBtn.setAttribute('onclick', `location.href='${ghURL}';`);
  }

  function getURL() {
    /* Returns the correct URL for linking to Github. */
    let devmode = window.location.hostname.includes('127.0.0.1'),
        isRoot  = !window.location.pathname;
    switch (true) {
      case devmode: return [ null, 'web-dev', '' ];
      case isRoot:  return [ null, windows.hostname, '' ];
      default: return window.location.pathname.match(/^\/([\w\-]*)\/(.*)$/);
    }
  }

  async function fetchHTML(path) {
    /* Fetches the locally stored HTML template. */
    try { 
      let res = await fetch(path);
      if (!res.ok) throw Error(`Failed with status: ${res.status}`); 
      return await res.text();
    } catch(err) { console.error(err); return ''; }
  }

  function loadHTML(HTMLtxt) {
    /* Loads the locally stored HTML template as DOM. */
    let tmp = document.createElement('template');
    tmp.innerHTML = HTMLtxt.trim();
    return tmp.content.firstElementChild;
  }

  function loadLink(name, url) {
    /* Checks that the required CSS styleshit is loaded. */
    let links = document.head.querySelectorAll('link');
    for (let link of links) if (link.href.includes(name)) return;
    document.head.prepend(loadHTML(`<link rel="stylesheet" type="text/css" href="${url}">`));
  }
}

main();