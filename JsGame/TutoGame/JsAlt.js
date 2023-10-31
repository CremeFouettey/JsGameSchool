const gameWidth = 270;
const gameHeigt = 180;
const worldWidth = 270;
const worldHeigt = 180;
var Cooldown = 0;
var BoostOn = false;
var BoostOnCooldown = 0;
class PlayScene extends Phaser.Scene {
    constructor(){
        super();
    }

    preload() { //Charge les fichiers
        this.load.image("Background", "assets/ciel.png");
        this.load.image("Stars", "assets/etoile.png");
        this.load.image("Dash", "assets/DashEffect.png");
        this.load.spritesheet("IceBlock", "assets/iceblock.png",
            {frameHeight: 48, frameWidth: 48
        });
        this.load.spritesheet("Character", "assets/mage.png",
            {frameHeight: 40, frameWidth: 32
        });
        this.load.spritesheet("Monster", "assets/monstre.png",
        {frameHeight: 48, frameWidth: 48
        });
        
        // Charge les fichiers audios
        this.load.audio("Music", "assets/Game.mp3");
        


    }

    create() { //Utilisée au début
        // Animations
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers(
                "Character", {start:0, end:3}
            ),
            frameRate: 7.5,
            repeat: -1
        });

        this.anims.create({
            key: "run",
            frames:this.anims.generateFrameNumbers(
                "Character", {frames:[5,6,7,4]}
            ),
            frameRate: 15,
            repeat:-1
        });

        this.anims.create({
            key: "airUp",
            frames: [ { key: "Character", frame :6}],
            frameRate: 20
        });

        this.anims.create({
            key: "airDown",
            frames: [ { key: "Character", frame :7}],
            frameRate: 20
        });
        this.anims.create({
            key: "MonsterFlight",
            frames: this.anims.generateFrameNumbers(
                "Monster", {start:0, end:3}
            ),
            frameRate: 25,
            repeat: -1
        });

        // Ciel
        this.add.image(gameWidth/2 + 50,gameHeigt/2 - 50, "Background");
        
        //sol 
        this.ground = this.physics.add.staticGroup({
            key: "IceBlock",
            frame: 0,
            repeat: 5,
            setXY: {x: 24, y: gameHeigt, stepX: 48}
        });

        // Etoiles
        const numStars = 6;
        const step = worldWidth/(numStars+1);
        this.stars = this.physics.add.group({
            key: "Stars",
            repeat: (numStars-1),
            gravityY: 300,
            setXY: {x: step, y: -30, stepX: step}
        });
    
        this.stars.children.iterate(function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.1,0.9),)
        });

        // Monstre
        this.monsters = this.physics.add.group();
        
        // Joueur
        this.player = this.physics.add.sprite(
            100, 20, "Character"
        );
        
        this.player.setGravityY(420);
        this.player.setCollideWorldBounds(true);
        this.player.anims.play("idle");
        this.player.body.setSize(22, 30, true);
        this.player.body.setOffset(this.player.body.offset.x, 10);

        // Score
        this.score = 0;
        this.scoreText = this.add.text(16,10, "Score: 0", {
            fontSize: "12px", fill: "#1c5d60"
        });

        // Physique et Collisions
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.stars, this.ground);
        this.physics.add.collider(this.monsters, this.ground);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.monsters, this.hitMonster, null, this);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.special = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Tests Boost
        class boost {
            constructor(boostOffCooldown, boostOn, boostOnCooldown) {

                this.boostOffCooldown = boostOffCooldown;
                this.boostOn = boostOn;
                this.boostOnCooldown = boostOnCooldown;
            }
        }
        let boostTest = new boost(45, false, true);
        console.log(boostTest)

        // Audio
        this.MusiqueBack = this.sound.add("Music");
        this.backgroundMusic();
        
        this.gameOver = false;
    }

    update() { //Utilisée à chaque image
        if (!this.gameOver){
            // Controles
        let dir = 0;
        if (this.cursors.left.isDown) {
            dir = -1;
            this.player.flipX = true;
        }   else if (this.cursors.right.isDown) {
            dir = 1;
            this.player.flipX = false;
        }
  
        // Saut mouvement

        if (this.player.body.onFloor()){
            if (this.cursors.up.isDown){
                this.player.setVelocityY(-300);
            }
            if (dir === 0){
                this.player.anims.play("idle", true)
            }   else {
                this.player.anims.play("run", true)
            }
    
        } else {
                if (this.player.body.velocity.y < 0) {
                    this.player.anims.play("airUp", true);
                } else {
                    this.player.anims.play("airDown", true);
                }
            }
        if (this.player.body.onFloor != true) {
                if (this.cursors.down.isDown){
                    this.player.setVelocityY(300);
                };
                }
        
         
            if (this.special.isDown){
                this.player.setVelocityX(400 * dir);
                this.player.setVelocityY(25);
                console.log("Space")
            } else{
                this.player.setVelocityX(200 * dir);
            }


        /*if (this.dashingFunction(Cooldown == 60, dashingOn < 300)){
            this.dash;
            this.dashingFunction(dashingOn += 1);
        }*/

        }

        
        }
    
    /*dashingFunction(Cooldown, dashingOn){
        this.new.Cooldown = 0;
        this.new.dashingOn = 0;
        this.dash = this.player.setVelocityX(500 * dir)
        
    }*/
    playerMovement(){
        this.BoostOn = false; 
    }

    collectStar(player, star){
        star.disableBody(true, true)
        this.score += 100;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive() === 0){
            this.stars.children.iterate(function(star) {
                star.enableBody(true, star.x, -30, true, true);
            });
            let x;
            if(this.player.x < worldWidth/2){
                x = Phaser.Math.Between(worldWidth/2, worldWidth);
            } else{
                x = Phaser.Math.Between(0, worldWidth/2);
            }
            const monster = this.monsters.create(x, -30, "monster");
            monster.anims.play("MonsterFlight");
            monster.setBounce(1);
            monster.setCollideWorldBounds(true);
            monster.setGravityY(150);
            monster.setVelocity(-100, 0);
            monster.body.setSize(38, 41, true);
            monster.body.setOffset(monster.body.offset.x, );

        }

        
    }

    hitMonster(){
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play("idle");
        this.gameOver = true;

        setTimeout(()=> this.scene.restart(), 2000)
    }

    backgroundMusic() {
        this.MusiqueBack.play({
            loop: true
        });
    }



}

const config = {
    type: Phaser.AUTO,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 4,
        width: gameWidth,
        height: gameHeigt
    },
    physics: {
        default: 'arcade'
    },
    scene: [ PlayScene ] 
}

const game = new Phaser.Game(config)
