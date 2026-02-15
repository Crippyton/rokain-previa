// ================= SAFE SELECTORS =================
const safe = (q) => document.querySelector(q);
const safeAll = (q) => document.querySelectorAll(q);

// ================= LOADER =================
let percentage = 0;
const percentageElement = safe("#loadingPercentage");
const loaderElement = safe("#loader");

if (percentageElement && loaderElement) {
  const loadingInterval = setInterval(() => {
    percentage += Math.random() * 15;
    if (percentage >= 100) {
      percentage = 100;
      clearInterval(loadingInterval);
      setTimeout(() => {
        loaderElement.classList.add("hidden");
        initializeCounters();
      }, 500);
    }
    percentageElement.textContent = Math.floor(percentage) + "%";
  }, 150);
}

// ================= COUNTERS =================
function initializeCounters() {
  const counters = safeAll(".counter-number");
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target);
    let current = 0;

    const update = () => {
      current += target / 120;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else counter.textContent = target;
    };

    update();
  });
}

// ================= STARS =================
function createStars() {
  const container = safe("#starsContainer");
  if (!container) return;

  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    container.appendChild(star);
  }
}
createStars();

// ================= PARTICLES =================
function createParticles() {
  const container = safe("#particles");
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * innerWidth + "px";
    p.style.top = Math.random() * innerHeight + "px";
    container.appendChild(p);
  }
}
createParticles();

// ================= SOCIAL LINKS =================
safeAll(".social-links a").forEach((link) => {
  link.addEventListener("click", e => {
    e.preventDefault();
    window.open(link.href, "_blank");
  });
});

// ================= RIPPLE =================
function createRipple(e) {
  const r = document.createElement("div");
  r.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:5px;height:5px;
    background:rgba(0,217,255,.6);
    border-radius:50%;
    transform:translate(-50%,-50%);
    animation:rippleExpand .6s;
    z-index:9999;
  `;
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),600);
}

// ================= NEWSLETTER =================
const newsletter = safe("#newsletterForm");
if (newsletter) {
  newsletter.addEventListener("submit", e => {
    e.preventDefault();
  });
}

// ================= PARALLAX =================
document.addEventListener("mousemove", e => {
  safeAll(".circle").forEach((c,i)=>{
    c.style.transform=`translate(${(e.clientX/innerWidth-.5)*(i+1)*20}px,${(e.clientY/innerHeight-.5)*(i+1)*20}px)`
  });
});

// ================= OBSERVER =================
safeAll(".feature-card").forEach(card=>{
  new IntersectionObserver(e=>{
    if(e[0].isIntersecting) card.style.animation="slideUp .6s forwards";
  }).observe(card);
});

// ================= TYPING EFFECT =================
const message = safe(".message");
if (message) {
  const html = message.innerHTML;
  message.innerHTML="";
  let i=0;

  setTimeout(()=>{
    const t=setInterval(()=>{
      message.innerHTML=html.substring(0,i++);
      if(i>html.length) clearInterval(t);
    },30);
  },1500);
}

// ================= ICON GLOW =================
setInterval(()=>{
  const icon = safe(".icon-glow");
  if(icon){
    icon.style.color=["#00D9FF","#00FF88","#fff"][Math.floor(Math.random()*3)];
  }
},2000);

// ================= FINAL LOADER =================
if (loaderElement){
  setTimeout(()=>{
    loaderElement.classList.add("hidden");
  },3000);
}