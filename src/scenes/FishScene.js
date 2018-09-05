import {
    FishFrameConfig
} from './BootScene.js'
const fishes = [
    "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
]
const catchRate={
    "1000":10,
    "500":15,
    "200":20,
    "100":30,
    "50":40,
    "10":50,
}
const fishAppearRate={
    "f1":28, "f2":28, "f3":31, "f4":31, "f5":32, "f6":32, "f7":33, "f8":33, "f9":34, "f10":34, "f11":36, "f12":36,
}
const gold = [{
    image: "minGold",
    range: [
        [10, 1160],
        [50, 1120]
    ]
}, {
    image: "mediumGold",
    range: [
        [100, 1078],
        [200, 1032],
        [500, 986]
    ]
}, {
    image: "maxGold",
    range: [
        [1000, 938]
    ]
}]
let config ={
    initGoldCount:2000,
    totalWin:0,
    thistermWin:0,
    thisGuessGold:0,
    fishValue:{
        "f1":0.5, "f2":0.5, "f3":0.2, "f4":0.2, "f5":0.1, "f6":0.1, "f7":0.08, "f8":0.08, "f9":0.05, "f10":0.05, "f11":0.01, "f12":0.01,
    }
}
function random(obj) {
  var sum = 0,
    factor = 0,
    random = Math.random(),
    keys=Object.keys(obj);

  for(var i = keys.length - 1; i >= 0; i--) {
    sum += obj[keys[i]]; // 统计概率总和
  };
  random *= sum; // 生成概率随机数
  for(var i = keys.length - 1; i >= 0; i--) {
    factor += obj[keys[i]];
    if(random <= factor)
     return keys[i];
  };
  return null;
};
function isLeft(key) {
    return key % 2 === 0 ? true : false
}

class FishScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: "FishScene"
        })
    }
    randomRange(min, max) {
        return this.RandomDataGenerator.integerInRange(min, max)
    }
    update() {

    }
    controlSpeed() {
        this.fishes.getChildren().forEach((fish, index) => {
            let key=fish.texture.key.substring(1),Left=isLeft(key);
            if(fish.canCatch){return }
            fish.setVelocityX(Left?this.randomRange(100, 200) : -this.randomRange(100, 200))

        })

    }
    oneFish(){
      let key = random(fishAppearRate).substring(1),
            i = key-1,
            positionX = isLeft(key)?-FishFrameConfig[i].frameWidth / 2 : this.sys.game.config.width + FishFrameConfig[i].frameWidth / 2;
        let fish = this.fishes.create(positionX, this.randomRange(540, 820), "f" + key)
        fish.setDepth(0)
        fish.anims.play("f"+key)
    }
    addFish() {
        this.oneFish()


    }
    catchFish(){
         try{
              this.fishes.getChildren().forEach((fish, index) =>{
            let key=fish.texture.key.substring(1),Left=isLeft(key);
            if(this.catchStatus==="catching"&&((fish.x>=80&&fish.x<=300&&Left)||(fish.x>=380&&fish.x<=560&&!Left&&!this.fishCatching))){
                let canCatch=Math.round(Math.random()*100)<catchRate[this.selectedGold.text]?true:false;
                if(canCatch){
                    this.fishCatching=true
                    fish.canCatch=true;
                    fish.setVelocityX(0)

                    this.tweens.add({
                        targets: fish,
                        angle:Left?-90:90,
                        x:335,
                        y:460,
                        duration: 1000,
                        delay: 0,
                        onComplete:()=>{
                            this.fishCatching=false
                            this.catchList.push(fish)
                            this.fishCountText.setText(""+this.catchList.length)

                            if(this.c){
                                this.c.restart()

                            }

                            this.c=this.tweens.add({
                                targets: this.fishCount.getChildren(),
                                x:"+=189",
                                duration: 200,
                                ease: 'Linear',
                                delay: 0,
                                onComplete:()=>{

                                }
                            })
                        }
                    })
                    throw(err)
                }
            }
          })
          }catch(err){

          }

    }
    kill() {
        this.fishes.getChildren().forEach((fish, index) => {
            if (fish.x < -fish.width / 2 || fish.x > fish.width / 2 + 640) {

                this.fishes.remove(fish,true,true)
            }
        })
    }
    create() {
        this.RandomDataGenerator = new Phaser.Math.RandomDataGenerator()
        this.add.image(320, this.sys.game.config.height / 2, 'Bg')
        this.add.image(140, 100, "panel-lucky-value");
        this.add.image(45, 45, "avatar");
        this.add.image(220, 55, "current-coin");
        this.add.image(530, 150, "prizepool").setDepth(3)
        this.totalwin=this.add.text(489,964,"赢得:0",{
            fontSize:20,
        }).setDepth(6)
        this.catchList=[]
        // const betpop=this.add.image(118,1068,"bet_pop")
        this.add.image(320, 969, "panel_wooden").setDepth(4)
        this.add.image(520, 969, "panel_win").setDepth(4)
        this.termWin=this.add.text(30,150,"",{
            fontSize:25,
            fill: '#fff',
            stroke: '#181D3B',
            strokeThickness: 5,

            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        })
        this.totalGold=this.add.text(210,40,config.initGoldCount,{
            fontSize:"23px",
            fontFamily:'sans-serif'
        }).setDepth(3)
        const fishCountIcon=this.add.image(-93,250,"fish_count")
        this.fishCountText=this.add.text(-85,230,"1",{
            fill: '#fff',
            stroke: '#181D3B',
            strokeThickness: 5,
            fontSize: "35px",
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        })
        this.fishCount=this.physics.add.staticGroup()
        this.fishCount.add(fishCountIcon)
        this.fishCount.add(this.fishCountText)
        console.log(this.fishCount)
        const fishPole = this.add.image(640,260, "fish_pole").setOrigin(1,0.39)
        const bet = this.add.sprite(118, 969, "panel_bet").setDepth(4).setInteractive()
        const Btn = this.add.sprite(320, 950, "btn-throw").setDepth(4).setInteractive()
        this.btnThrow=Btn
        this.selectedGold = this.add.text(90, 956, "100", {
            fontSize: "26px",
            color: "#fff",
            fontFamily: "sans-serif"
        }).setDepth(5)
        this.betpop = this.physics.add.staticGroup()
        this.fishes = this.physics.add.group();
        this.fishes.world.bounds = new Phaser.Geom.Rectangle(0, 480, 640, 340)
        const tbet = this.betpop.create(118, 1068, "bet_pop").setDepth(1)
        const priziPoolText = this.add.text(454, 160, "80000000", {
            fontSize: '32px',
            fill: '#F8F042',
        }).setDepth(3)
        priziPoolText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5)
        //金币选择部分
        fishPole.rotation=1.45
        gold.forEach((goldConfig) => {
            goldConfig.range.forEach((range) => {
                this.betpop.create(77, range[1], goldConfig.image).setDepth(3)
                let text = this.add.text(108, range[1] - 7, "" + range[0], {
                    fontSize: '20px',
                    Color: "red",
                    fontWeight: "bold",
                    fontFamily: "sans-serif"
                }).setDepth(3).setInteractive()
                this.betpop.add(text)
                text.on("pointerdown", (e) => {
                    this.selectedGold.setText(text.text)
                    this.tweens.add({
                        targets: this.betpop.getChildren(),
                        y: "+=268",
                        duration: 500,
                        ease: 'Back',
                        easeParams: [1.5],
                        delay: 0
                    });
                })
            })
        })
        //初始的鱼
        for (var i = 0; i < fishes.length; i++) {
            var key = i + 1,
                positionX = isLeft(key) ? -FishFrameConfig[i].frameWidth / 2 : this.sys.game.config.width + FishFrameConfig[i].frameWidth / 2;

            // let fish=this.physics.add.sprite(positionX,Math.random()*(814-420)+420,fishes[i])
            let fish = this.fishes.create(positionX, this.randomRange(540, 820), "f" + key)
            fish.setGravityY(0)

            this.anims.create({
                key: "f" + key,
                frames: this.anims.generateFrameNumbers("f" + key, {
                    start: 0,
                    end: 1
                }),
                frameRate: 6,
                repeat: -1
            })
            fish.anims.play("f" + key)
        }
        //鱼游动，鱼增加
        this.time.addEvent({
            delay: 600,
            callback: this.controlSpeed,
            callbackScope: this,
            loop: true
        })
        this.time.addEvent({
            delay: 400,
            callback: this.addFish,
            callbackScope: this,
            loop: true
        })
        this.time.addEvent({
            delay: 1000,
            callback: this.kill,
            callbackScope: this,
            loop: true
        })
        this.catchTimer=this.time.addEvent({
            delay:400,
            callback:this.catchFish,
            callbackScope:this,
            loop:true
        })
        //出竿按钮事件
        Btn.on("pointerdown", async () => {

            if(parseInt(this.totalGold.text,10)<parseInt(this.selectedGold.text,10)){alert('no money');return}
            Btn.setFrame(1);
            config.thistermWin=0
            this.catchStatus="catching"
            this.totalGold.setText(this.totalGold.text-this.selectedGold.text)
            this.tweens.add({
                    targets: fishPole,
                    rotation: "0",
                    duration: 500,
                    ease: 'Back',
                    easeParams: [1.5],
                    delay: 0
                });
            setTimeout(() => {
                Btn.setFrame(0)
                Btn.alpha = 0.5
                Btn.disableInteractive()
            }, 200)
           await new Promise((res,rej)=>{
                setTimeout(()=>{
                    this.catchStatus="Nocatch"
                     res(true)
                },8000)
            }).then((res)=>{
                new Promise((resolve)=>{
                  if(res){
                    setTimeout(()=>{
                        this.catchStatus="catchEnd"
                        this.catchList.forEach((f)=>{
                            config.thistermWin +=Math.round(parseInt(this.selectedGold.text,10)*config.fishValue[f.texture.key])
                            if(f.canCatch){
                                f.destroy()
                            }

                        })
                        config.totalWin +=config.thistermWin
                        this.totalwin.setText(`赢得:${config.totalWin}`)
                       this.tweens.add({
                            targets: fishPole,
                            rotation: "1.45",
                            duration: 500,
                            ease: 'Back',
                            easeParams: [1.5],
                            delay: 0
                        });
                       this.tweens.add({
                            targets: this.fishCount.getChildren(),
                            x:"-=188",
                            duration: 200,
                            ease: 'Linear',
                            delay: 0
                        })
                       this.totalGold.setText(parseInt(this.totalGold.text,10)+parseInt(config.thistermWin))
                        this.catchList=[]
                         Btn.alpha=1
                         Btn.setInteractive()
                         resolve()
                    },1000)

                }
                }).then(()=>{
                    let i=10,coinList=[];
                    this.termWin.setText("+"+config.thistermWin)
                    while(--i){
                        coinList.push(this.add.image(140,150,"coin").setDepth(4))
                    }
                        coinList.forEach((im,i)=>{

                            this.tweens.add({
                                targets:im,
                                x:210,
                                y:50,
                                duration:300,
                                delay:i*100,
                                onComplete:(a,b)=>{
                                   b[0].destroy()
                                   if(i===coinList.length-1){
                                    this.termWin.setText("")
                                    Btn.disableInteractive()
                                    setTimeout(()=>{

                                    this.time.paused=true
                                    this.setAlpha(this.guessPage,1)
                                    this.boxinitData(true)

                                    },1000)

                                   }
                                }
                            })
                        })
                })
            })

        })
        //金币选择按钮事件
        bet.on("pointerdown", () => {

            if (tbet.y === 1068) {
                this.tweens.add({
                    targets: this.betpop.getChildren(),
                    y: "-=268",
                    duration: 500,
                    ease: 'Back',
                    easeParams: [1.5],
                    delay: 0
                });
            } else if (tbet.y === 800) {
                this.tweens.add({
                    targets: this.betpop.getChildren(),
                    y: "+=268",
                    duration: 500,
                    ease: 'Back',
                    easeParams: [1.5],
                    delay: 0
                });

            }


        })
        //结算界面
        this.BoxConfig={
            Numb:(num)=>`猜猜另一个箱子比${num}大还是小(范围0-9)`,
            leftBox:{},
            rightBox:{},
            playCount:0,
            startList:[],
            chipInGold:0,
            guessGoldA:0,
        }

        let boxConfig=this.BoxConfig
        this.guessPage=this.physics.add.group()
        const graphics=this.add.graphics()
        const color="#000000"
        const alpha=0.8
        graphics.fillStyle(color,alpha)
        graphics.fillRect(0,0,640,1080)
        this.guessPage.add(graphics)
        this.guessPage.create(320,455,"box_frame")

        const btnQuit=this.guessPage.create(130,105,"box_quit_btn").setInteractive();
        const btnDble=this.guessPage.create(487,371,"box_add_coin").setInteractive()
        this.guessPage.create(320,665,"btn_bg")
        const btnBig=this.guessPage.create(320,610,"btn_big").setInteractive()
        const btnLess=this.guessPage.create(320,720,"btn_less").setInteractive()
        boxConfig.leftBox.box=this.guessPage.create(175,710,"box")
        boxConfig.leftBox.pearl=this.guessPage.create(175,640,"pearl")
        boxConfig.leftBox.num=this.add.text(
            175,640,"8",{
                fontSize:80,
                fontFamily:'sans-serif',
                stroke:"#000000",
                strokeThickness:2,
                align:"center",
            }
        ).setOrigin(0.5,0.5)
        this.guessPage.add(boxConfig.leftBox.num)
        boxConfig.rightBox.box=this.guessPage.create(480,710,"box")
        boxConfig.rightBox.pearl=this.guessPage.create(480,640,"pearl")
        boxConfig.rightBox.num=this.add.text(
            480,640,"8",{
                fontSize:80,
                fontFamily:'sans-serif',
                stroke:"#000000",
                strokeThickness:2,
                align:"center",
            }
        ).setOrigin(0.5,0.5)
        this.guessPage.add(boxConfig.rightBox.num)
        boxConfig.guessGold=this.add.text(335,370,"",{
            fontSize:25,
            fontFamily:'sans-serif',
            stroke:"#fff",
            strokeThickness:2,
            align:"center",

        }).setOrigin(0.5,0.5)
        this.guessPage.add(boxConfig.guessGold)
        boxConfig.guessTitle=this.add.text(
                330,525,boxConfig.Numb(8),{
                    fontSize:24,
                    fontFamily:'sans-serif',
                    stroke:"#000000",
                    strokeThickness:2,
                    align:"center",
                }
            ).setOrigin(0.5,0.5)
        this.guessPage.add(boxConfig.guessTitle)
        let starCount=1;
        while(starCount<=10){

            let star=this.guessPage.create(68+(starCount-1)*55,914,"star")
            boxConfig.startList.push(star)
            if(starCount<=boxConfig.playCount){
                star.setFrame(1)
            }
            starCount++
        }

        const quitGroup=this.physics.add.staticGroup()
        const Quitgraphics=this.add.graphics()
        Quitgraphics.fillStyle(color,alpha)
        Quitgraphics.fillRect(0,0,640,1080)
        quitGroup.add(Quitgraphics)
        quitGroup.create(320,455,"box_quit_frame")
        const btnConfirmGet=quitGroup.create(200,555,"confirm_btn").setInteractive()
        const btnContinue=quitGroup.create(435,555,"continue_btn").setInteractive()
        quitGroup.setDepth(55,1)
        this.setAlpha(quitGroup,0)
        boxConfig.endGroup=this.physics.add.staticGroup()
        const endGraphics=this.add.graphics().setDepth(55).setInteractive()
        endGraphics.fillStyle("#000000","0.8")
        endGraphics.fillRect(0,0,640,1080)
        boxConfig.endGroup.add(endGraphics)
        boxConfig.endGroup.add(this.add.image(340,445,"message").setDepth(56))
        const endText=this.add.text(340,445,"宝箱游戏结束",{fontSize:30}).setOrigin(0.5,0.5).setDepth(57)
        boxConfig.endGroup.add(endText)
        this.setAlpha(boxConfig.endGroup,0)
        btnConfirmGet.on("pointerdown",()=>{
            boxConfig.guessGoldA =0
            boxConfig.guessGold.setText(boxConfig.guessGoldA)
            this.setAlpha(this.guessPage,0)
            this.setAlpha(quitGroup,0)
            this.time.paused=false
            this.toggleBtnDisable(true)
            this.btnThrow.setInteractive()
        })
        btnContinue.on("pointerdown",()=>{
            this.setAlpha(quitGroup,0)
            this.toggleBtnDisable(true)
        })
        btnDble.on("pointerdown",()=>{
            boxConfig.guessGoldA *=2
            boxConfig.guessGold.setText(boxConfig.guessGoldA)
        })
        btnQuit.on("pointerdown",()=>{
            this.toggleBtnDisable()
            this.setAlpha(quitGroup,1)
        })
        btnBig.on("pointerdown",()=>{
            btnBig.disableInteractive()
            btnLess.disableInteractive()
            this.guess("big").then(()=>{
                btnBig.setInteractive()
                btnLess.setInteractive()
            })
        })
        btnLess.on("pointerdown",()=>{
            btnBig.disableInteractive()
            btnLess.disableInteractive()
            this.guess("small").then(()=>{
                 btnBig.setInteractive()
                btnLess.setInteractive()
            })
        })

        this.toggleBtnDisable=(setAll)=>{
            if(setAll){
                btnLess.setInteractive()
                btnBig.setInteractive()
                btnQuit.setInteractive()
                btnDble.setInteractive()
                return
            }else{
            btnLess.disableInteractive()
            btnBig.disableInteractive()
            btnQuit.disableInteractive()
            btnDble.disableInteractive()
            }

        }
        this.guessPage.setDepth(10,1)
        this.setAlpha(this.guessPage,0)

    }
    guess(bigOrSmall){

        let boxConfig=this.BoxConfig,rNum=null,lNum=parseInt(boxConfig.leftBox.num.text,10),guessGoldA=boxConfig.guessGoldA;
         if(boxConfig.playCount>10){
                this.boxinitData()
                return Promise.resolve()
            }
        do{
            rNum=this.randomRange(0,9)
        }while(rNum===lNum)


        boxConfig.rightBox.num.setText(rNum)
        boxConfig.rightBox.num.alpha=1
        boxConfig.rightBox.pearl.alpha=1
        return new Promise((res,rej)=>{
           if((bigOrSmall==="small"&&rNum<lNum)||bigOrSmall==="big"&&rNum>lNum){
                boxConfig.guessTitle.setText(`恭喜你猜对了，获得${guessGoldA}金币`)
                boxConfig.guessGoldA *=2
                boxConfig.guessGold.setText(boxConfig.guessGoldA)
                setTimeout(()=>{
                    this.boxinitData()
                    res()
                },800)
                return
            }

             boxConfig.guessTitle.setText(`很抱歉，猜错了，3S后返回`)
             setTimeout(()=>{
                this.setAlpha(this.guessPage,0)
                boxConfig.guessGoldA=0
                boxConfig.guessGold.setText(boxConfig.guessGoldA)
                this.btnThrow.setInteractive()
                this.time.paused=false
                res()
             },2000)
        })


    }
    setAlpha(group,value){
        group.getChildren().forEach((child)=>{
            child.alpha=value
        })
    }
    boxinitData(thisterm){
        let boxConfig=this.BoxConfig

        if(thisterm){
            boxConfig.guessGoldA=config.thistermWin
            boxConfig.guessGold.setText(boxConfig.guessGoldA)
        }
        boxConfig.playCount +=1
        let num=this.randomRange(0,9),
            i=1;

        while(i<=10){

            let star=boxConfig.startList[i-1]
            if(i<=boxConfig.playCount){
                star.setFrame(1)
            }
            i++
        }
        if(boxConfig.playCount>10){
            this.toggleBtnDisable(false)
            this.setAlpha(boxConfig.endGroup,1)
        boxConfig.leftBox.num.alpha=0
        boxConfig.leftBox.pearl.alpha=0
        boxConfig.leftBox.box.setFrame(0)
        boxConfig.guessTitle.setText("")
        boxConfig.rightBox.num.alpha=0
        boxConfig.rightBox.pearl.alpha=0
        boxConfig.rightBox.box.setFrame(0)
            setTimeout(()=>{
                this.setAlpha(boxConfig.endGroup,0)
                this.setAlpha(this.guessPage,0)
                this.time.paused=false
                this.btnThrow.setInteractive()
            },3000)
            return
        }
        boxConfig.leftBox.num.setText(num)
        boxConfig.leftBox.box.setFrame(1)
        boxConfig.guessTitle.setText(boxConfig.Numb(num))
        boxConfig.rightBox.num.alpha=0
        boxConfig.rightBox.pearl.alpha=0
        boxConfig.rightBox.box.setFrame(0)

    }

}
export default FishScene
