console.log("base-template.js loaded!");

const head      = document.querySelector('head'),
      body      = document.querySelector('body'),
      navbar    = createElem('div', false, "ui fixed inverted menu"),
      navCont   = createElem('div', navbar, "ui container"),
      navHead   = createElem('div', navCont, "header item"),
      codeIcon  = createElem('i', navHead, "code icon"),
      rightMenu = createElem('div', navCont, "item right"),
      ghBtn     = createElem('div', rightMenu, "ui green github button"),
      ghIcon    = createElem('i', ghBtn, "github-icon"),
      styles    = createElem('link', false, false);

if (!body) console.log("Missing body!");
body.prepend(navbar, body.firstChild);
body.style.marginTop = '5em';

if (!head) console.log("Missing head!");
styles.setAttribute('rel', 'stylesheet');
styles.setAttribute('type', 'text/css');
styles.setAttribute('href', 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.4/dist/semantic.min.css');
head.prepend(styles);


navHead.appendChild(document.createTextNode('cmdruid.github.io'));
navHead.setAttribute('href', "./");

setGitHubLink(ghBtn, 'cmdruid', 'web-dev');

function createElem(element, parent, attr) {
    const elem = document.createElement(element);
    

    if (element) elem.setAttribute('class', attr);
    if (parent) { parent.appendChild(elem); }
    return elem;
}

function setGitHubLink(btn, user, repo) {
    const url = `https://github.com/${user}/${repo}/`;
    btn.setAttribute('href', url);
    btn.appendChild(document.createTextNode("View on GitHub"));
}