export default function Car(id, params) {
    /* Pass through starting timestamp
       perform calculation
       add execution time to timestamp, rounding up/down.
       poll starting time each second.
    */

    this.id         = id;
    this.laps       = [];
    this.engine     = this.startEngine(params);
    this.logData    = params.logData                  || false;
    this.logMetrics = params.logMetrics               || false;
}


Car.prototype.runLaps = async function runLaps(numLaps) {

    let currLap = 0, maxLaps = numLaps || 1;

    return new Promise((resolve, reject) => {

        performance.mark('raceStart')

        while (currLap < maxLaps) { this.runEngine(currLap).then(++currLap); }

        let { startTime, duration } = performance.measure('race', 'raceStart').toJSON();

        resolve({
            id       : this.id,
            start     : startTime,
            finish    : startTime + duration,
            dur       : duration,
            totalLaps : currLap,
            laps      : this.laps    || null,
            metrics   : this.metrics || null
        });
    });
}


Car.prototype.runEngine = function runEngine(currLap) {

    const { logData = false, logMetrics = false } = this || {};

    return new Promise((resolve, reject) => {

        let steps = 0, bias = 0, total = 0, engineState = 1;

        if (logData) performance.mark('start');

        while (engineState) {
            engineState = this.engine.next().value;

            if (logMetrics) {
                ++steps;
                bias  = (engineState >= 0) ? ++bias : --bias;
                total = total + engineState;
            }
        }

        if (logMetrics && !this.metrics) this.metrics = { steps: steps, bias: bias, total: total }

        if (logData) {
            let { startTime, duration } = performance.measure('lap', 'start').toJSON();

            this.laps.push({
                lap: currLap,
                start: startTime,
                finish: startTime + duration,
                dur: duration
            });
        };

        resolve();
    });
}


Car.prototype.logger = function logger(input, params) {

}


Car.prototype.startEngine = function * startEngine(params) {
    /* The revolutions :max: of the engine determine the speed
       of the car - i.e the execution time.*/

    let { mod = this.id,
          a   = 0,
          b   = 1 } = params || {};
    
    let carry, phase;

    while (true) {

        carry = a;
        a     = a + b;
        b     = carry;

        if (a === mod) {

            a = phase ? 0 : mod;

            yield a * -1;

            phase = !phase;

        } else if (a > mod) {

            a = a % mod;

            yield a * -1;

        } else if (a < mod) {

            yield a;

        } else { continue; }
    }
}