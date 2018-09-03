import {FishFrameConfig} from './BootScene.js'
const fishes=[
  "f1","f2","f3","f4","f5","f6","f7","f8","f9","f10","f11","f12",
]
const gold=[
  {
    image:"minGold",
    range:[
    [10,1160],
    [50,1120]
    ]
  },
  {
    image:"mediumGold",
    range:[[100,1078],[200,1032],[500,986]]
  },
  {
    image:"maxGold",
    range:[[1000,938]]
  }
]
function isLeft(key){
    return  key%2===0?1:0
}
class FishScene extends Phaser.Scene{
    constructor(config){
        super({
            key:"FishScene"
        })
    }
    randomRange(min,max){
        return this.RandomDataGenerator.integerInRange(min,max)
    }
    update(){

    }
    controlSpeed(){
        this.fishes.getChildren().forEach((fish,index)=>{
            fish.setVelocityX(isLeft(index+1)?this.randomRange(100,200):-this.randomRange(100,200))
        })
    }
    addFish(){
        let i=this.randomRange(0,11),
            key=i+1,
            positionX=isLeft(key)?-FishFrameConfig[i].frameWidth/2:this.sys.game.config.width+FishFrameConfig[i].frameWidth/2;
        let fish=this.fishes.create(positionX,this.randomRange(480,820),"f"+key)
            fish.setDepth(0)
            fish.anims.play("f"+key)

    }
    kill(){
        this.fishes.getChildren().forEach((fish,index)=>{
            if(fish.x<-fish.width/2||fish.x>fish.width/2+640){
                console.log(fish)
                this.fishes.kill(fish)
            }
        })
    }
    create(){
        this.RandomDataGenerator=new Phaser.Math.RandomDataGenerator()
        this.add.image(320,this.sys.game.config.height/2,'Bg')
        this.add.image(140,100,"panel-lucky-value");
        this.add.image(45,45,"avatar");
        this.add.image(220,55,"current-coin");
        this.add.image(500,150,"prizepool")

        this.fishes=this.physics.add.group();
        this.fishes.world.bounds=new Phaser.Geom.Rectangle(0,480,640,340)
        const betpop=this.add.image(118,1068,"bet_pop").setDepth(1)

        this.add.image(320,969,"panel_wooden").setDepth(4)
        this.add.image(520,969,"panel_win").setDepth(4)


        for(var i=0;i<fishes.length;i++){
            var key=i+1,positionX=isLeft(key)?-FishFrameConfig[i].frameWidth/2:this.sys.game.config.width+FishFrameConfig[i].frameWidth/2;

             // let fish=this.physics.add.sprite(positionX,Math.random()*(814-420)+420,fishes[i])
             let fish=this.fishes.create(positionX,this.randomRange(480,820),"f"+key)
             fish.setGravityY(0)

             this.anims.create({
                key:"f"+key,
                frames:this.anims.generateFrameNumbers("f"+key,{start:0,end:1}),
                frameRate:6,
                repeat:-1
             })
             fish.anims.play("f"+key)
        }
        console.log(bet)
        this.time.addEvent({delay:600,callback:this.controlSpeed,callbackScope:this,loop:true})
        this.time.addEvent({delay:200,callback:this.addFish,callbackScope:this,loop:true})
        this.time.addEvent({delay:1000,callback:this.kill,callbackScope:this,loop:true})
        this.betpop=this.physics.add.staticGroup()

        gold.forEach((goldConfig)=>{
            goldConfig.range.forEach((range)=>{
                this.betpop.create(77,range[1],goldConfig.image).setDepth(3)

            })
        })

        const bet=this.add.sprite(118,969,"panel_bet").setDepth(4).setInteractive()
        const Btn=this.add.sprite(320,950,"btn-throw").setDepth(4).setInteractive()
        Btn.on("pointerdown",()=>{
            Btn.setFrame(1);
            setTimeout(()=>{
                Btn.setFrame(0)
                Btn.alpha=0.5
                Btn.disableInteractive()
            },200)
        })
        bet.on("pointerdown",()=>{
            if(betpop.y===1068){
                 this.tweens.add({
                    targets: this.betpop.getChildren(),
                    y: "-=268",
                    duration: 500,
                    ease: 'Back',
                    easeParams: [ 1.5 ],
                    delay: 0
                });
               this.tweens.add({
                    targets: betpop,
                    y: 800,
                    duration: 500,
                    ease: 'Back',
                    easeParams: [ 1.5 ],
                    delay: 0
                });
            }else{
                  this.tweens.add({
                    targets: this.betpop.getChildren(),
                    y: "+=268",
                    duration: 500,
                    ease: 'Back',
                    easeParams: [ 1.5 ],
                    delay: 0
                });
                 this.tweens.add({
                    targets: betpop,
                    y: 1068,
                    duration: 500,
                    ease: 'Back',
                    easeParams: [ 1.5 ],
                    delay: 0
                });
            }


        })

    }
}
export default FishScene
