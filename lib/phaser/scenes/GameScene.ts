// lib/phaser/scenes/GameScene.ts
import { TILE_SIZE } from "../config";

export function createGameScene(Phaser: any) {
  return class GameScene extends Phaser.Scene {
    private player: any;
    private cursors: any;
    private wasd: any;
    private dayOverlay: any;
    private timeOfDay: number = 0.5;
    private daySpeed: number = 0.0001;
    private collisionLayer: any;

    constructor() {
      super({ key: "GameScene" });
    }

    preload() {
      this.load.image(
        "tileset",
        "/assets/tilemaps/tileset.png"
      );
      this.load.tilemapTiledJSON(
        "map",
        "/assets/tilemaps/map.json"
      );
    }

    create() {
      this.buildWorld();
      this.createPlayer();
      this.setupCollision();
      this.createDayNightOverlay();
      this.setupCamera();
      this.setupInput(Phaser);
    }

    // --- WORLD ---

    private buildWorld() {
      const map = this.make.tilemap({ key: "map" });
      const tileset = map.addTilesetImage("hollow-home", "tileset");

      // Render layers in order (bottom to top)
      map.createLayer("ground", tileset, 0, 0);
      map.createLayer("decoration", tileset, 0, 0);

      // Collision layer — we'll make it invisible
      this.collisionLayer = map.createLayer("collision", tileset, 0, 0);
      this.collisionLayer.setVisible(false);
      this.collisionLayer.setCollisionByExclusion([-1]); // All painted tiles block

      // Above layer renders on top of player
      const aboveLayer = map.createLayer("above", tileset, 0, 0);
      if (aboveLayer) aboveLayer.setDepth(10);

      // Set world bounds to map size
      this.physics.world.setBounds(
        0, 0,
        map.widthInPixels,
        map.heightInPixels
      );
    }

    // --- PLAYER ---

    private createPlayer() {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xf5e6c8);
      graphics.fillRect(0, 0, TILE_SIZE * 0.7, TILE_SIZE * 0.9);
      graphics.generateTexture("player", TILE_SIZE * 0.7, TILE_SIZE * 0.9);
      graphics.destroy();

      this.player = this.physics.add.sprite(
        25 * TILE_SIZE,
        25 * TILE_SIZE,
        "player"
      );
      this.player.setCollideWorldBounds(true);
    }

    // --- COLLISION ---

    private setupCollision() {
      if (this.collisionLayer) {
        this.physics.add.collider(this.player, this.collisionLayer);
      }
    }

    // --- DAY/NIGHT ---

    private createDayNightOverlay() {
      const mapWidth = 50 * TILE_SIZE;
      const mapHeight = 50 * TILE_SIZE;

      this.dayOverlay = this.add
        .rectangle(0, 0, mapWidth, mapHeight, 0x00001a, 0)
        .setOrigin(0, 0)
        .setDepth(100);
    }

    private updateDayNight() {
      this.timeOfDay += this.daySpeed;
      if (this.timeOfDay >= 1) this.timeOfDay = 0;

      const distanceFromNoon = Math.abs(this.timeOfDay - 0.5) * 2;
      const alpha = distanceFromNoon * 0.85;
      this.dayOverlay.setAlpha(alpha);
    }

    // --- CAMERA ---

    private setupCamera() {
      const mapWidth = 50 * TILE_SIZE;
      const mapHeight = 50 * TILE_SIZE;

      this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1.5);
    }

    // --- INPUT ---

    private setupInput(Phaser: any) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    private handleMovement() {
      const speed = 120;
      const body = this.player.body;
      body.setVelocity(0);

      const left = this.cursors.left.isDown || this.wasd.left.isDown;
      const right = this.cursors.right.isDown || this.wasd.right.isDown;
      const up = this.cursors.up.isDown || this.wasd.up.isDown;
      const down = this.cursors.down.isDown || this.wasd.down.isDown;

      if (left) body.setVelocityX(-speed);
      if (right) body.setVelocityX(speed);
      if (up) body.setVelocityY(-speed);
      if (down) body.setVelocityY(speed);

      if ((left || right) && (up || down)) {
        body.velocity.normalize().scale(speed);
      }
    }

    // --- MAIN LOOP ---

    update() {
      this.handleMovement();
      this.updateDayNight();
    }
  };
}
