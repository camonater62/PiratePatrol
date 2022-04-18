let iter = 0;

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/cannonball.png');
        this.load.image('spaceship', './assets/pirateship.png');
        this.load.image('starfield-far', './assets/starfield-far.png');
        this.load.image('starfield-near', './assets/starfield-near.png');
        this.load.image('clouds', './assets/clouds.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/pirateship-sink.png', 
        {
            frameWidth: 64, 
            frameHeight: 46, 
            startFrame: 0, 
            endFrame: 4
        });
        this.load.spritesheet('ocean-tile', './assets/ocean.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 3,
            frameRate: 4
        });
    }

    create() {
        // this.add.text(20, 20, "Rocket Patrol Play");

        // place tile sprite
        // this.starfieldFar = this.add.tileSprite(0, 0, 640, 480, 'starfield-far').setOrigin(0, 0);
        // this.starfieldNear = this.add.tileSprite(0, 0, 640, 480, 'starfield-near').setOrigin(0, 0);
        this.ocean = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ocean-tile').setOrigin(0, 0);
         
   
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x6b3400).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x070030).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x070030).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x070030).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x070030).setOrigin(0, 0);      

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 10
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: "#843605",
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding * 2, highScore, scoreConfig);
    
        // GAME OVER flag
        this.gameOver = false;

        this.origsettings = game.settings;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.sound.stopByKey('BGM');
            if (this.p1Score > highScore) {
                highScore = this.p1Score;
                localStorage.setItem("highScore", highScore);
                this.scoreRight.text = highScore;
            }
            this.sound.rate = 1;
        }, null, this);
        this.clockCenter = this.add.text(
            game.config.width / 2 - scoreConfig.fixedWidth / 2, 
            borderUISize + borderPadding * 2, 
            game.settings.gameTimer / 1000, scoreConfig);

        console.log(this.clock);

        // Half time speed up
        this.halfclock = this.time.delayedCall(game.settings.gameTimer / 2, () => {
            game.settings.spaceshipSpeed *= 1.4;
            this.sound.rate = 1.15;
            console.log("Speed Up!");
            this.halfclock.elapsed += 10000;
            
        }, null, this);

        // Music
        this.sound.play('BGM', {volume: 0.65});
    }

    
    update() {
        this.ocean.tilePositionX = 32 * Math.cos(iter);
        this.ocean.tilePositionY = 32 * Math.cos(iter);
        
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            game.settings = this.origsettings;
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // this.clouds.tilePositionX -= 2;
        // this.starfieldNear.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            iter += 0.01;
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        this.clockCenter.text = Math.round((game.settings.gameTimer - this.clock.elapsed) / 1000);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (ship.alpha === 1 &&
            rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion', {volume: 0.5});
        this.clock.elapsed -= 500;
        this.halfclock.elapsed -= 500;
    }
}