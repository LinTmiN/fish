import makeAnimations from '../helpers/animations';
export const FishFrameConfig=[
    {frameWidth:202,frameHeight:113,startFrame:0,endFrame:202*3},
    {frameWidth:202,frameHeight:113,startFrame:0,endFrame:202*3},
    {frameWidth:143,frameHeight:91,startFrame:0,endFrame:143*3},{frameWidth:143,frameHeight:91,startFrame:0,endFrame:143*3},
    {frameWidth:109,frameHeight:52,startFrame:0,endFrame:109*3},{frameWidth:109,frameHeight:52,startFrame:0,endFrame:109*3},
    {frameWidth:64,frameHeight:51,startFrame:0,endFrame:64*3},{frameWidth:64,frameHeight:51,startFrame:0,endFrame:64*3},
    {frameWidth:47,frameHeight:39,startFrame:0,endFrame:47*3},{frameWidth:47,frameHeight:39,startFrame:0,endFrame:47*3},
    {frameWidth:55,frameHeight:25,startFrame:0,endFrame:55*3},{frameWidth:55,frameHeight:25,startFrame:0,endFrame:55*3},
]
class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }
    preload() {
        const progress = this.add.graphics();
        console.log(this)
        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            makeAnimations(this);
            progress.destroy();
            this.scene.start('FishScene');
        });
        let url="assets/images/"
        this.load.image('Bg', url + 'bg.jpg')
        this.load.image('avatar', url + 'avatar.png')
        this.load.image('panel-lucky-value', url + 'panel_lucky_value.png')
        this.load.image('current-coin', url + 'current_coin.png')
        this.load.image('prizepool', url + 'jackpot.png')
        this.load.image('maxGold',url+'bet_1000.png')
        this.load.image('mediumGold',url+'bet_100_200_500.png')
        this.load.image('minGold',url+"bet_10_50.png")
        this.load.image('fish_pole',url+'fish_pole.png')
        this.load.image('fish_count',url+'fish_count.png')
        this.load.image('panel_win',url+'panel_win.png')
        this.load.image('panel_bet',url+'panel_bet.png')
        this.load.image('panel_wooden',url+"panel_wooden.png")
        this.load.image("bet_pop",url+"bet_pop.png")
        this.load.spritesheet('btn-throw', url + 'btn_throw.png',{
            frameWidth:180,
            startFrame:0,endFrame:182*2
        })

        for (let i = 0,len = FishFrameConfig.length; i < len; i++){
            this.load.spritesheet(`f${i+1}`,url+`f${i+1}.png`,FishFrameConfig[i]);
        }

        // this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later

        // // Tilemap with a lot of objects and tile-properties tricks
        // this.load.tilemapTiledJSON('map', 'assets/tilemaps/super-mario.json');

        // // I load the tiles as a spritesheet so I can use it for both sprites and tiles,
        // // Normally you should load it as an image.
        // this.load.spritesheet('tiles', 'assets/images/super-mario.png', {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     spacing: 2
        // });

        // // Support for switching between 8-bit and 16-bit tiles
        // this.load.spritesheet('tiles-16bit', 'assets/images/super-mario-16bit.png', {
        //     frameWidth: 16,
        //     frameHeight: 16,
        //     spacing: 2
        // });

        // // Spritesheets with fixed sizes. Should be replaced with atlas:
        // this.load.spritesheet('mario', 'assets/images/mario-sprites.png', {
        //     frameWidth: 16,
        //     frameHeight: 32
        // });

        // // Beginning of an atlas to replace the spritesheets above. Always use spriteatlases. I use TexturePacker to prepare them.
        // // Check rawAssets folder for the TexturePacker project I use to prepare these files.
        // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');

        // // Music to play. It's not properly edited for an continous loop, but game play experience isn't really the aim of this repository either.
        // this.load.audio('overworld', [
        //     'assets/music/overworld.ogg',
        //     'assets/music/overworld.mp3'
        // ]);

        // // Sound effects in a audioSprite.
        // this.load.audioSprite('sfx', 'assets/audio/sfx.json', [
        //     'assets/audio/sfx.ogg',
        //     'assets/audio/sfx.mp3'
        // ], {
        //     instances: 4
        // });

        // this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

        // // This json contain recorded gamep
        // this.load.json('attractMode', 'assets/json/attractMode.json');
    }
}

export default BootScene;
