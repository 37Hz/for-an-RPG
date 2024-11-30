class eneStatus{
    constructor(hp=0,off=0,def=0,pp=0){
        this.hp = hp;
        this.off = off;
        this.def = def;
        this.pp = pp;
    };
};

const eneImg = new Image();
eneImg.src = "allEnes.png";

function ctxImage(img,drawArea=[[0,0],[192,192]],pos=[0,0,0],scale=3/5){
    const imgSize = [drawArea[1][0]-drawArea[0][0],drawArea[1][1]-drawArea[0][1]]
    ctx.setTransform(...tMx(imgSize[0]/2,imgSize[1]/2,pos[2]*(Math.PI/180),(canvasSize[0]-imgSize[0]*scale)/2+pos[0],(canvasSize[1]-imgSize[1]*scale)/2+pos[1]))
    ctx.drawImage(img,drawArea[0][0],drawArea[0][1],imgSize[0],imgSize[1],0,0,cvsScale*imgSize[0]*scale,cvsScale*imgSize[1]*scale);
};

class eneImgData{
    constructor(type){
        this.type = type;
        switch(type){
            case 0:
                this.imgSize = [192,192];
                break;
            case 1:
                this.imgSize = [192*2,192];
                break;
            default:
                this.imgSize = [0,0];
        };
    };
    draw(pos=[0,0,0],scale=3/5){
        switch(this.type){
            case 0:
                ctxImage(eneImg,[[192*0,192*0],[192*1,192*1]],pos,scale);
                break;
            case 1:
                ctxImage(eneImg,[[192*1,192*0],[192*3,192*1]],pos,scale);
                break;
            default:
                void(0)
        };
    };
};

eneData = [
    {id:0,name:"手に負えない兎",img:new eneImgData(0),status:new eneStatus(100,3,23,0)},
    {id:1,name:"わんぱくドラゴン",img:new eneImgData(1),status:new eneStatus(200,46,107,25)}
];
const eneDataId = eneData.map(elm => Object.values(elm)[Object.keys(elm).indexOf("id")]);

preEne = [0]

function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground(2);
    drawEncounteredEnemy(preEne);

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillRect(0,0,canvas.width,cvsScale*100);
    ctx.fillRect(0,canvas.height-cvsScale*100,canvas.width,canvas.height);

};

function drawEncounteredEnemy(enemies){
    enemies.forEach((ene,i) => {new eneImgData(eneDataId.indexOf(ene)).draw([100*i-100*(preEne.length-1)/2,0,0]);});
};

function drawBackground(style=0){
    let forEffect = [];
    switch(style){
        case 0:
            for(let i=0;i<2*(Math.ceil(Math.max(...canvasSize)/200))+1;i++){
                const size = 200*((Math.ceil(Math.max(...canvasSize)/200))+1)-100*2*i+((400/360)*globalTime)%400;
                if(i%2===0){ctx.fillStyle = `rgba(${50+50*Math.sin(globalTime/60)},${10+50*Math.sin(globalTime/60+Math.PI/4)},25,1)`;};
                if(i%2===1){ctx.fillStyle = `rgba(${50+50*Math.sin(globalTime/60)},${10+50*Math.sin(globalTime/60+Math.PI/2)},0,1)`;};
                ctxRect(canvasSize[0]/2,canvasSize[1]/2,((i%2===0)?1:-1)*globalTime,size,size);};
            break;
        case 1:
            for(let i=0;i<2*(Math.ceil(Math.max(...canvasSize)/200))+1;i++){
                const size = 200*((Math.ceil(Math.max(...canvasSize)/200))+1)-100*2*i+((400/360)*globalTime+50*Math.sin(globalTime*1/20))%400;
                if(i%2===0){ctx.fillStyle = "rgba(225,225,225,1)"};if(i%2===1){ctx.fillStyle = "rgba(0,0,0,1)"};
                ctxRect(canvasSize[0]/2,canvasSize[1]/2,45,size,size);};
            break;
        case 2:
            forEffect = [5,0,0]
            ctx.setTransform(1,0,0,1,0,0);
            ctx.fillStyle = `rgba(0,${5-5*Math.sin(globalTime/30-Math.PI/4)},${50+50*Math.sin(globalTime/60)},1)`
            ctx.fillRect(0,0,canvas.width,canvas.height);
            for(let i=0;i<canvasSize[0]/forEffect[0]/2;i++){
                forEffect[1] = (i+1/4)*2*forEffect[0]
                forEffect[2] = Math.abs(400*(Math.sin(globalTime/60+i*10)))
                ctx.fillStyle = `rgba(${75-50*Math.sin(globalTime/60+i*100)},0,${75+50*Math.sin(globalTime/60)},1)`
                ctxRect(forEffect[1],canvasSize[1]-100,0,forEffect[0],forEffect[2]);
                ctxRect(canvasSize[0]-forEffect[1],0+100,0,forEffect[0],forEffect[2]);
            };
            break;
        default:
            void(0);
    };
};