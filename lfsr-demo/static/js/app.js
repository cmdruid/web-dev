/** Module Imports */
import LFSR from './generator.js';


/** Initial Configuration */
const formElem = document.querySelector('form'),
      errElem  = document.querySelector('.error'),
      c        = document.querySelector('canvas'),
      ctx      = c.getContext("2d"),
      dpi      = window.devicePixelRatio,
      size     = 300;

let grid, gridSize, generator, scale, id;

c.style.width  = size + "px";
c.style.height = size + "px";
c.width   = Math.floor(size * dpi);
c.height  = Math.floor(size * dpi);

ctx.fillStyle = "#56BC58";
errElem.style.display = "none";


/** Form Event Loop */
formElem.addEventListener("submit", async (e) => {

    e.preventDefault();
    clearInterval(id);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const formData = new FormData(formElem),
          seed     = text2Binary(formData.get('seed') || 0),
          length   = parseInt(formData.get('length')) || 100,
          mask     = parseInt(formData.get('mask'))   || 0x80000057;

    console.log('Form submitted with params: ', length, seed, mask);

    grid      = new Array(length).fill(new Array(length).fill(0));
    gridSize  = length;
    generator = LFSR(length, seed, mask);
    scale     = (dpi * (size / length));

    ctx.scale(scale, scale);
    tick();
});


function tick() {
    /** Main event loop. */

    id = setInterval(function() {
        grid.unshift(generator.next().value);
        grid.pop();
        drawGrid();
    }, 50);
}


function drawGrid() {
    /** Draw the contents of the grid onto a canvas. */

    ctx.clearRect(0, 0, gridSize, gridSize);

    for (let j = 0; j < gridSize; j++) {
        for (let k = 0; k < gridSize; k++) {
            if (grid[k][j] === 1) ctx.fillRect(j, k, 1, 1);
        }
    }
}


function text2Binary(string) {
    /** Convert input string into binary value. */

    let result;

    if (!string) { result = Math.floor(Math.random() * 1000000); }
    
    else {
        result = string
                .split('')
                .map((c) => { return parseInt(c.charCodeAt(0)); })
                .reduce((a, b) => a + b) ** 2;
    }

    return result;
}