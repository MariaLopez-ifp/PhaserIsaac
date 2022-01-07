import * as  map from './map.js'

export var config = {

    type: Phaser.AUTO,
    width: 800,
    height: 600,
    fps: {
        min: 15,
        target: 30,
        forceSetTimeOut: true
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        map
    ],
}

var Game = new Phaser.Game(config);

class main extends Phaser.Scene {
    constructor() {
        super('main');
    }
    create() {
        this.scene.start('map');
    }
}