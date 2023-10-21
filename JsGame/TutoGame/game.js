const gameWidth = 270;
const gameHeigt = 180;
const worldWidth = 270;
const worldHeigt = 180;

class PlayScene extends Phaser.Scene
{
    constructor(){
        super();
    }

    preload() { //Charge les fichiers
        this.load.image("Background", "assets/ciel.png");
        this.load.image("Stars", "assets/etoile.png");
        this.load.spritesheet("IceBlock", "assets/iceblock.png",
            {frameHeight: 48, frameWidth: 48
        });
        this.load.spritesheet("Character", "assets/mage.png",
            {frameHeight: 40, frameWidth: 32
        });
        


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
            frameRate: 10,
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
        
        // Joueur
        this.player = this.physics.add.sprite(
            100, 20, "Character"
        );
        
        this.player.setGravityY(420);
        this.player.setCollideWorldBounds(true);
        this.player.anims.play("idle");


        // Physique
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.stars, this.ground);
        this.physics.world.setBoundsCollision(true, true, false, true);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() { //Utilisée à chaque image
        // Controles
        let dir = 0;
        if (this.cursors.left.isDown) {
            dir = -1;
            this.player.flipX = true;
        }   else if (this.cursors.right.isDown) {
            dir = 1;
            this.player.flipX = false;
        }

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
            if (this.player.body.setVelocityY < 0) {
                this.player.anims.play("airUp", true);
            } else {
                this.player.anims.play("airDown", true)
            }
        }
         this.player.setVelocityX(200 * dir);
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
