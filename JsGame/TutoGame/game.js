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
        }
        );
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