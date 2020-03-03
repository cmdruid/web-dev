// Imports
import loadAssets from './loadAssets.js';

// Title screen


export default class TitleScene extends Phaser.Scene {

  // Prepare Assets.
  constructor() {
    super("bootGame");
  }

  // Preload Assets.
  preload() {
    loadAssets().call(this);
  }

  // Create Scene.
  create() {
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame")
  }

  // Update Scene.
}
