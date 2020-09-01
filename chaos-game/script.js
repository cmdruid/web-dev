let x, y, ax, ay, bx, by, cx, cy;

function setup() {

    // Create canvas with three points.
    createCanvas(windowWidth, windowHeight);
    ax = width / 2;
    ay = 0;
    bx = 0;
    by = height;
    cx = width;
    cy = height;

    // Init our random x,y points.

    x = random(width);
    y = random(height);


    // Configure our styles.
    background(0);
    stroke(255);
    strokeWeight(8);
    point(ax, ay);
    point(bx, by);
    point(cx, cy);
}

function draw() {
    for (let i = 0; i < 100; i++) {

        // stuff
        let r = floor(random(3));

        strokeWeight(2);
        point(x, y);

        if (r == 0) {
            stroke(255, 0, 255);
            x = lerp(x, ax, 0.5);
            y = lerp(y, ay, 0.5);
        }
        
        else if (r == 1) {
            stroke(0, 255, 255);
            x = lerp(x, bx, 0.5);
            y = lerp(y, by, 0.5);
        }

        else if (r == 2) {
            stroke(255, 255, 0);
            x = lerp(x, cx, 0.5);
            y = lerp(y, cy, 0.5);
        }
    }
}