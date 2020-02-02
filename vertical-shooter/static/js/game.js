/* == Vertical Shooter using HTML5 Canvas ==
* Credit to Mike Thomas for helping me write this.
* Checkout his website at http://atomicrobotdesign.com/.
*
* TODO:
* - Add pause function.
* - Add explosion on ship death.
* - Add music and sfx.
* - Give enemies lasers too? Or make them asteroids (or both)
* - Add some bombs.
* - Breakup code into separate files?
* - Credit image to NASA (and add link).
*/

// Setup our canvas.
var canvas, ctx, width = 600, height = 600;

  // Setup our background.
  var starfield, starX = 0, starY = 0, starY2 = -600;

  // Setup our ship.
  var ship, ship_w = 50, ship_h = 50,
  ship_x = (width / 2) - 25, ship_y = height - 75;

  // Setup our enemies.
  var enemy, enemies = [], enemyTotal = 5, speed = 3, heading = 0,
  enemy_x = 50, enemy_y = -45, enemy_w = 50, enemy_h = 50;

  // Setup our lasers.
  var lasers = [], laserTotal = 4;

  // Setup our controls.
  var rightKey = false, leftKey = false,  upKey = false, downKey = false;

  // Setup our scoring.
  var score = 0, lives = 3, alive = true;

  // Setup our game flag.
  var gameStarted = false;


function clearCanvas() {
  /* == clearCanvas ==
  * Standard method of clearing the canvas before the next frame.
  */
  ctx.clearRect(0, 0, width, height);
}


function gameStart() {
  /* == gameStart ==
  * Handles any logic needed after the init script,
  * but before the game loop.
  */
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
}


function reset() {
  /* == reset ==
  * Resets the player and enemies to default positions.
  */
  var enemy_reset_x = 50;
  ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 57;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i][0] = enemy_reset_x;
    enemies[i][1] = -45;
    enemy_reset_x = enemy_reset_x + enemy_w + 60;
  }
}


function checkLives() {
  /* == checkLives ==
  * Reduce player's life count by one. If the player
  * no longer has any lives, trigger game over screen.
  */

  lives -= 1;
  if (lives > 0) {
    reset();
  } else if (lives == 0) {
    alive = false;
  }
}


function genEnemies() {
  /* == genEnemies ==
  * Generate new enemies and introduce them at random
  * locations on the x-axis of the screen.
  */

  if (enemies.length < enemyTotal) {
    for (var i = enemies.length; i < enemyTotal; i++) {

      // As player kills enemies, new enemies speed up.
      newSpeed = speed + (score / 100);

      // Give enemies a random chance of moving sideways.
      heading = (Math.random() > 0.5) ? 1 : 0;

      // If they do move sideways, make it a random direction.
      if (heading) heading = (Math.random() - 0.5);

      // Use results to push a new enemy object onto the list.
      enemies.push([(Math.random() * 500) + 50, -45,
                    enemy_w, enemy_h, newSpeed, heading]);
    }
  }
}


function drawScoreBoard() {
  /* == scoreBoard ==
  * This function controls the start, score board,
  * and game over screens.
  */

  // Show score board.
  ctx.font = 'bold 18px VT323';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ', 10, 55);
  ctx.fillText(score, 70, 55);
  ctx.fillText('Lives', 10, 30);
  ctx.fillText(lives, 68, 30);

  // If the game hasn't started, show start screen.
  if (!gameStarted) {
    ctx.font = 'bold 50px VT323';
    ctx.fillText('Canvas Shooter', width / 2 - 150, height / 2);
    ctx.font = 'bold 20px VT323';
    ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
    ctx.fillText('Use arrow keys to move', width / 2 - 100, height / 2 + 60);
    ctx.fillText('Use the x key to shoot', width / 2 - 100, height / 2 + 90);

  }

  // If dead, show game over screen.
  if (!alive) {
    ctx.fillText('Game Over!', 245, height / 2);
    ctx.fillRect((width / 2) - 60, (height / 2) + 10, 100, 40);
    ctx.fillStyle = '#000';
    ctx.fillText('Continue?', 250, (height / 2) + 35);
    canvas.addEventListener('click', continueButton, false);
  }
}


function drawStarfield() {
  /* == drawStarfield ==
  * Draw two instances of the starfield
  * image and scroll using +1 counter.
  */
  ctx.drawImage(starfield, starX, starY);
  ctx.drawImage(starfield, starX, starY2);
  if (starY > 600) {
    starY = -599;
  }
  if (starY2 > 600) {
    starY2 = -599;
  }
  starY += 1;
  starY2 += 1;
}

function drawEnemies() {
  /* == drawEnemies ==
  * Draw our enemies as objects on the screen.
  */
  for (var i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
  }
}


function drawShip() {
  /* == drawShip ==
  * Draw our player ship as an object on the screen.
  */

  // Configure controls to move the player's ship.
  if (rightKey)
    ship_x += 5;
  else if (leftKey)
    ship_x -= 5;
  if (upKey)
    ship_y -= 5;
  else if (downKey)
    ship_y += 5;

  // Constrain our steering controls to keep the
  // player's ship within the canvas border.
  if (ship_x <= 0)
    ship_x = 0;
  if ((ship_x + ship_w) >= width)
    ship_x = width - ship_w;
  if (ship_y <= 0)
    ship_y = 0;
  if ((ship_y + ship_h) >= height)
    ship_y = height - ship_h;

  // Draw player's ship onto the canvas.
  ctx.drawImage(ship, ship_x, ship_y);
}


function drawLaser() {
  /* == drawLaser ==
  * Draw our laser bullet as an object on the screen.
  */
  if (lasers.length)
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(lasers[i][0], lasers[i][1], lasers[i][2], lasers[i][3]);
    }
  }


function moveEnemies() {
  /* == moveEnemies ==
  * Animation method for moving our enemies between frames.
  */
  for (var i = 0; i < enemies.length; i++) {

    // While enemy is on-screen, move them downwards
    // based on speed value.
    if (enemies[i][1] < height) {
      enemies[i][1] += enemies[i][4];

    // If enemy moves below screen, respawn them at
    // top of screen in a random location and
    } else if (enemies[i][1] > height - 1) {
      enemies[i][0] = (Math.random() * 500) + 50;
      enemies[i][1] = -45;
    }

    // While enemy is on-screen, move them sideways
    // using their heading value.
    if (enemies[i][0] > enemy_w && enemies[i][0] < (width - enemy_w)) {
      enemies[i][0] += enemies[i][5];

    // If enemy moves off-screen, reverse their direction.
    } else {
      enemies[i][0] += enemies[i][5] * -1;
    }
  }
}


function moveLaser() {
  /* == moveLaser ==
  * Animation method for moving our laser between frames.
  */
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
}


function shipCollision() {
  /* == shipCollision ==
  * Hitbox logic which checks for collisions
  * between player and enemy ships.
  */

  // Setup extra variables needed for hit detection.
  var ship_xw = ship_x + ship_w,
      ship_yh = ship_y + ship_h;

  // Loop through current enemy ships. Each block of
  // conditions represent one side of the player's hitbox.
  // If a collision is detected, cue the checkLives function.
  for (var i = 0; i < enemies.length; i++) {

    if (ship_x > enemies[i][0]
        && ship_x < enemies[i][0] + enemy_w
        && ship_y > enemies[i][1]
        && ship_y < enemies[i][1] + enemy_h) {
          checkLives();
    }
    if (ship_xw < enemies[i][0] + enemy_w
        && ship_xw > enemies[i][0]
        && ship_y > enemies[i][1]
        && ship_y < enemies[i][1] + enemy_h) {
          checkLives();
    }
    if (ship_yh > enemies[i][1]
        && ship_yh < enemies[i][1] + enemy_h
        && ship_x > enemies[i][0]
        && ship_x < enemies[i][0] + enemy_w) {
          checkLives();
    }
    if (ship_yh > enemies[i][1]
        && ship_yh < enemies[i][1] + enemy_h
        && ship_xw < enemies[i][0] + enemy_w
        && ship_xw > enemies[i][0]) {
          checkLives();
    }
  }
}


function laserCollision() {
  /* == laserCollision ==
  * Hitbox logic which checks for (laser) collisions.
  */

  // Boolean toggle for hit.
  var directHit = false;

  // For each laser object:
  for (var i = 0; i < lasers.length; i++) {

    // Evaluate against each enemy ship:
    for (var j = 0; j < enemies.length; j++) {

      // If laser y-coords is <= enemy y-coords + height. (too far!)
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3])

      // If laser x-coords >= enemy x-coords. (within target)
          && lasers[i][0] >= enemies[j][0]

      // If laser x-coords is <= enemy x-coords + width. (too wide!)
          && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {

          // Remove enemy object, cue removal of laser object.
          directHit = true;
          enemies.splice(j, 1);

          // Increase our score and generate more enemies.
          score += 10;
          genEnemies();
      }
    }

    // Remove laser object.
    if (directHit == true) {
      lasers.splice(i, 1);
      directHit = false;
    }
  }
}


function init() {
  /* == init ==
  * The initialization script for the game.
  */

  // Get the canvas and its context.
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // Load our graphics.
  ship = new Image();
  ship.src = 'static/img/ship.png';
  enemy = new Image();
  enemy.src = 'static/img/8bit_enemy.png';
  starfield = new Image();
  starfield.src = 'static/img/starfield.jpg';

  // Event listeners for key presses.
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  document.addEventListener('click', gameStart, false);

  // Experimental touch controls.
  registerControls();

  // Generate enemies, set defaults, and start game loop.
  genEnemies();
  reset();
  gameLoop();
}


function gameLoop() {
  /* == gameLoop ==
  * Main loop for running the game.
  */

  // On each frame, run these functions.
  clearCanvas();
  drawStarfield();
  drawScoreBoard();

  // While game is playing, also run these functions.
  if (alive && gameStarted && lives > 0) {
    drawEnemies();
    drawShip();
    drawLaser();
    moveEnemies();
    moveLaser();
    laserCollision();
    shipCollision();
  }

  // Recursively call our game loop (at 30fps).
  game = setTimeout(gameLoop, 1000 / 30);
}


function keyDown(e) {
  /* == keyDown ==
  * Event logic for (down) key press.
  */

  // Steering controls.
  if (e.keyCode == 39)
    rightKey = true;
  else if (e.keyCode == 37)
    leftKey = true;
  if (e.keyCode == 38)
    upKey = true;
  else if (e.keyCode == 40)
    downKey = true;

  // Firing our laser.
  if (e.keyCode == 88 && lasers.length <= laserTotal)
    lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
  }


function keyUp(e) {
  /* == keyUp ==
  * Event logic for (up) key release.
  */

  if (e.keyCode == 39)
    rightKey = false;
  else if (e.keyCode == 37)
    leftKey = false;
  if (e.keyCode == 38)
    upKey = false;
  else if (e.keyCode == 40)
    downKey = false;
  }


function continueButton(e) {
  /* == continueButton ==
  * Event logic for detecting when the continue button
  * has been clicked by the user's mouse.
  */
  var cursorPos = getCursorPos(e);
  if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47
      && cursorPos.y > (height /2) + 10
      && cursorPos.y < (height / 2) + 50) {
        score = 0, lives = 3, alive = true;
        reset();
        canvas.removeEventListener('click', continueButton, false);
  }
}


function registerControls() {
  /* == touchControls ==
  * Setup touch events for mobile and other devices
  * using HTML5 canvas event listeners for touch input.
  */

  var playerX = ship_x, playerY = ship_y,
      playerWidth = ship_w, playerHeight = ship_h;

  var canvas = document.getElementsByTagName("canvas")[0];

  canvas.addEventListener("touchstart", touchHandler);
  canvas.addEventListener("touchmove", touchHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);

  function mouseMoveHandler(e) {
    playerX = e.pageX - canvas.offsetLeft - playerWidth / 2;
    playerY = e.pageY - canvas.offsetTop - playerHeight / 2;
    output.innerHTML = "Mouse: x(" + playerX + ") y(" + playerY + ")";
  }

  function touchHandler(e) {
    if (e.touches) {
      playerX = e.touches[0].pageX - canvas.offsetLeft - playerWidth / 2;
      playerY = e.touches[0].pageY - canvas.offsetTop - playerHeight / 2;
      output.innerHTML = "Touch: x(" + playerX + ") y(" + playerY + ")";
      e.preventDefault();
    }
  }
}


function touchControlsBeta() {

  // Touch-start event.
  canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

  // Touch-end event.
  canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  }, false);

  // Touch-move event.
  canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }, false);

  // Get touch position relative to the canvas.
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  }
}




function getCursorPos(e) {
  /* == getCursorPos ==
  * Detects the position of the mouse cursor, stores the results
  * as 'cursorPosition' object and returns the object.
  */

  // Define our custom object to return later.
  function cursorPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // Detect the cursor position coordinates on the screen.
  var x, y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clienty + document.body.scrollTop + document.documentElement.scrollTop;
  }

  // Factor in the offset of our canvas.
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  // Store results as custom object and return results.
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}


// When the browser window loads, call our init function.
window.onload = init;
