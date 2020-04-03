/* == Vertical Shooter using HTML5 Canvas ==
   Credit to Mike Thomas for his help. */

const canvas = document.querySelector('canvas'),
      ctx    = canvas.getContext('2d'),
      height = canvas.height = 600,
      width  = canvas.width  = 600;

// Setup our background.
let starfield, 
	starX  = 0, 
	starY  = 0, 
	starY2 = -600;

// Setup our ship.
let ship,
	ship_w = 50,
	ship_h = 50,
	ship_x = (width / 2) - 25,
	ship_y = height - 75;

// Setup our enemies.
let enemySprite, 
	enemies    = [], 
	enemyTotal = 5, 
	speed      = 3, 
	heading    = 0,
	enemy_x    = 50, 
	enemy_y    = -45, 
	enemy_w    = 50, 
	enemy_h    = 50;

// Setup our lasers.
let lasers     = [], 
	laserTotal = 4;

// Setup our controls.
let rightKey = false, 
	leftKey  = false,  
	upKey    = false, 
	downKey  = false;

// Setup our scoring.
let score = 0, 
	lives = 3, 
	alive = true;

// Setup our game flag.
let gameStarted = false;


function clearCanvas() {
	/* Standard method of clearing the canvas 
	   before the next frame. */

   	ctx.clearRect(0, 0, width, height);
}


function gameStart() {
  	/* Handles any logic needed after the init script,
	   but before the game loop. */
		 
	gameStarted = true;
  	canvas.removeEventListener('click', gameStart, false);
}


function reset() {
  	/* Resets the player and enemies to default positions. */
	
	ship_x = (width / 2) - 25; 
	ship_y = height - 75;

	let enemy_reset_x = 50;
	
  	if (enemies.length) enemies.forEach(enemy => {

    	enemy[0] = enemy_reset_x;
		enemy[1] = -45;
		enemy[4] = speed;
    	enemy_reset_x = enemy_reset_x + enemy_w + 60;
  	});
}


function checkLives() {
	/* Reduce player's life count by one. If the player
  	   no longer has any lives, trigger game over screen. */

  	lives -= 1;
	if (lives)  reset();
	if (!lives) alive = false;
}


function genEnemies() {
	/* Generate new enemies and introduce them at random
	   locations on the x-axis of the screen. */

  	if (enemies.length < enemyTotal) {

    	for (let i = enemies.length; i < enemyTotal; i++) {

      		// As player kills enemies, new enemies speed up.
      		let randSpeed = speed + (Math.random() * (score / 100));

      		// Give enemies a random chance of moving sideways.
      		heading = (Math.random() > 0.5) ? 1 : 0;

      		// If they do move sideways, make it a random direction.
      		if (heading) heading = (Math.random() - 0.5);

      		// Use results to push a new enemy object onto the list.
			enemies.push([
				(Math.random() * 500) + 50,
				-45,
				enemy_w,
				enemy_h,
				randSpeed,
				heading]);
    	}
  	}
}


function drawScoreBoard() {
	/* This function controls the start, score board,
	   and game over screens. */

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
    	ctx.fillRect((width / 2) - 70, (height / 2) + 10, 100, 40);
    	ctx.fillStyle = '#000';
    	ctx.fillText('Continue?', 250, (height / 2) + 35);
    	canvas.addEventListener('click', continueButton, false);
  	}
}

function drawStarfield() {
	/* Draw two instances of the starfield
	   image and scroll using +1 counter. */

  	ctx.drawImage(starfield, starX, starY);
  	ctx.drawImage(starfield, starX, starY2);
	  
	if (starY > 600)  starY = -599;
    if (starY2 > 600) starY2 = -599;
  
  	starY += 1;
  	starY2 += 1;
}

function drawEnemies() {
	/* Draw our enemies as objects on the screen. */

  	enemies.forEach( enemy => {
		  ctx.drawImage(enemySprite, enemy[0], enemy[1]);
	});
}


function drawShip() {
	/* Draw our player ship as an object on the screen. */

  	// Configure controls to move the player's ship.
  	if (rightKey) ship_x += 5;
	if (leftKey)  ship_x -= 5;
	if (upKey)    ship_y -= 5;
    if (downKey)  ship_y += 5;

  	// Constrain our steering controls to keep the
  	// player's ship within the canvas border.
	if (ship_x <= 0) ship_x = 0;
	if (ship_y <= 0) ship_y = 0;
  	if ((ship_x + ship_w) >= width) ship_x  = width - ship_w;
  	if ((ship_y + ship_h) >= height) ship_y = height - ship_h;

  	// Draw player's ship onto the canvas.
  	ctx.drawImage(ship, ship_x, ship_y);
}


function drawLaser() {
	/* Draw our laser bullet as an object on the screen. */

  	if (lasers.length) lasers.forEach(laser => {
    	ctx.fillStyle = '#f00';
      	ctx.fillRect(laser[0], laser[1], laser[2], laser[3]);
    });
  }


function moveEnemies() {
  	/* Animation method for moving our enemies between frames. */

  	if (enemies.length) enemies.forEach(enemy => {

    	// While enemy on-screen, move down based on speed value.
    	if (enemy[1] < height) { 
			enemy[1] += enemy[4];
		}
    	// Teleport enemies back to top of screen at random.
    	else if (enemy[1] > height - 1) {
      		enemy[0] = (Math.random() * 500) + 50;
      		enemy[1] = -45;
    	}

    	// Make enemies drift sideways.
		if (enemy[0] > enemy_w && 
			enemy[0] < (width - enemy_w)) {
			
			enemy[0] += enemy[5];
		}

    	// If enemy moves off-screen, reverse their direction.
    	else { enemy[0] += enemy[5] * -1; }
  	});
}


function moveLaser() {
	/* Animation method for moving our laser between frames. */
	
	if (lasers) lasers.forEach((laser, index) => {
		if (laser[1] > -11) laser[1] -= 10;
    	if (laser[1] < -10) lasers.splice(index, 1);
  	});
}


function shipCollision() {
	/* Hitbox logic which checks for collisions
	   between player and enemy ships. */

  	// Setup extra variables needed for hit detection.
  	let ship_xw = ship_x + ship_w,
      	ship_yh = ship_y + ship_h;

  	/* Loop through current enemy ships. Each block of
  	   conditions represent one side of the player's hitbox.
  	   If a collision is detected, cue the checkLives function. */
  	if (enemies.length) enemies.forEach(enemy => {

	if (ship_x > enemy[0] &&
		ship_y > enemy[1] &&
		ship_x < enemy[0] + enemy_w &&
		ship_y < enemy[1] + enemy_h) checkLives();

    if (ship_xw > enemy[0] &&
		ship_y > enemy[1]  &&
		ship_xw < enemy[0] + enemy_w &&
        ship_y < enemy[1]  + enemy_h) checkLives();

    if (ship_yh > enemy[1] &&
		ship_x > enemy[0]  &&
		ship_yh < enemy[1] + enemy_h &&
        ship_x < enemy[0]  + enemy_w) checkLives();

	if (ship_yh > enemy[1] && 
		ship_yh < enemy[1] + enemy_h &&
        ship_xw < enemy[0] + enemy_w &&
        ship_xw > enemy[0]) checkLives();
  	});
}


function laserCollision() {
	/* Hitbox logic which checks for (laser) collisions. */

  	let directHit = false;

  	if (lasers.length) lasers.forEach((laser, i) => {
    	if (enemies.length) enemies.forEach((enemy, j) => {
      		if (laser[1] <= (enemy[1] + enemy[3]) &&
				laser[0] >= enemy[0] &&
				laser[0] <= (enemy[0] + enemy[2])) {

          		directHit = true;
          		enemies.splice(j, 1);
          		score += 10;
          		genEnemies();
      		}
		});

    	// Remove laser object.
    	if (directHit) {
       		lasers.splice(i, 1);
      		directHit = false;
		}	
	});
}

function init() {
	/* The initialization script for the game. */

  	// Load our graphics.
  	ship        	= new Image();
  	ship.src        = 'static/img/ship.png';
  	enemySprite     = new Image();
  	enemySprite.src = 'static/img/8bit_enemy.png';
  	starfield 	    = new Image();
  	starfield.src   = 'static/img/starfield.jpg';

	window.addEventListener("keydown", e => {
		/* Prevent default scroll behavior of keys. */

		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
  	  	}
  	}, false);

  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  document.addEventListener('click', gameStart, false);

  // Generate enemies, set defaults, and start game loop.
  genEnemies();
  reset();
  gameLoop();
}

function gameLoop() {
	/* Main loop for running the game. */

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

function keyDown(event) {
  	/* Event logic for (down) key press. */

    switch (event.keyCode) {
		case 37: leftKey  = true; break;
  		case 38: upKey    = true; break;
		case 39: rightKey = true; break;
		case 40: downKey  = true; break;
		default:
	}

  	// Firing our laser.
  	if (event.keyCode == 88 && lasers.length <= laserTotal) {
		lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
	}
}

function keyUp(event) {
  	/* Event logic for (up) key release. */

    switch (event.keyCode) {
		case 37: leftKey  = false; break;
  		case 38: upKey    = false; break;
		case 39: rightKey = false; break;
		case 40: downKey  = false; break;
		default:
	}
  }

function continueButton(e) {
  	/* Event logic for detecting when the continue button
	   has been clicked by the user's mouse. */
	 
	const cursor = getCursorPos(e);
	  
  	if (cursor.x > (width / 2) - 20 &&
		cursor.x < (width / 2) + 100 && 
	  	cursor.y > (height /2) + 70 && 
		cursor.y < (height / 2) + 120) {

		score = 0; 
		lives = 3; 
		alive = true;

        reset();
		canvas.removeEventListener('click', continueButton, false);
	}
}
class cursorPosition {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	  }
}

function getCursorPos(e) {
	/* Detects the position of the mouse cursor, stores the results
	   as 'cursorPosition' object and returns the object. */

	let x, y;
	  
  	if (e.pageX || e.pageY) {
    	x = e.pageX;
    	y = e.pageY;
	}

	else {
    	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    	y = e.clienty + document.body.scrollTop + document.documentElement.scrollTop;
  	}

  	// Factor in the offset of our canvas.
  	x -= canvas.offsetLeft;
  	y -= canvas.offsetTop;

  	return new cursorPosition(x, y);
}

// When the browser window loads, call our init function.
window.onload = init;
