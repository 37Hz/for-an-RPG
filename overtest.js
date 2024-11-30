const img = new Image();
img.src = "overChar.png"

function update(){
    //wall[0].startPoint=[100*Math.sin(globalTime*2*Math.PI/180),100*Math.cos(globalTime*2*Math.PI/180)];wall[0].endPoint=[0,100];
    overCharacter.updateAll();
    stuffs.forEach(elm => overCol(own[0],elm));
    wall.forEach((elm) => {overCol(own[0],elm)});
    //camDir+=1*(Math.PI/180)
    //camScale = Array(2).fill(Math.sin(globalTime*(Math.PI/180)))
    };

function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = "rgba(225,225,225,1)"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.font = "20px cursive";
    ctx.fillText("More crabs with a click",50,50)
    overCharacter.drawAll();
    Wall.instanceof.forEach(elm => elm.draw());
    if(globalTime%20===0){
        void(0);
    };
};

function projectToHyperPlane(apexes,dir=0){return apexes.map(pos => dot(pos,[Math.cos(dir+Math.PI/2),Math.sin(dir+Math.PI/2)]));};

class hitBox{
    constructor(attr=class{constructor(){this.x=0;this.y=0}},x=0,y=0,dir=0,apexes=class{constructor(){this.x=0;this.y=0}}){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.apexes = apexes;
        this.attr = attr;
    };
    projectToHyperPlane(dir=0){
        const apexesPos = this.apexes.map(pos => rotate(pos[0],pos[1],this.dir,(this.attr.x??0)+this.x,(this.attr.y??0)+this.y));
        return apexesPos.map(pos => dot((pos),[Math.cos(dir+Math.PI/2),Math.sin(dir+Math.PI/2)]));
    };
    draw(){
        if(this.attr instanceof overOwn){ctx.fillStyle = "rgba(0,0,225,0.5)"}
        else{ctx.fillStyle = "rgba(225,0,0,0.5)"};
        transformCvs((this.attr.x??0)+this.x,(this.attr.y??0)+this.y,this.dir,1,1);
        ctx.beginPath();this.apexes.forEach((elm,i) => {if(i=0){ctx.moveTo(...elm);}else{ctx.lineTo(...elm);};});ctx.closePath();ctx.fill();
    };
};

const Obb = (x,y,dir,w,h,attr) => {return new hitBox(attr,x,y,dir,[[w/2,h/2],[-w/2,h/2],[-w/2,-h/2],[w/2,-h/2]])}

class Wall{
    static instanceof = [];
    colMove=0;
    constructor(startPoint,endPoint){
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.updateHitBox();
        Wall.instanceof.push(this);
    };
    updateHitBox(){
        Wall.prototype.middlePoint = [(this.startPoint[0]+this.endPoint[0])/2,(this.startPoint[1]+this.endPoint[1])/2];
        Wall.prototype.length = Math.sqrt((this.startPoint[0]-this.endPoint[0])**2+(this.startPoint[1]-this.endPoint[1])**2);
        Wall.prototype.dir = Math.atan((this.startPoint[1]-this.endPoint[1])/(this.startPoint[0]-this.endPoint[0]));
        Wall.prototype.hitBox = Obb(...this.middlePoint,this.dir,this.length,2,this);
    };
    projectToHyperPlane(dir=0){
        return projectToHyperPlane([this.startPoint,this.endPoint],dir);
    };
    draw(){
        this.updateHitBox();
        ctx.strokeStyle = "rgba(0,0,0,1)";ctx.lineWidth = 2;ctxLine(...this.middlePoint,this.dir,this.length);
        if(debugMode===1){ctx.fillStyle = "rgba(225,225,0,1)";this.hitBox.draw()};
    };
};

class overCharacter{
    static instanceof = [];
    colMove=0;
    constructor(x,y){
        overCharacter.instanceof.push(this);
        this.x = x;
        this.y = y;
        this.dir = 1;
        this.hitBox = Obb(0,-8,0,16,16,this);
    };
    updateHitBox(){void(0)};
    move(){void(0)};
    draw(){drawImage(img,[[0,0],[64,64]],[this.x,this.y,0],[(((globalTime/20)%2>1)?1:-1)*1/3,1/3])};
    static updateAll(){
        overCharacter.instanceof.forEach(elm => elm.move(1));
    };
    static drawAll(){
        let allChar = overCharacter.instanceof;
        const ySort = (arg1,arg2) => {return (arg1.y)-(arg2.y)}
        allChar.sort(ySort);
        allChar.forEach(elm => elm.draw())
        if(debugMode===1){allChar.forEach(elm => {elm.hitBox.draw();})};
    };
};

class overOwn extends overCharacter{
    static instanceof = []
    colMove=1;
    constructor(...args){
        super(...args);
        overOwn.instanceof.push(this);
    };
    move(a){
        let movePermit = 1;
        overOwn.prototype.v = [0,0];this.v = [0,0];
        if(overOwn.instanceof.indexOf(this)===0){
            if(keyStick.ArrowRight>0){this.v[0] +=a;};
            if(keyStick.ArrowLeft>0){this.v[0] -=a;};
            if(keyStick.ArrowDown>0){this.v[1] +=a;};
            if(keyStick.ArrowUp>0){this.v[1] -=a;};
            if(!(this.v[0]===0&&this.v[1]===0)){this.v = this.v.map(val => a*val/Math.sqrt(this.v[0]**2+this.v[1]**2));};
            //camX += (this.x-camX)/1;camY += (this.y-camY)/1;
        }else{
            if((Math.abs(this.x-overOwn.instanceof[overOwn.instanceof.indexOf(this)-1].x)+Math.abs(this.y-overOwn.instanceof[overOwn.instanceof.indexOf(this)-1].y))<1){movePermit=0};
            let tIntr = Array(8).fill(0);
            const sumTIntr=(intr,w=1)=>{tIntr = tIntr.map((val,i) => val+w*intr[i]);};
            const nmlTgt=(pos)=>{return nmlWay(this.x-pos[0],this.y-pos[1],8)};
            const dst=(pos)=>{return Math.sqrt((this.x-pos[0])**2+(this.y-pos[1])**2);};
            const intrToTgt=(pos,w0=1,w1=0)=>{sumTIntr(nmlTgt(pos),(w0+w1*1/(dst(pos)**1)));};
            intrToTgt([overOwn.instanceof[overOwn.instanceof.indexOf(this)-1].x,overOwn.instanceof[overOwn.instanceof.indexOf(this)-1].y],1,0);
            const tDir = tIntr.indexOf(Math.max(...tIntr.map(val => val)));
            this.v[0] -= a*Math.cos(tDir*45*(Math.PI/180));
            this.v[1] -= a*Math.sin(tDir*45*(Math.PI/180));
            movePermit = 0;
        };
        if(!(this.v[0]===0&&this.v[1]===0)){const tRlt = nmlWay(this.v[0],this.v[1],4);const tDir = tRlt.indexOf(Math.max(...tRlt));this.dir = tDir;}
        if(movePermit===1){[this.x,this.y] = [this.x,this.y].map((val,i) => val+this.v[i]);};
        };
    draw(pos=[0,0]){
        const imgArea = walkImg([96,96],[1,0],this.dir,globalTime/20);
        drawImage(img,imgArea[0],[this.x+pos[0],this.y+pos[1],0],[imgArea[1]*1/3,1/3])
    };
};

class overEnemy extends overCharacter{constructor(){void(0)};draw(){void(0)};};

function walkImg(imgSize=[96,96],stdPos=[0,0],dir,frame){
    if(dir===0){return [[[imgSize[0]*(stdPos[0]+2+(Math.round(frame)%2)),imgSize[1]*(stdPos[1])],[imgSize[0]*(stdPos[0]+3+(Math.round(frame)%2)),imgSize[1]*(stdPos[1]+1)]],1]};
    if(dir===1){return [[[imgSize[0]*(stdPos[0]),imgSize[1]*(stdPos[1])],[imgSize[0]*(stdPos[0]+1),imgSize[1]*(stdPos[1]+1)]],((Math.round(frame)%2===0)?1:-1)]};
    if(dir===2){return [[[imgSize[0]*(stdPos[0]+2+(Math.round(frame)%2)),imgSize[1]*(stdPos[1])],[imgSize[0]*(stdPos[0]+3+(Math.round(frame)%2)),imgSize[1]*(stdPos[1]+1)]],-1]};
    if(dir===3){return [[[imgSize[0]*(stdPos[0]+1),imgSize[1]*(stdPos[1])],[imgSize[0]*(stdPos[0]+2),imgSize[1]*(stdPos[1]+1)]],((Math.round(frame)%2===0)?1:-1)]};
};

function nmlWay(x,y,tNoW=8){
    let nml = [];
    for(let i=0;i<tNoW;i++){nml.push(dot([x,y],[Math.cos(i*2*Math.PI/tNoW),Math.sin(i*2*Math.PI/tNoW)]));};
    return nml;
};

function overCol(elm1,elm2){
    elm1.updateHitBox();elm2.updateHitBox();
    if(elm1.colMove===0&&elm.colMove===0){return(void(0))};
        const sDir = (elm,num) => {tApx = elm.hitBox.apexes.map(apx => {return rotate(...apx,elm.hitBox.dir,(elm.x??0)+elm.hitBox.x,(elm.y??0)+elm.hitBox.y)});if(num<0||num>tApx.length-1){return void(0)};return Math.atan((tApx[(num+1)%tApx.length][1]-tApx[(num)%tApx.length][1])/(tApx[(num+1)%tApx.length][0]-tApx[(num)%tApx.length][0]))};
        const allSDir = (elm) => {tApx = elm.hitBox.apexes.map(apx => {return rotate(...apx,elm.hitBox.dir,(elm.x??0)+elm.hitBox.x,(elm.y??0)+elm.hitBox.y)});
        return tApx.map((apx,i) => Math.atan((tApx[(i+1)%tApx.length][1]-apx[1])/(tApx[(i+1)%tApx.length][0]-apx[0])))};
        const apxPos = (elm,num) => {return rotate(...elm.hitBox.apexes[num],elm.hitBox.dir,(elm.x??0)+elm.hitBox.x,(elm.y??0)+elm.hitBox.y)};
    const hyperPlaneCheck = (dir) => {
    const lApxR = [elm1,elm2].map(elm => {tLApx = elm.hitBox.projectToHyperPlane(dir);return[Math.min(...tLApx),Math.max(...tLApx)]});
    const tDif = [lApxR[0][1]-lApxR[1][0],lApxR[1][1]-lApxR[0][0]];
    if(tDif.every(val => val>0)){return(Math.min(...tDif))}else{return(void(0))};};
    const allDif = [elm1,elm2].map(elm => allSDir(elm).map(dir => hyperPlaneCheck(dir)));
    const elmPush = allDif.map((dif,i) => {minDif = Math.min(...dif);return [minDif,[elm1,elm2][i],dif.indexOf(minDif)]});
    if(allDif.some(dif => dif.includes(void(0)))){return(void(0))};
    if(elm1.colMove!==0&&elm2.colMove===0){
        const tAxisDir = sDir(elmPush[1][1],elmPush[1][2]);
        const tSP = apxPos(elmPush[1][1],elmPush[1][2]);
        const tS = (cross([(elm1.x+elm1.hitBox.x)-tSP[0],(elm1.y+elm1.hitBox.y)-tSP[1]],[Math.cos(tAxisDir),Math.sin(tAxisDir)])>0?1:-1);
        elm1.x -= tS*elmPush[1][0]*Math.cos(tAxisDir+Math.PI/2);
        elm1.y -= tS*elmPush[1][0]*Math.sin(tAxisDir+Math.PI/2);};
    if(elm1.colMove===0&&elm2.colMove!==0){
        const tAxisDir = sDir(elmPush[0][1],elmPush[0][2]);
        const tSP = apxPos(elmPush[0][1],elmPush[0][2]);
        const tS = (cross([(elm2.x+elm2.hitBox.x)-tSP[0],(elm2.y+elm1.hitBox.y)-tSP[1]],[Math.cos(tAxisDir),Math.sin(tAxisDir)])>0?1:-1);
        elm2.x -= tS*elmPush[0][0]*Math.cos(tAxisDir+Math.PI/2);
        elm2.y -= tS*elmPush[0][0]*Math.sin(tAxisDir+Math.PI/2);};
};

let stuffs = [new overCharacter(-64,-64)];
for(let i=0;i<0;i++){stuffs.push(new overCharacter(-64+(i+1)*24,-64))};
let own = [new overOwn(0,0)];
//let wall = [new Wall([0,50],[100,50])];wall.push(new Wall([0,150],[100,150]));
let wall = [];for(let i=0;i<10;i++){wall.push(new Wall([cvsSize[0]*(Math.random()-1/2),cvsSize[1]*(Math.random()-1/2)],[cvsSize[0]*(Math.random()-1/2),cvsSize[1]*(Math.random()-1/2)]))};
canvas.addEventListener("click",(e) => {stuffs.push(new overCharacter(cvsSize[0]*(Math.random()-1/2),cvsSize[1]*(Math.random()-1/2)))})