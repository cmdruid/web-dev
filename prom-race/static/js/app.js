/* == [ PROMISE RACING ] ========================================== *
  TODO: Logic( create cars, define lap, run laps, finish car object).

 * ================================================================ */

import Car    from '/static/js/car.js';
import Square from '/static/js/square.js';

/* == Global Configuration == */
const formElem = document.querySelector('form'),
      errElem  = document.querySelector('.error'),
      gridElem = document.querySelector('.grid');

const c          = document.querySelector('canvas'),
      ctx        = c.getContext("2d"),
      gridHeight = c.height = 400,
      gridWidth  = c.width  = 400;

const cars  = [],
      races = [],
      grid  = [];

errElem.style.display = "none";


/* == Form Execution Loop == */
formElem.addEventListener("submit", async (e) => {

    e.preventDefault();
    
    console.log("form submitted!");

    const formData = new FormData(formElem);

    const params = {
        numCars: formData.get('numCars') || 10,
        numLaps: formData.get('numLaps') || 1,
        start: formData.get('startLine') || 0,
        logData: true,
        logMetrics: true
    };

    console.log('Params: ', params);

    prepareRace(params);

    let results = await startRace(params);

    let winner = results[0];

    console.log(`... and the winnner is car #${winner.id} at ${winner.dur}ms!`);
})


async function startRace(params) {

    races.length = 0;

    cars.forEach(car => {
        let race = car.runLaps(params.numLaps);
        races.push(race);
    });

    let results = await Promise.all(races);

    results.sort(function(a, b) { return a.dur - b.dur });

    let min = results[0].dur,
        max = results[results.length-2].dur;

    results.forEach(result => {
        let square = grid.find(square => square.id === result.id),
            color  = 255 - (((result.dur - min) * 255) / (max - min));

        let rgba = `0, ${Math.floor(color)}, 0, 1`;

        square.setTooltip(JSON.stringify(result));
        square.applyColor(`rgba(${rgba})`);
    });

    updateGrid();
        
    console.log('Results: ', results);

    return results;
}


function prepareRace(params) {

    let [ min, max ] = getRange(params);

    cars.length = 0; grid.length = 0;

    for (let i = min; i < max; i++) {
        let car    = new Car(i, params),
            square = new Square(i);

        cars.push(car);
        grid.push(square);
    }

    console.log(`${cars.length} cars are ready to race!`, );
}


function getRange(params) {

    const { start = 0 } = params || {};

    let carry, a = 0, b = 1;

    while (start && a < start) {
        carry = a;
        a = a + b;
        b = carry;
    }

    return (start) ? [ b + 1, a ] : [9, 12];

}


function updateGrid() {
    gridElem.innerHTML = '';
    grid.forEach(square => gridElem.appendChild(square.elem));
}


function tabulateResults() {

    
}
