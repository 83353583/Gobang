let start = document.querySelector("#start");
let container = document.querySelector(".container");
let canvas=document.querySelector("canvas");
let startSence=document.querySelector(".control");
let overSence=document.querySelector(".over");
let win=document.querySelector(".win span");
let ctx=canvas.getContext("2d");
let restart=document.querySelector("#restart");
let flag=true;
let w=40;
let pos={};
let blank={};
let AI=false;
let AIMode=document.querySelector("#AI");
let PVPMode=document.querySelector("#PVP");
AIMode.onfocus=function(){
    AI=true;
};
PVPMode.onfocus=function(){
    AI=false;
};
restart.onclick=function(){
    history.go(0);
};
ctx.translate(30,30);
start.onclick = function () {
    container.classList.add("fuck-start");
    startSence.style.display="none";
};
drawBoard();
function drawBoard(){
    ctx.save();
    ctx.strokeStyle="#8B4513";
    ctx.lineWidth=26;
    ctx.rect(-30,-30,620,620);
    ctx.stroke();
    ctx.strokeStyle="#000";
    ctx.lineWidth=2;
    ctx.rect(-4,-4,568,568);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.save();
    for(let i=1;i<14;i++){
        ctx.moveTo(w*i+0.5,0);
        ctx.lineTo(w*i+0.5,560);
        ctx.moveTo(0,w*i+0.5);
        ctx.lineTo(560,w*i+0.5);
        ctx.stroke();
    }
    ctx.rect(0.5,0.5,559,559);
    ctx.stroke();
    ctx.restore();
    drawDot(3,3);
    drawDot(3,11);
    drawDot(11,3);
    drawDot(11,11);
    drawDot(7,7);
    for(let i=0;i<15;i++){
        for(let j=0;j<15;j++){
            blank[formPos(i,j)]=true;
        }
    }
}
function drawDot(x,y){
    ctx.beginPath();
    ctx.save();
    ctx.arc(x*w,y*w,4,0,2*Math.PI);
    ctx.fill();
    ctx.restore();
}
function drawChess(x,y,color){
    ctx.beginPath();
    ctx.save();
    ctx.arc(x*w,y*w,15,0,2*Math.PI);
    ctx.fillStyle=color;
    ctx.fill();
    ctx.restore();
    delete blank[formPos(x,y)];
}
function formPos(x,y) {
    return x+"_"+y;
}
function checkChess(x,y,color) {
    //行
    let row=1;
    let i=1;
    while(pos[formPos(x+i,y)]===color){
        row++;
        i++;
    }
    i=1;
    while(pos[formPos(x-i,y)]===color){
        row++;
        i++;
    }
    //列
    let col=1;
    i=1;
    while(pos[formPos(x,y+i)]===color){
        col++;
        i++;
    }
    i=1;
    while(pos[formPos(x,y-i)]===color){
        col++;
        i++;
    }
    //左上右下
    let mdia=1;
    i=1;
    while(pos[formPos(x+i,y+i)]===color){
        mdia++;
        i++;
    }
    i=1;
    while(pos[formPos(x-i,y-i)]===color){
        mdia++;
        i++;
    }
    //右上左下
    let sdia=1;
    i=1;
    while(pos[formPos(x+i,y-i)]===color){
        sdia++;
        i++;
    }
    i=1;
    while(pos[formPos(x-i,y+i)]===color){
        sdia++;
        i++;
    }
    return Math.max(row,col,mdia,sdia);

}
function getAIPos(){
    let attPos={};
    let defPos={};
    let attMax=0;
    let defMax=0;
    for(let i in blank){
        let x=parseInt(i.split("_")[0]);
        let y=parseInt(i.split("_")[1]);
        let attNum=checkChess(x,y,"#000");
        if(attNum>attMax){
            attMax=attNum;
            attPos={x,y};
        }
    }
    for(let i in blank){
        let x=parseInt(i.split("_")[0]);
        let y=parseInt(i.split("_")[1]);
        let defNum=checkChess(x,y,"#fff");
        if(defNum>defMax){
            defMax=defNum;
            defPos={x,y};
        }
    }
    if(attMax>=defMax){
        return attPos;
    }else{
        return defPos;
    }

}
canvas.onclick=function(e){
    let x=Math.round((e.offsetX-30)/w);
    let y=Math.round((e.offsetY-30)/w);
    if(pos[formPos(x,y)]){
        return;
    }
    if (flag){
        drawChess(x,y,"#000");
        pos[formPos(x,y)]="#000";
        if(checkChess(x,y,"#000")===5){
            overSence.style.display="block";
            win.innerHTML="黑棋获胜";
        }
        if(AI){
            let AIPos=getAIPos();
            drawChess(AIPos.x,AIPos.y,"#fff");
            pos[formPos(AIPos.x,AIPos.y)]="#fff";
            console.log(AIPos.x,AIPos.y);
            if(checkChess(AIPos.x,AIPos.y,"#fff")===5){
                overSence.style.display="block";
                win.innerHTML="白棋获胜";
            }
            return;
        }
    }else{
        drawChess(x,y,"#fff");
        pos[formPos(x,y)]="#fff";
        if(checkChess(x,y,"#fff")===5){
            overSence.style.display="block";
            win.innerHTML="白棋获胜";
        }
    }
    flag=!flag;
};
