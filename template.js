console.log("base-template.js loaded!");

const cssURL    = "https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.4/dist/semantic.min.css",
      githubURL = "location.href='https://github.com/cmdruid/web-dev';";

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

if (!head) console.log("Missing head!");
styles.setAttribute('rel', 'stylesheet');
styles.setAttribute('type', 'text/css');
styles.setAttribute('href', cssURL);
head.prepend(styles);

if (!body) console.log("Missing body!");
body.prepend(navbar, body.firstChild);
body.style.marginTop = '5em';

navHead.setAttribute('onclick', "location.href='./';");
navHead.appendChild(document.createTextNode('cmdruid.github.io'));

ghBtn.setAttribute('onclick', githubURL);
ghBtn.appendChild(document.createTextNode("View on GitHub"));

function createElem(element, parent, attr) {
  const elem = document.createElement(element);
  if (parent) parent.appendChild(elem);
  elem.setAttribute('class', attr);
  return elem;
}
