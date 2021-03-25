const form = document.querySelector('form');
var   timer;
      
form.addEventListener('submit', e => {
    e.preventDefault();

    let rawData  = new FormData(form),
        formData = {};
    
    for (let pair of rawData.entries()) formData[pair[0]] = pair[1];
    draw(formData);
});

async function draw(params) {

    const pen       = new PenTool('#draw', params),
          ticker    = new TickerTool('#wave'),
          sequence  = generator(params),
          length    = params.draw || "bias",
          angle     = params.turn || "num",
          mark      = params.mark || 0;
          scale     = Math.min(parseFloat(params.scale), 1.0),
          delay     = Math.min(parseInt(params.delay), 500) || 0;
    
    let   current,
          maxSteps  = 10000;
          count     = Math.min(parseInt(params.count), 100);
  
    console.log(mark);
    pen.clearCanvas();
    ticker.clearTicker();

    while (maxSteps && count) {

        if (delay) {
            await sleep(delay);
            current = sequence.next().value;
        } else { current = sequence.next().value; }

        switch(current.state) {
            case  1: pen.left(current[angle]);   break;
            case -1: pen.right(current[angle]);  break;
            default: if (mark) pen.mark();     --count;
        }

        pen.penDown = 1;
        pen.move(current[length] * scale);
        pen.penDown = 0;

        ticker.scroll(current);
        --maxSteps;
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        clearTimeout(timer);
        timer = setTimeout(resolve, ms);
    });
}

function * generator (params) {

    let base  = parseFloat(params.base) || 60.0,
        a     = parseFloat(params.a)    || 0.0,
        b     = parseFloat(params.b)    || 1.0,
        limit = parseInt(params.limit)  || 0;

    let temp,  loop,  step,  bias,  phase;
        temp = loop = step = bias = phase = 0;

    while (true) {

        temp = a;
        a = a + b;
        b = temp;
        ++step;
            
        if (a === base) {

            a = phase ? 0 : base;
            phase = !phase;

            yield {
                loop: ++loop, 
                state: 0, 
                step: step, 
                num: a,
                bias: 0
            };

            step = 0;
            bias = (limit && loop % limit === 0) ? 0 : bias;

        } else if (a > base) {
            a = a % base;

            yield {
                loop: loop,
                state: -1,
                step: step,
                num: a,
                bias: --bias
            };

        } else if (a < base) {

            yield {
                loop: loop,
                state: 1,
                step: step,
                num: a,
                bias: ++bias
            };

        } else { continue; }
    }
}

class Canvas {
    constructor(selector) {
        this.element = document.querySelector(selector) || 'canvas';
        this.width   = this.element.width = this.element.offsetWidth;
        this.height  = this.element.height = Math.min(this.element.offsetWidth, 500);
        this.ctx     = this.element.getContext('2d');
        this.setSize();
    }

    setSize() {
        const parent = this.element.parent; // .getBoundingClientRect();
        console.log(parent);

    }
}

class PenTool {
    constructor(canvas, params) {
        this.canvas    = new Canvas(canvas);
        this.ctx       = this.canvas.ctx;
        this.x         = (this.canvas.width  / 2) + parseInt(params.xo);
        this.y         = (this.canvas.height / 2) + parseInt(params.yo) - 100;
        this.color     = params.drawColor || "#FFFFFF";
        this.markColor = params.markColor || "#AFAFAF";
        this.angle     = 0;
        this.penDown   = 0;
        this.lineWidth = 1;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    move(length) {

        let x0 = this.x,
            y0 = this.y;

        this.x += length * Math.sin(this.angle);
        this.y += length * Math.cos(this.angle);

        if (this.canvas) {
            let ctx = this.ctx;
            if (this.penDown) {
                ctx.beginPath();
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.color;
                ctx.moveTo(x0, y0);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
            } else { c.moveTo(this.x, this.y); }
        }
        return this;
    }

    left(degrees) {
        this.angle += degrees * Math.PI / 180.0;
        return this;
    }
    
    right(degrees) {
        this.left(-degrees);
        return this;
    }

    mark() {
        let ctx  = this.ctx,
            size = 5;
        ctx.beginPath();
        ctx.fillStyle = this.markColor;
        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class TickerTool {
    constructor(selector) {
        this.array           = [];
        this.counter         = 0;
        this.maxArraySize    = 200;
        this.maxStringLength = 36;
        this.display         = document.querySelector(selector);
    }

    format(data) {

        let num    = data.num.toString(),
            step   = 'S:' + data.step.toString(),
            bias   = 'B:' + data.bias.toString(),
            max    = this.maxStringLength,
            center = max / 2;

        switch(data.state) {
            case  1: this.counter += 1; num = num + '+';  break;
            case -1: this.counter -= 1; num = '-' + num;  break;
            default: this.counter  = 0; num = `(${num})`; break;
            }

        const offset = center + this.counter;

        num = num.padStart(offset, ' ').padEnd(max, ' ');
        return step.padEnd(5, ' ') + num + bias;
    }

    scroll(data) {

        let array   = this.array,
            maxSize = this.maxArraySize,
            string  = this.format(data),
            loop    = data.loop;
        
        if (loop && loop === 1) this.maxSize = (data.step * 2) + 2;
        if (array.length >= this.maxSize) array.shift();

        if (string) array.push(string);
        this.display.innerText = array.join('\n');
    }

    clearTicker() { this.display.innerText = ''; }
}

console.log("canvas.js loaded!");