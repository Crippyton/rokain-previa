// Utilidades leves (sem frameworks)
window.$$ = (sel, root=document) => root.querySelector(sel);
window.$$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

window.normalizeText = (s="") =>
  s.toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

window.debounce = (fn, ms=200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
