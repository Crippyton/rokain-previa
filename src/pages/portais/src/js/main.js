(function(){
  const apps = readApps();
  const favs = storage.getFavorites();

  const grid = $$("#grid");
  const empty = $$("#emptyState");

  const searchInput = $$("#searchInput");
  const clearSearch = $$("#clearSearch");
  const categorySelect = $$("#categorySelect");
  const sortSelect = $$("#sortSelect");
  const favoritesOnly = $$("#favoritesOnly");
  const resetFilters = $$("#resetFilters");

  const countVisible = $$("#countVisible");
  const countTotal = $$("#countTotal");
  const activeChips = $$("#activeChips");

  const themeToggle = $$("#themeToggle");

  // Ícones padrão por categoria (se app.faIcon não vier definido)
  const CATEGORY_ICON = {
    "Gestão": "fa-solid fa-briefcase",
    "Pessoas": "fa-solid fa-people-group",
    "Comercial": "fa-solid fa-chart-line",
    "Operações": "fa-solid fa-gears",
    "TI": "fa-solid fa-laptop-code",
    "Projetos": "fa-solid fa-diagram-project",
    "Qualidade": "fa-solid fa-shield-check",
    "Logística": "fa-solid fa-truck-fast",
    "Jurídico": "fa-solid fa-scale-balanced",
    "Financeiro": "fa-solid fa-sack-dollar",
    "Administração": "fa-solid fa-building",
    "Relatórios": "fa-solid fa-file-lines",
    "Suporte": "fa-solid fa-headset",
  };

  initTheme();
  initCategories(apps);
  initSort();
  bindEvents();

  countTotal.textContent = apps.length;
  render();

  // -------------------------

  function readApps(){
    const el = $$("#appsData");
    if(!el) return [];
    try { return JSON.parse(el.textContent.trim()); }
    catch { return []; }
  }

  function initTheme(){
    const theme = storage.getTheme();
    document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    updateThemeButton();
    themeToggle.addEventListener("click", () => {
      const curr = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const next = curr === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      storage.setTheme(next);
      updateThemeButton();
    });
  }

  function updateThemeButton(){
    const isLight = document.documentElement.dataset.theme === "light";
    const icon = themeToggle.querySelector(".btn__icon");
    const text = themeToggle.querySelector(".btn__text");
    icon.className = isLight ? "fa-solid fa-sun btn__icon" : "fa-solid fa-moon btn__icon";
    text.textContent = isLight ? "Claro" : "Escuro";
  }

  function initCategories(apps){
    const categories = Array.from(new Set(apps.map(a => a.category).filter(Boolean)))
      .sort((a,b)=>a.localeCompare(b));
    for(const c of categories){
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    }
  }

  function initSort(){
    sortSelect.value = storage.getSort();
  }

  function bindEvents(){
    searchInput.addEventListener("input", debounce(render, 120));
    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      render();
    });

    categorySelect.addEventListener("change", render);
    favoritesOnly.addEventListener("change", render);

    sortSelect.addEventListener("change", () => {
      storage.setSort(sortSelect.value);
      render();
    });

    resetFilters.addEventListener("click", () => {
      searchInput.value = "";
      categorySelect.value = "all";
      favoritesOnly.checked = false;
      sortSelect.value = "fav";
      storage.setSort("fav");
      render();
    });

    // UX: Enter abre o primeiro resultado
    searchInput.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        const first = grid.querySelector("a.open");
        if(first) first.click();
      }
    });
  }

  function render(){
    const q = normalizeText(searchInput.value.trim());
    const cat = categorySelect.value;
    const onlyFav = favoritesOnly.checked;

    let filtered = apps.filter(app => {
      const isFav = favs.has(app.id);

      if(onlyFav && !isFav) return false;
      if(cat !== "all" && app.category !== cat) return false;

      if(!q) return true;

      const hay = normalizeText([
        app.name, app.description, app.category,
        ...(app.tags || [])
      ].filter(Boolean).join(" "));

      return hay.includes(q);
    });

    filtered = sortApps(filtered);

    renderChips({ q, cat, onlyFav });
    renderGrid(filtered);

    countVisible.textContent = filtered.length;
    empty.hidden = filtered.length !== 0;
  }

  function sortApps(list){
    const mode = sortSelect.value;
    const byName = (a,b) => (a.name||"").localeCompare(b.name||"");
    if(mode === "az") return [...list].sort(byName);
    if(mode === "za") return [...list].sort((a,b)=>byName(b,a));

    // default: favoritos primeiro, depois A-Z
    return [...list].sort((a,b)=>{
      const af = favs.has(a.id) ? 0 : 1;
      const bf = favs.has(b.id) ? 0 : 1;
      if(af !== bf) return af - bf;
      return byName(a,b);
    });
  }

  function renderChips({ q, cat, onlyFav }){
    activeChips.innerHTML = "";
    const chips = [];

    if(q) chips.push({ label: `Busca: \"${searchInput.value.trim()}\"` });
    if(cat !== "all") chips.push({ label: `Categoria: ${cat}` });
    if(onlyFav) chips.push({ label: `Favoritos` });

    for(const c of chips){
      const el = document.createElement("span");
      el.className = "chip";
      el.textContent = c.label;
      activeChips.appendChild(el);
    }
  }

  function renderGrid(list){
    grid.innerHTML = "";
    for(const app of list){
      grid.appendChild(card(app));
    }
  }

  function card(app){
    const isFav = favs.has(app.id);

    const favIconClass = isFav ? "fa-solid fa-star" : "fa-regular fa-star";
    const appIcon = app.faIcon || CATEGORY_ICON[app.category] || "fa-solid fa-cubes";

    const el = document.createElement("article");
    el.className = "card";
    el.setAttribute("role","listitem");

    const tags = (app.tags || []).slice(0, 6)
      .map(t => `<span class=\"tag\">${escapeHtml(t)}</span>`)
      .join("");

    el.innerHTML = `
      <div class=\"card__top\">
        <span class=\"badge\">
          <span class=\"icon\" aria-hidden=\"true\"><i class=\"${escapeHtml(appIcon)}\"></i></span>
          ${escapeHtml(app.category || "Sem categoria")}
        </span>

        <button class=\"fav ${isFav ? "isFav" : ""}\" type=\"button\"
                aria-label=\"Favoritar ${escapeHtml(app.name)}\" title=\"Favoritar\">
          <i class=\"${favIconClass}\" aria-hidden=\"true\"></i>
        </button>
      </div>

      <div class=\"card__body\">
        <h3 class=\"card__name\">${escapeHtml(app.name)}</h3>
        <p class=\"card__desc\">${escapeHtml(app.description || "")}</p>

        <div class=\"tags\" aria-label=\"Tags\">${tags}</div>
      </div>

      <div class=\"card__actions\">
        <a class=\"open\" href=\"${escapeAttr(app.url)}\" aria-label=\"Abrir ${escapeHtml(app.name)}\">
          Abrir <i class=\"fa-solid fa-arrow-up-right-from-square\" aria-hidden=\"true\"></i>
        </a>

        <a class=\"smallLink\" href=\"${escapeAttr(app.url)}\" target=\"_blank\" rel=\"noopener\" aria-label=\"Abrir ${escapeHtml(app.name)} em nova aba\">
          Nova aba <i class=\"fa-solid fa-up-right-from-square\" aria-hidden=\"true\"></i>
        </a>
      </div>
    `;

    const favBtn = el.querySelector(".fav");
    favBtn.addEventListener("click", () => {
      if(favs.has(app.id)) favs.delete(app.id);
      else favs.add(app.id);
      storage.setFavorites(favs);
      render();
    });

    return el;
  }

  function escapeHtml(str=""){
    return str.toString().replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }
  function escapeAttr(str=""){
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
})();
