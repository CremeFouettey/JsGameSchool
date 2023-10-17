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
         {frameHeight: 48, frameWidth: 48});

    }

    create() { //Utilisée au début
        this.add.image(gameWidth/2 + 50,gameHeigt/2 - 50, "Background");
        
        this.ground = this.physics.add.staticGroup({
            key: "IceBlock",
            frame: 0,
            repeat: 5,
            setXY: {x: 24, y: gameHeigt, stepX: 48}
        });

        const numStars = 6;
        const step = worldWidth/(numStars+1)
        this.stars = this. physics.add.group({
            key: "Stars",
            repeat: numStars-1,
            gravityY: 300,
            setXY: {x: step, y: -30, stepX: step}
        });
    }

    update() { //Utilisée à chaque image
        console.log("Update");
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2.5,
        width: gameWidth,
        height: gameHeigt
    },
    physics: {
        default: 'arcade'
    },
    scene: [ PlayScene ] 
}

const game = new Phaser.Game(config)
