let globalTime = 0
let scene = 0;
window.onload = () => {
    frame();
};

function frame(){
    globalTime++
    keyInput();
    update();
    draw();
    window.requestAnimationFrame(frame)
};