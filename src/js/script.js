/**
 * ROKAIN — script.js
 * Loader · Stars · Particles · Countdown · Newsletter
 */

(function () {
  'use strict';

  /* ─── LOADER ──────────────────────────────────────── */
  const loader      = document.getElementById('loader');
  const percentage  = document.getElementById('loadingPercentage');
  let   pct         = 0;

  const loadInterval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(loadInterval);
      if (percentage) percentage.textContent = '100%';
      setTimeout(() => loader && loader.classList.add('hidden'), 400);
    }
    if (percentage) percentage.textContent = Math.floor(pct) + '%';
  }, 120);

  /* ─── STARS ───────────────────────────────────────── */
  function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    const count = window.innerWidth < 600 ? 60 : 120;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        width:  ${size}px;
        height: ${size}px;
        --duration: ${(Math.random() * 4 + 2).toFixed(1)}s;
        --delay:    ${(Math.random() * 4).toFixed(1)}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      container.appendChild(star);
    }
  }

  /* ─── PARTICLES ───────────────────────────────────── */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = window.innerWidth < 600 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:       ${Math.random() * 100}%;
        bottom:     ${Math.random() * 20}%;
        --duration: ${(Math.random() * 8 + 6).toFixed(1)}s;
        --delay:    ${(Math.random() * 8).toFixed(1)}s;
      `;
      container.appendChild(p);
    }
  }

  /* ─── COUNTDOWN ───────────────────────────────────── */
  // Data alvo: defina aqui a data de lançamento
  // Formato: new Date('YYYY-MM-DDTHH:MM:SS')
  const TARGET_DATE = new Date('2026-12-30T00:00:00');

  function updateCountdown() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    const numbers = document.querySelectorAll('.counter-number');
    if (!numbers.length) return;

    if (diff <= 0) {
      // Lançamento chegou!
      numbers.forEach(n => { n.textContent = '0'; });
      const label = document.querySelector('.coming-soon');
      if (label) label.textContent = '🚀 Já disponível!';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const values = [days, hours, minutes, seconds];
    numbers.forEach((el, i) => {
      const val = String(values[i]).padStart(2, '0');
      if (el.textContent !== val) {
        el.style.transform = 'scale(1.1)';
        el.textContent = val;
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 150);
      }
    });
  }

  // Atualiza imediatamente e depois a cada segundo
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─── NEWSLETTER ──────────────────────────────────── */
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn   = form.querySelector('.newsletter-btn');
      const email = input ? input.value.trim() : '';

      if (!email) return;

      // Feedback visual
      btn.classList.add('success');
      btn.innerHTML = '<i class="fas fa-check"></i> Cadastrado!';
      btn.disabled  = true;
      if (input) input.disabled = true;

      // Reset após 4s
      setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Notifique-me';
        btn.disabled  = false;
        if (input) { input.disabled = false; input.value = ''; }
      }, 4000);
    });
  }

  /* ─── INIT ────────────────────────────────────────── */
  createStars();
  createParticles();

})();
