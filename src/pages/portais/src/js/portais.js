/**
 * ROKAIN PORTAIS — portais.js
 * Motor do portal: filtros, busca, favoritos, atalhos
 */

(function () {
  'use strict';

  /* ─── UTILS ─────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const tools = window.ROKAIN_TOOLS || [];

  /* ─── STATE ─────────────────────────────────── */
  let state = {
    query:    '',
    category: '',
    sort:     'favorites',
    favOnly:  false,
    favorites: JSON.parse(localStorage.getItem('rokain_favs') || '[]'),
    theme:    localStorage.getItem('rokain_theme') || 'dark',
  };

  /* ─── THEME ──────────────────────────────────── */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('rokain_theme', t);
  }
  applyTheme(state.theme);

  $('themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
  });

  /* ─── CATEGORIES ─────────────────────────────── */
  function buildCategories() {
    const cats = [...new Set(tools.map(t => t.category).filter(Boolean))].sort();
    const sel = $('categoryFilter');
    cats.forEach(c => {
      const o = document.createElement('option');
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
  }

  /* ─── SEARCH ─────────────────────────────────── */
  const searchWrap  = document.querySelector('.search-wrap');
  const searchInput = $('searchInput');

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value.trim().toLowerCase();
    searchWrap.classList.toggle('has-value', !!state.query);
    render();
  });

  $('searchClear').addEventListener('click', clearSearch);

  function clearSearch() {
    searchInput.value = '';
    state.query = '';
    searchWrap.classList.remove('has-value');
    searchInput.focus();
    render();
  }

  /* ─── FILTERS ────────────────────────────────── */
  $('categoryFilter').addEventListener('change', e => { state.category = e.target.value; render(); });
  $('sortFilter').addEventListener('change',    e => { state.sort     = e.target.value; render(); });
  $('favOnly').addEventListener('change',       e => { state.favOnly  = e.target.checked; render(); });
  $('clearFiltersBtn').addEventListener('click', () => {
    state.query = ''; state.category = ''; state.sort = 'favorites'; state.favOnly = false;
    searchInput.value = '';
    searchWrap.classList.remove('has-value');
    $('categoryFilter').value = '';
    $('sortFilter').value     = 'favorites';
    $('favOnly').checked      = false;
    render();
  });

  /* ─── KEYBOARD ───────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault(); searchInput.focus(); searchInput.select();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      clearSearch();
    }
    if (e.key === 'Enter' && document.activeElement === searchInput) {
      const visible = getFiltered();
      if (visible.length) openTool(visible[0]);
    }
  });

  /* ─── FAVORITES ──────────────────────────────── */
  function isFav(id)   { return state.favorites.includes(id); }
  function toggleFav(id, event) {
    event && event.stopPropagation();
    if (isFav(id)) {
      state.favorites = state.favorites.filter(f => f !== id);
      showToast('Removido dos favoritos');
    } else {
      state.favorites.push(id);
      showToast('★ Adicionado aos favoritos');
    }
    localStorage.setItem('rokain_favs', JSON.stringify(state.favorites));
    render();
  }

  /* ─── FILTER + SORT ──────────────────────────── */
  function getFiltered() {
    let list = tools.filter(t => {
      const q = state.query;
      if (q) {
        const hay = [t.name, t.description, ...(t.tags || [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (state.category && t.category !== state.category) return false;
      if (state.favOnly && !isFav(t.id)) return false;
      return true;
    });

    if (state.sort === 'favorites') {
      list.sort((a, b) => {
        const fa = isFav(a.id), fb = isFav(b.id);
        if (fa !== fb) return fa ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    } else if (state.sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'recent' = order of array = as-is

    return list;
  }

  /* ─── OPEN TOOL ──────────────────────────────── */
  function toolUrl(tool) {
    if (tool.url) return tool.url;
    return `/portais/${tool.slug}/`;
  }

  function openTool(tool, newTab = false) {
    const url = toolUrl(tool);
    if (newTab || tool.url) {
      window.open(url, '_blank', 'noopener');
    } else {
      window.location.href = url;
    }
  }

  /* ─── RENDER ─────────────────────────────────── */
  function render() {
    const list  = getFiltered();
    const grid  = $('toolsGrid');
    const empty = $('emptyState');

    $('statVisible').textContent = `${list.length} visíveis`;
    $('statTotal').textContent   = `${tools.length} no total`;
    $('contentBadge').textContent = list.length;

    if (!list.length) {
      grid.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }
    empty.style.display = 'none';

    grid.innerHTML = list.map((t, i) => cardHTML(t, i)).join('');

    // Bind events
    grid.querySelectorAll('.tool-card').forEach(card => {
      const id = card.dataset.id;
      const tool = tools.find(t => t.id === id);
      if (!tool) return;

      card.addEventListener('click', e => {
        if (e.target.closest('.card-fav')) return;
        if (e.target.closest('.btn-newtab')) return;
        openTool(tool);
      });
      card.querySelector('.card-fav').addEventListener('click', e => toggleFav(id, e));
      card.querySelector('.btn-open').addEventListener('click', e => {
        e.stopPropagation(); openTool(tool);
      });
      card.querySelector('.btn-newtab').addEventListener('click', e => {
        e.stopPropagation(); openTool(tool, true);
      });
    });
  }

  function cardHTML(t, i) {
    const fav = isFav(t.id);
    const tags = (t.tags || []).slice(0, 4).map(tag =>
      `<span class="card-tag">${tag}</span>`).join('');
    const newBadge = t.new ? `<span class="card-category" style="color:var(--green);border-color:rgba(0,255,136,0.25)">novo</span>` : `<span class="card-category">${t.category || 'geral'}</span>`;

    return `
    <div class="tool-card" data-id="${t.id}" style="animation-delay:${i * 40}ms" role="button" tabindex="0" title="${t.name}">
      <div class="card-top">
        <div class="card-icon">${t.icon || '🔧'}</div>
        <div style="display:flex;align-items:center;gap:8px">
          ${newBadge}
          <button class="card-fav ${fav ? 'active' : ''}" title="${fav ? 'Remover favorito' : 'Favoritar'}">${fav ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="card-body">
        <p class="card-name">${t.name}</p>
        <p class="card-desc">${t.description}</p>
      </div>
      ${tags ? `<div class="card-tags">${tags}</div>` : ''}
      <div class="card-footer">
        <button class="btn-open">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Abrir
        </button>
        <button class="btn-newtab" title="Abrir em nova aba">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Nova aba
        </button>
      </div>
    </div>`;
  }

  /* ─── TOAST ──────────────────────────────────── */
  function showToast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ─── INIT ───────────────────────────────────── */
  buildCategories();
  render();

})();
