// Game Scene

export default class GameScene extends Phaser.Scene {

  // Prepare Assets.
  constructor() {
    super("playGame");
  }

  // Pre-load Assets.

  // Create Scene.
  create() {

    // Load background.
    this.background = this.add.tileSprite(0, 0,
      config.width, config.height, "background");
    this.background.setOrigin(0,0);

    // Load ship assets.
    // 0.1 change from image to sprite
    this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship");
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

    // 0.2 create animations
    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    // Set ships as interactive, meaning we can click on them.
    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();


    // Set event listener for 'gameobjectdown',
    // run destroyShip function on scope 'this'.
    this.input.on('gameobjectdown', this.destroyShip, this);

    // 0.3 play the animations
    this.ship1.play("ship1_anim", true);
    this.ship2.play("ship2_anim", true);
    this.ship3.play("ship3_anim", true);

    // Add some text to screen.
    this.add.text(20, 20, "Playing game", {
      font: "25px Arial",
      fill: "yellow"
    });
  }

  // Update Scene.
  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;
  }

  // Helper Functions.
  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y  = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    /* == Destroy Ship ==
    * Switch sprite texture to explosion,
    * then play animation.
    *
    * Note: We must accept pointer input,
    * even though we won't be using it.
    * This is because js doesn't do optional
    * keyword args very well. */
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }
}
