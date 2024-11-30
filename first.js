var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
cvsSize = [600,450];
const cvsCenter = [cvsSize[0]/2,cvsSize[1]/2];
let cvsScale = 1;
resizeCanvas();
window.addEventListener("resize",() =>{resizeCanvas()})

function resizeCanvas(){
    cvsScale = Math.min(window.innerWidth/600,window.innerHeight/450);
    canvas.style.width = `${cvsSize[0]*cvsScale}px`;
    canvas.style.height = `${cvsSize[1]*cvsScale}px`;
    canvas.width = cvsSize[0]*cvsScale*window.devicePixelRatio;
    canvas.height = cvsSize[1]*cvsScale*window.devicePixelRatio;
    cvsScale *=window.devicePixelRatio;
};

let camX=0;
let camY=0;
let camDir=0;
let camScale=[1,1];
let camShake=[0,0];

const transformCvs = (x,y,dir,sx=1,sy=1) => {
    ctx.setTransform(cvsScale,0,0,cvsScale,0,0);
    ctx.transform(camScale[0]*Math.cos(camDir),camScale[0]*Math.sin(camDir),camScale[1]*(-Math.sin(camDir)),camScale[1]*Math.cos(camDir),cvsSize[0]/2,cvsSize[1]/2);
    ctx.transform(1,0,0,1,-camX,-camY);
    ctx.transform(sx*Math.cos(dir),sx*Math.sin(dir),sy*(-Math.sin(dir)),sy*Math.cos(dir),x,y);
};
const ctxRect = (x,y,dir,w,h) => {
    if(w<0||h<0){return(void(0))};
    transformCvs(x,y,dir,1,1);
    ctx.fillRect(-w/2,-h/2,w/2,h/2);};

const ctxLine = (x,y,dir,l) => {
    if(l<0){return(void(0))};
    transformCvs(x,y,dir,1,1);
    ctx.beginPath();
    ctx.moveTo(-l/2,0);
    ctx.lineTo(l/2,0);
    ctx.closePath();
    ctx.stroke();
};

function drawImage(img,drawArea=[[0,0],[0,0]],pos=[0,0,0],scale=[1,1]){
    const imgSize = [drawArea[1][0]-drawArea[0][0],drawArea[1][1]-drawArea[0][1]];
    transformCvs(pos[0],pos[1],0,scale[0],scale[1])
    ctx.fillStyle="rgba(225,0,0,0.5)"
    ctx.drawImage(img,drawArea[0][0],drawArea[0][1],imgSize[0],imgSize[1],-imgSize[0]/2,-imgSize[1]/2-imgSize[1]/2,imgSize[0],imgSize[1]);
};

const rotate = (x,y,dir,cx=0,cy=0) => {return [cx+(x*Math.cos(dir)-y*Math.sin(dir)),cy+(x*Math.sin(dir)+y*Math.cos(dir))]};

let keyPress = [];
let keyStick = {ArrowUp:0,ArrowRight:0,ArrowDown:0,ArrowLeft:0};
window.addEventListener("keydown",(event) => {if(!(keyPress.includes(event.key))){keyPress.push(event.key);};keyInput();});
window.addEventListener("keyup",(event) => {keyPress.splice(keyPress.indexOf(event.key),1);keyInput();});
const keyInput = () => {Object.keys(keyStick).forEach(key => {if(keyPress.includes(key)){keyStick[key]++}else{keyStick[key]=0};});};

let debugMode = 0;

const dot = (vector1,vector2) => {return vector1[0]*vector2[0]+vector1[1]*vector2[1]};
const cross = (vector1,vector2) => {return vector1[0]*vector2[1]-vector1[1]*vector2[0]};