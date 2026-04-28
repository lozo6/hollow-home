import { TILE_SIZE } from "../config";

export function createGameScene(Phaser: any) {
  return class GameScene extends Phaser.Scene {
    private player: any;
    private cursors: any;
    private wasd: any;
    private dayOverlay: any;
    private timeOfDay: number = 0.5;
    private daySpeed: number = 0.0001;

    constructor() {
      super({ key: "GameScene" });
    }

    create() {
      this.buildPlaceholderWorld();
      this.createPlayer(Phaser);
      this.createDayNightOverlay();
      this.setupCamera();
      this.setupInput(Phaser);
    }

    private buildPlaceholderWorld() {
      const graphics = this.add.graphics();
      const mapWidth = 50;
      const mapHeight = 50;

      for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;
          const isAlt = (row + col) % 2 === 0;
          graphics.fillStyle(isAlt ? 0x2d5a27 : 0x2a5224);
          graphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }

      const treePositions = [
        [5, 5], [8, 3], [12, 7], [3, 15], [20, 8],
        [25, 12], [30, 5], [35, 20], [10, 30], [40, 15],
      ];

      treePositions.forEach(([col, row]) => {
        this.add.rectangle(
          col * TILE_SIZE + TILE_SIZE / 2,
          row * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE * 0.4,
          TILE_SIZE * 0.6,
          0x5c3d1e
        );
        this.add.rectangle(
          col * TILE_SIZE + TILE_SIZE / 2,
          row * TILE_SIZE - TILE_SIZE * 0.3,
          TILE_SIZE * 1.2,
          TILE_SIZE * 1.2,
          0x1a4a14
        );
      });
    }

    private createPlayer(Phaser: any) {
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
      this.physics.world.setBounds(0, 0, 50 * TILE_SIZE, 50 * TILE_SIZE);
    }

    private createDayNightOverlay() {
      this.dayOverlay = this.add.rectangle(
        0, 0,
        50 * TILE_SIZE,
        50 * TILE_SIZE,
        0x00001a,
        0
      ).setOrigin(0, 0).setDepth(100);
    }

    private updateDayNight() {
      this.timeOfDay += this.daySpeed;
      if (this.timeOfDay >= 1) this.timeOfDay = 0;
      const distanceFromNoon = Math.abs(this.timeOfDay - 0.5) * 2;
      const alpha = distanceFromNoon * 0.85;
      this.dayOverlay.setAlpha(alpha);
    }

    private setupCamera() {
      this.cameras.main.setBounds(0, 0, 50 * TILE_SIZE, 50 * TILE_SIZE);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1.5);
    }

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

    update() {
      this.handleMovement();
      this.updateDayNight();
    }
  };
}
