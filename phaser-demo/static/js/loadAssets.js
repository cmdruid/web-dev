// Imports

// Script for loading game assets.

export default function loadAssets() {

  Loader = new LoaderPlugin(scene);

  Loader.Start()

  this.load.image("background", "static/assets/images/background.png")

  this.load.spritesheet("ship", "static/assets/spritesheets/ship.png", {
    frameWidth: 16,
    frameHeight:16
  });
  this.load.spritesheet("ship2", "static/assets/spritesheets/ship2.png", {
    frameWidth: 32,
    frameHeight:16
  });
  this.load.spritesheet("ship3", "static/assets/spritesheets/ship3.png", {
    frameWidth: 32,
    frameHeight:32
  });
  this.load.spritesheet("explosion", "static/assets/spritesheets/explosion.png", {
    frameWidth: 16,
    frameHeight:16
  });
  this.load.spritesheet("power-up", "static/assets/spritesheets/power-up.png", {
    frameWidth: 16,
    frameHeight:16
  })
}
