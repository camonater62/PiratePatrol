class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_explosion', './assets/sink.wav');
        this.load.audio('sfx_rocket', './assets/shoot.wav');
        
        // load music
        this.load.audio('BGM', './assets/seashanty2.mp3');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '58px',
            backgroundColor: '#300000',
            color: '#ff8d6e',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - 2 * borderUISize - borderPadding, 'PIRATE PATROL', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '28px';
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize, '(F) to shoot!', menuConfig).setOrigin(0.5);
        
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + 2 * borderUISize + 2* borderPadding, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);
    
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            };
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            };
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}