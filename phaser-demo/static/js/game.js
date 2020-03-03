// Imports
import TitleScene from './TitleScene.js';
import GameScene from './GameScene.js';

// Main Program
// Using tutorial https://www.youtube.com/watch?v=frRWKxB9Hm0

var config = {

  // Phaser canvas.
  // Note: canvas size should match background assets.
  width: 256,
  height: 272,
  backgroundColor: 0x000000,
  parent: "gameCanvas",

  // Load scene files.
  scene: [TitleScene, GameScene],

  // Game configs.
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {debug: false}
  }
}

// Start game with above configuration.
var game = new Phaser.Game(config);
