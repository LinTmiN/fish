import 'phaser';
import BootScene from './scenes/BootScene';
import FishScene from './scenes/FishScene';
import TitleScene from './scenes/TitleScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.Canvas,
    pixelArt: true,
    roundPixels: true,
    width: 640,
    height: 1021,
    parent:"content",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        FishScene
    ]
};

const game = new Phaser.Game(config);
