// Persistência simples (favoritos e tema)
const KEY_FAV = "portais:favorites";
const KEY_THEME = "portais:theme";
const KEY_SORT = "portais:sort";

window.storage = {
  getFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY_FAV) || "[]")); }
    catch { return new Set(); }
  },
  setFavorites(set) {
    localStorage.setItem(KEY_FAV, JSON.stringify([...set]));
  },

  getTheme() {
    return localStorage.getItem(KEY_THEME) || "dark";
  },
  setTheme(theme) {
    localStorage.setItem(KEY_THEME, theme);
  },

  getSort() {
    return localStorage.getItem(KEY_SORT) || "fav";
  },
  setSort(sort) {
    localStorage.setItem(KEY_SORT, sort);
  }
};
