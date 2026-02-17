const c=document.getElementById("particles"),x=c.getContext("2d");
function r(){c.width=innerWidth;c.height=innerHeight}r();onresize=r;
const p=[];for(let i=0;i<80;i++)p.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+1,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4});
(function a(){x.clearRect(0,0,c.width,c.height);p.forEach(e=>{x.beginPath();x.arc(e.x,e.y,e.r,0,Math.PI*2);x.fillStyle="#ff0055";x.fill();e.x+=e.vx;e.y+=e.vy;if(e.x<0||e.x>c.width)e.vx*=-1;if(e.y<0||e.y>c.height)e.vy*=-1});requestAnimationFrame(a)})();

document.querySelectorAll(".btn-403").forEach(b=>{
b.addEventListener("click",e=>{
const s=document.createElement("span");
s.className="ripple";
s.style.left=e.offsetX+"px";
s.style.top=e.offsetY+"px";
b.appendChild(s);
setTimeout(()=>s.remove(),600);
});
});