// Init the global list variable for our circles.
var circles = []

// Init the filename array of our sound files.
var sounds = ['bubbles', 'clay', 'confetti', 'corona', 'dotted-spiral',
              'flash-1', 'flash-2', 'flash-3', 'glimmer', 'moon', 'pinwheel',
              'piston-1', 'piston-2', 'piston-3', 'prism-1', 'prism-2',
              'prism-3', 'splits', 'squiggle', 'strike', 'suspension', 'timer',
              'ufo', 'veil', 'wipe', 'zig-zag'
            ]

// Draw some helper text on the canvas.
var text = new PointText(new Point(view.size.width / 2, 50));
text.justification = 'center';
text.fontFamily = 'Roboto';
text.fontSize = '20px';
text.fillColor = 'white';
text.content = 'Press any key from a to z...';

function createCircle(size, color) {
  /* Draw a circle at a random point within the browser window,
     give it a :size: and :color:, then add it to the array. */

  var maxPoint = new Point(view.size.width, view.size.height);
  var randomPoint = Point.random();
  var point = maxPoint * randomPoint;

  var newCircle = new Path.Circle(point, size);
  newCircle.fillColor = color;
  circles.push(newCircle);
}

function playSound(filename) {
  /* Fetch the sound file via :filename:, then play the sound. */

  var sound = new Howl({src: ['static/sounds/' + filename + '.mp3']});
  sound.play();
}

function random(range) {
  /* Generate a random number within :range: values. */

  return Math.floor(Math.random() * (range));
}

function randomColor(key) {
  /* Use the range of alphabet characters (0-25) in order to select an
     rgb channel, then bias that channel using the key character. */

  // Create a random rgba value (hue remains fixed).
  rgba = [random(256),random(256),random(256),1]
  // Floor-divide the key by 8 in order to get a number between 0-2.
  channel = Math.floor(key / 8);
  // Make sure the provided number does not exceed 2.
  index = (channel < 3) ? channel : 2;
  // Use the calcualated number to select an rgb channel, then add a bias.
  rgba[index] = ((key % 8) * key) + 100;
  // Return the resulting rgb value.
  return 'rgba(' + rgba.toString() + ')';
}

function onKeyDown(e) {
  /* Main event loop. On key-press event, get the alphanumeric code of
     the key pressed, then use it to generate a circle with a unique
     color and sound. */

  keyCode = e.event.keyCode;
  key = (96 < keyCode && keyCode < 123) ? keyCode - 97 : 0;
  createCircle(500, randomColor(key));
  playSound(sounds[key]);
}

function onFrame(e) {
  /* Main animation loop. For each circle, on every frame, reduce its scale
     while also icnreasing its color hue. Once the circle shrinks below a
     certain size, remove it from the array. */
     
  for (var i = 0; i < circles.length; i++) {
    circles[i].fillColor.hue += 1;
    circles[i].scale(.9);
    if (circles[i].area < 1) {
      circles[i].remove();
      circles.splice(i, 1);
    }
  }
}
