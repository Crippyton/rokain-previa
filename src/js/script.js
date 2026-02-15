// ================= SAFE SELECTORS =================
const safe = (q) => document.querySelector(q);
const safeAll = (q) => document.querySelectorAll(q);

// ================= LAUNCH DATE =================
const LAUNCH_DATE = new Date("2027-01-01T00:00:00");

// ================= REAL SERVER COUNTDOWN =================
async function startRealCountdown() {
  try {
    const res = await fetch("/server-time");
    const data = await res.json();

    const serverStart = performance.now();
    const serverNow = parseFloat(data.timestamp) * 1000;

    function update() {
      const now = serverNow + (performance.now() - serverStart);
      const diff = LAUNCH_DATE - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000) % 24;
      const minutes = Math.floor(diff / 60000) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      const nums = safeAll(".counter-number");
      if (nums.length >= 4) {
        nums[0].textContent = days;
        nums[1].textContent = hours;
        nums[2].textContent = minutes;
        nums[3].textContent = seconds;
      }
    }

    update();
    setInterval(update, 1000);

  } catch (e) {
    console.error("Countdown erro:", e);
  }
}

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
        startRealCountdown();
      }, 500);
    }
    percentageElement.textContent = Math.floor(percentage) + "%";
  }, 150);
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
safeAll(".social-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    window.open(link.href, "_blank");
  });
});

// ================= NEWSLETTER =================
const newsletter = safe("#newsletterForm");
if (newsletter) newsletter.addEventListener("submit", e => e.preventDefault());

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