// Title screen

class TitleScene extends Phaser.Scene {

  // Prepare Assets.
  constructor() {
    super("bootGame");
  }

  // Preload Assets.
  preload() {
    this.load.image("background", "static/assets/images/background.png")
    this.load.image("ship", "static/assets/images/ship.png")
    this.load.image("ship2", "static/assets/images/ship2.png")
    this.load.image("ship3", "static/assets/images/ship3.png")

  }

  // Create Scene.
  create() {
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame")
  }

  // Update Scene.
}
