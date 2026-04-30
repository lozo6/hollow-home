// lib/phaser/scenes/GameScene.ts
import { TILE_SIZE } from "../config";

export function createGameScene(Phaser: any) {
  return class GameScene extends Phaser.Scene {
    private player: any;
    private cursors: any;
    private wasd: any;
    private dayOverlay: any;
    private timeOfDay: number = 0.5;
    private daySpeed: number = 0.001;
    private collisionLayer: any;
    private nodeMarkers: Phaser.GameObjects.Rectangle[] = [];
    private interactKey!: any;
    private nearbyNodeIndex: number = -1;
    private promptText!: Phaser.GameObjects.Text;
    private nodes: any[] = [];
    private workbenchCol: number = 25;
    private workbenchRow: number = 23;
    private nearWorkbench: boolean = false;

    constructor() {
      super({ key: "GameScene" });
    }

    preload() {
      this.load.image("tileset", "/assets/tilemaps/tileset.png");
      this.load.tilemapTiledJSON("map", "/assets/tilemaps/map.json");
    }

    create() {
      this.buildWorld();
      this.createPlayer();
      this.setupCollision();
      this.createDayNightOverlay();
      this.setupCamera();
      this.setupInput(Phaser);
      this.setupNodes();
      this.setupInteraction(Phaser);
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
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
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
        "player",
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
        .setDepth(100)
        .setScrollFactor(0);
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
    private setupNodes() {
      // Import node data — we'll pass it in via the scene's init data
      // For now use the default node positions directly
      const { createNodes, RESOURCE_INFO } = require("../../../lib/gathering");
      this.nodes = createNodes();

      this.nodes.forEach((node: any) => {
        const x = node.col * TILE_SIZE + TILE_SIZE / 2;
        const y = node.row * TILE_SIZE + TILE_SIZE / 2;
        const info = RESOURCE_INFO[node.type];

        // Glowing marker rectangle
        const marker = this.add.rectangle(
          x,
          y,
          TILE_SIZE * 0.6,
          TILE_SIZE * 0.6,
          info.color,
          0.7,
        );
        marker.setDepth(5);
        this.nodeMarkers.push(marker);
      });

      // Interaction prompt text
      this.promptText = this.add
        .text(0, 0, "Press E to gather", {
          fontSize: "10px",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 4, y: 2 },
        })
        .setDepth(200)
        .setScrollFactor(0)
        .setVisible(false);

      // Workbench marker at center of homestead
      const workbench = this.add
        .rectangle(
          25 * TILE_SIZE + TILE_SIZE / 2,
          23 * TILE_SIZE + TILE_SIZE / 2,
          TILE_SIZE,
          TILE_SIZE,
          0xc8a96e,
          0.9,
        )
        .setDepth(5);

      // Label
      this.add
        .text(25 * TILE_SIZE + TILE_SIZE / 2, 23 * TILE_SIZE - 4, "⚒️", {
          fontSize: "16px",
        })
        .setOrigin(0.5, 1)
        .setDepth(6);

      // Store workbench position for proximity check
      this.workbenchCol = 25;
      this.workbenchRow = 23;
    }

    private setupInteraction(Phaser: any) {
      this.interactKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E,
      );
    }

    private checkNodeProximity() {
      const playerX = this.player.x;
      const playerY = this.player.y;
      const interactRange = TILE_SIZE * 1.5;

      this.nearbyNodeIndex = -1;

      this.nodes.forEach((node: any, index: number) => {
        if (node.depleted) return;

        const nodeX = node.col * TILE_SIZE + TILE_SIZE / 2;
        const nodeY = node.row * TILE_SIZE + TILE_SIZE / 2;
        const dist = Phaser.Math.Distance.Between(
          playerX,
          playerY,
          nodeX,
          nodeY,
        );

        if (dist < interactRange) {
          this.nearbyNodeIndex = index;
        }
      });

      // Show/hide prompt
      if (this.nearbyNodeIndex >= 0) {
        this.promptText.setVisible(true);
        this.promptText.setPosition(
          this.scale.width / 2 - this.promptText.width / 2,
          this.scale.height - 80,
        );
      } else {
        this.promptText.setVisible(false);
      }
    }

    private handleGathering() {
      if (this.nearbyNodeIndex < 0) return;
      if (!Phaser.Input.Keyboard.JustDown(this.interactKey)) return;

      const node = this.nodes[this.nearbyNodeIndex];
      if (node.depleted) return;

      // Deplete one from the node
      node.quantity -= 1;
      if (node.quantity <= 0) {
        node.depleted = true;
        this.nodeMarkers[this.nearbyNodeIndex].setVisible(false);
      }

      // Flash the marker
      this.tweens.add({
        targets: this.nodeMarkers[this.nearbyNodeIndex],
        alpha: 0,
        duration: 100,
        yoyo: true,
      });

      this.game.events.emit("gathered", { type: node.type, amount: 1 });
    }

    private checkWorkbenchProximity() {
      const playerX = this.player.x;
      const playerY = this.player.y;
      const workbenchX = this.workbenchCol * TILE_SIZE + TILE_SIZE / 2;
      const workbenchY = this.workbenchRow * TILE_SIZE + TILE_SIZE / 2;
      const dist = Phaser.Math.Distance.Between(
        playerX,
        playerY,
        workbenchX,
        workbenchY,
      );

      this.nearWorkbench = dist < TILE_SIZE * 1.5;

      if (this.nearWorkbench && this.nearbyNodeIndex < 0) {
        this.promptText.setVisible(true);
        this.promptText.setText("Press E to craft");
        this.promptText.setPosition(
          this.scale.width / 2 - this.promptText.width / 2,
          this.scale.height - 80,
        );
      }

      if (
        this.nearWorkbench &&
        Phaser.Input.Keyboard.JustDown(this.interactKey)
      ) {
        this.game.events.emit("openCrafting");
      }
    }

    // --- MAIN LOOP ---

    update() {
      this.handleMovement();
      this.updateDayNight();
      this.checkNodeProximity();
      this.checkWorkbenchProximity();
      this.handleGathering();
    }
  };
}
