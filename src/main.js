class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        // Load your 2-frame vertical sprite sheet
        this.load.spritesheet("player", "assets/mespritesheet.png", {
            frameWidth: 128,   // width of a single frame
            frameHeight: 128   // height of a single frame
        });
    }

    create() {
        // Add player sprite in the center
        this.player = this.physics.add.sprite(640, 360, "player");
        this.player.setCollideWorldBounds(true);

        // Arrow keys input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Simple 2-frame walking animation
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
    }

    update() {

        const speed = 300;
        // Stop previous movement
        this.player.setVelocity(0);

        // Movement + play walk animation
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("walk", true);
            this.player.flipX = true;   // flip sprite for left
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("walk", true);
            this.player.flipX = false;  // default for right
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play("walk", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
            this.player.anims.play("walk", true);
            this.anims.msPerFrame - 1000 / speed // smoother frame rate
        } else {
            // Stop walking animation when idle
            this.player.anims.stop();
        }
    }
}

// Phaser game config
const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 1280,
    height: 720,
    backgroundColor: 0x444444,  // gray background
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: MainScene
};

// Launch game
new Phaser.Game(config);
