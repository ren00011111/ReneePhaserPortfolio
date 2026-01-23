class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.spritesheet("player", "assets/mespritesheet.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.image("uibox", "assets/uibox.png");
        this.load.image(
            "background",
            "assets/backgroundimage.png"
        );
        this.load.image("studioLogo", "assets/rendroidstudioslogo.png");
    }

    create() {
        const bg = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            "background"
        );

        bg.setDepth(-100);

        bg.setDisplaySize(
            this.scale.width,
            this.scale.height
        );
        const logo = this.add.image(475, 220, "studioLogo");
        logo.setOrigin(0, 0);   // match CSS top/left
        logo.setAlpha(0.6);
        logo.setDepth(0);
        logo.setScale(0.8);

        // IMPORTANT: define buttons array before ESC handler uses it
        this.buttons = [];

        this.justClosedDialog = false;
        this.canTriggerPopups = false;
        this.time.delayedCall(300, () => { this.canTriggerPopups = true; });

        this.interactText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 220,
            "",
            {
                fontSize: "28px",
                fontFamily: "Arial",
                color: "#ffffff",
                align: "center",
                stroke: "#000000",
                strokeThickness: 6
            }
        )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(999)
            .setVisible(false);


        // Add player
        this.player = this.physics.add.sprite(636, 685, "player");
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.input.keyboard.on("keydown-ESC", () => {
            const openDialog = document.querySelector("dialog[open]");
            if (!openDialog) return;

            openDialog.close();
            this.justClosedDialog = true;

            // Block re-open until player leaves the button area
            for (const btn of this.buttons) {
                if (this.physics.overlap(this.player, btn)) {
                    btn.setData("wasOverlapping", true);
                }
            }

            this.time.delayedCall(250, () => (this.justClosedDialog = false));
        });


        // --- Create draggable buttons ---
        const buttonPositions = [
            { x: 57, y: 615, id: "button1", title: "Art" },
            { x: 65, y: 374, id: "button2", title: "Contact" },
            { x: 258, y: 145, id: "button3", title: "CV" },
            { x: 640, y: 56, id: "button4", title: "Tech Stack + Github" },
            { x: 1089, y: 141, id: "button5", title: "Games" },
            { x: 1188, y: 375, id: "button6", title: "Social Media" },
            { x: 1222, y: 612, id: "button7", title: "Localisation" }
        ];

        buttonPositions.forEach((pos) => {
    const button = this.add.sprite(pos.x, pos.y, "uibox");
    button.setDepth(5);
    button.setScale(1.2);

    button.setData("id", pos.id);
    button.setData("title", pos.title);
    button.setData("wasOverlapping", false);

    // physics
    this.physics.world.enable(button);
    button.body.setAllowGravity(false);
    button.body.setImmovable(true);

    // ---- TITLE TEXT ----
    const titleText = this.add.text(
        pos.x,
        pos.y - button.height / 2 + 18, // vertical offset
        pos.title,
        {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 4
        }
    )
    .setOrigin(0.5)
    .setDepth(6);

    // store reference so it can follow the box
    button.setData("titleText", titleText);

    this.buttons.push(button);
});


        this.keyE = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );


        // Dragging logic (MUST be inside create())
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            console.log(`${gameObject.texture.key} at (${dragX}, ${dragY})`);
        });
    }

    update() {
        const speed = 300;
        this.player.setVelocity(0);

        const left = this.cursors.left.isDown || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;
        const up = this.cursors.up.isDown || this.wasd.up.isDown;
        const down = this.cursors.down.isDown || this.wasd.down.isDown;

        if (left) {
            this.player.setVelocityX(-speed);
            this.player.anims.play("walk", true);
            this.player.flipX = true;
        }
        else if (right) {
            this.player.setVelocityX(speed);
            this.player.anims.play("walk", true);
            this.player.flipX = false;
        }
        else if (up) {
            this.player.setVelocityY(-speed);
        }
        else if (down) {
            this.player.setVelocityY(speed);
            this.player.anims.play("walk", true);
        }


        // Open dialog only on overlap ENTER edge
        let nearButton = null;

        for (const btn of this.buttons) {
            const isOverlapping = this.physics.overlap(this.player, btn);

            if (isOverlapping) {
                nearButton = btn;
                break;
            }
        }

        if (nearButton && !document.querySelector("dialog[open]")) {
            const title = nearButton.getData("title");

            this.interactText.setText(
                `Press E to view\n${title}`
            );
            this.interactText.setVisible(true);

            if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
                const dialog = document.getElementById(
                    nearButton.getData("id")
                );

                if (dialog) dialog.showModal();
            }
        } else {
            this.interactText.setVisible(false);
        }

    }
}


const config = {
    type: Phaser.AUTO,               // WebGL if possible, otherwise Canvas
    width: 1280,                     // Game width
    height: 720,                     // Game height
    parent: "game-container",        // Div ID from your HTML
    pixelArt: true,                  // Crisp pixel scaling
    backgroundColor: 0xffffff,       // White background
    physics: {
        default: "arcade",           // Arcade physics
        arcade: { debug: false }     // Set true to see physics bodies
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    scene: MainScene                 // Use the scene we just defined
};

// --- Start the Phaser game ---
new Phaser.Game(config);