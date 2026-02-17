/* PARTICULAS */

const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");

function resize(){
canvas.width=innerWidth;
canvas.height=innerHeight;
}
resize();
addEventListener("resize",resize);

const dots=[];
for(let i=0;i<90;i++){
dots.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2+1,
vx:(Math.random()-.5)*.4,
vy:(Math.random()-.5)*.4
});
}

function loop(){
ctx.clearRect(0,0,canvas.width,canvas.height);
dots.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle="#00ffe1";
ctx.fill();
p.x+=p.vx;p.y+=p.vy;
if(p.x<0||p.x>canvas.width)p.vx*=-1;
if(p.y<0||p.y>canvas.height)p.vy*=-1;
});
requestAnimationFrame(loop);
}
loop();

/* AUDIO */

const audio=document.getElementById("ambient");
audio.volume=.12;
window.addEventListener("click",()=>audio.play(),{once:true});

/* RIPPLE */

document.querySelectorAll(".btn-404").forEach(b=>{
b.addEventListener("click",e=>{

const ripple=document.createElement("span");
ripple.className="ripple";
ripple.style.left=e.offsetX+"px";
ripple.style.top=e.offsetY+"px";
b.appendChild(ripple);

setTimeout(()=>ripple.remove(),600);

});
});