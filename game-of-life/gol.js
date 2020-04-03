const c          = document.querySelector('#canvas'),
      ctx        = c.getContext("2d"),
      gridHeight = c.height = 400,
      gridWidth  = c.width  = 400;

let theGrid    = createArray(gridWidth),
    mirrorGrid = createArray(gridWidth);

ctx.fillStyle = "#FF0000";

fillRandom();
tick();

function tick() {
    /* Main event loop. */

    console.time("loop");
    drawGrid();
    updateGrid();
    console.timeEnd("loop");
    requestAnimationFrame(tick);
}

function createArray(rows) {
    /* Create a 2d array of required height. */
    
    let arr = [];
    for (let i = 0; i < rows; i++) arr[i] = [];

    return arr;
}

function fillRandom() {
    /* Fill the grid randomly. */

    for (let j = 100; j < gridHeight - 100; j++) {
        for (let k = 100; k < gridWidth - 100; k++) {
            theGrid[j][k] = Math.round(Math.random());
        }
    }
}

function drawGrid() {
    /* Draw the contents of the grid onto a canvas. */

    let liveCount = 0;
    ctx.clearRect(0, 0, gridHeight, gridWidth);

    for (let j = 1; j < gridHeight; j++) {
        for (let k = 1; k < gridWidth; k++) {

            if (theGrid[j][k] === 1) {
                ctx.fillRect(j, k, 1, 1);
                liveCount++;
            }
        }
    }
}

function updateGrid() {
    /* Perform one iteration of update to the grid. */

    for (let j = 1; j < gridHeight - 1; j++) { 
        for (let k = 1; k < gridWidth - 1; k++) {

            /* Add up the total values for the surrounding cells. */
            let totalCells = 0;

            totalCells += theGrid[j - 1][k - 1];  // Top-left.
            totalCells += theGrid[j - 1][k];      // Top-center.
            totalCells += theGrid[j - 1][k + 1];  // Top-right.

            totalCells += theGrid[j][k - 1];      // Mid-left.
            totalCells += theGrid[j][k + 1];      // Mid-center.

            totalCells += theGrid[j + 1][k - 1];  // Bot-left.
            totalCells += theGrid[j + 1][k];      // Bot-center.
            totalCells += theGrid[j + 1][k + 1];  // Bot-right.

            /* Apply the rules to each cell. */
            switch (totalCells) {
                case 2:  mirrorGrid[j][k] = theGrid[j][k]; break;
                case 3:  mirrorGrid[j][k] = 1;             break;
                default: mirrorGrid[j][k] = 0; 
            }
        }
    }

    /* Mirror edges of grid to create a wrap-around effect. */
    for (let l = 1; l < gridHeight - 1; l++) {

        mirrorGrid[l][0] = mirrorGrid[l][gridHeight - 3];  // Top.
        mirrorGrid[0][l] = mirrorGrid[gridHeight - 3][l];  // Left.
        mirrorGrid[l][gridHeight - 2] = mirrorGrid[l][1];  // Bot.
        mirrorGrid[gridHeight - 2][l] = mirrorGrid[1][l];  // Right.
    }

    /* Swap grids. */
    let temp = theGrid;
    theGrid = mirrorGrid;
    mirrorGrid = temp;
}
