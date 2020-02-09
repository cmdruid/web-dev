// Main Program

var config = {
  // Set size and color of phaser canvas.
  // Note: Should match size of background assets.
  width: 256,
  height: 272,
  backgroundColor: 0x000000,
  parent: "gameCanvas",
  // Load scene files.
  scene: [TitleScene, GameScene]
}

// Start game with above configuration.
var game = new Phaser.Game(config);
