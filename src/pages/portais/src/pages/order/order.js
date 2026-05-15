
    const batCopyRegex = /(.*)\s\((\d+)\)\.bat$/i; // "nome (1).bat" → [nome] [n]
    const byNameAsc = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "accent" });

    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));

    const ui = {
      dz: $("#dropzone"),
      fileInput: $("#fileInput"),
      clearBtn: $("#clearBtn"),
      analyzeBtn: $("#analyzeBtn"),
      downloadBtn: $("#downloadZipBtn"),
      keptList: $("#keptList"),
      removedList: $("#removedList"),
      removedPanel: $("#removedPanel"),
      totalCount: $("#totalCount"),
      keptCount: $("#keptCount"),
      removedCount: $("#removedCount"),
      keepWhenNoOriginal: $("#keepWhenNoOriginal"),
      caseInsensitive: $("#caseInsensitive"),
      previewRemoved: $("#previewRemoved")
    };

    let filesBuffer = [];      // Todos os File selecionados
    let kept = [];             // { file, outName, reason }
    let removed = [];          // { file, reason, originalName }

    function resetState() {
      filesBuffer = [];
      kept = [];
      removed = [];
      ui.keptList.innerHTML = "";
      ui.removedList.innerHTML = "";
      ui.totalCount.textContent = "0";
      ui.keptCount.textContent = "0";
      ui.removedCount.textContent = "0";
      ui.downloadBtn.disabled = true;
    }

    // ------------------------------
    // Upload / Drag and Drop
    // ------------------------------
    function onFilesSelected(list) {
      const all = Array.from(list || []);
      const bats = all.filter(f => /\.bat$/i.test(f.name));
      filesBuffer = bats; // sobrescreve buffer
      renderCounts();
      // feedback visual
      ui.dz.classList.remove("hover");
    }

    ui.fileInput.addEventListener("change", (e) => onFilesSelected(e.target.files));
    ui.clearBtn.addEventListener("click", () => {
      ui.fileInput.value = "";
      resetState();
    });

    ["dragenter", "dragover"].forEach(evt => {
      ui.dz.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        ui.dz.classList.add("hover");
      });
    });
    ["dragleave", "drop"].forEach(evt => {
      ui.dz.addEventListener(evt, e => {
        e.preventDefault();
        e.stopPropagation();
        ui.dz.classList.remove("hover");
      });
    });
    ui.dz.addEventListener("drop", e => {
      const items = e.dataTransfer?.files;
      if (items && items.length) onFilesSelected(items);
    });

    // ------------------------------
    // Lógica de deduplicação
    // ------------------------------
    function normalize(name, insensitive) {
      return insensitive ? name.toLowerCase() : name;
    }

    function analyze() {
      kept = [];
      removed = [];

      const insensitive = ui.caseInsensitive.checked;
      const maintainIfNoOriginal = ui.keepWhenNoOriginal.checked;

      // 1) Particionar em sem-numeração (originais) e com-numeração (cópias)
      const originals = [];
      const copies = [];
      for (const f of filesBuffer) {
        const name = f.name.trim();
        if (batCopyRegex.test(name)) copies.push(f);
        else originals.push(f);
      }

      // 2) Mapear originais por nome (normalizado)
      const nameMap = new Map(); // key -> File (primeiro encontrado)
      for (const f of originals.sort(byNameAsc)) {
        const key = normalize(f.name, insensitive);
        if (!nameMap.has(key)) nameMap.set(key, f);
        else {
          // Outro arquivo com MESMO nome sem numeração → descartar duplicata exata
          removed.push({ file: f, reason: "Duplicata de original sem numeração", originalName: nameMap.get(key).name });
        }
      }

      // 3) Manter os originais únicos
      for (const [, file] of nameMap) {
        kept.push({ file, outName: file.name, reason: "Original sem numeração" });
      }

      // 4) Tratar cópias numeradas
      for (const f of copies.sort(byNameAsc)) {
        const m = f.name.trim().match(batCopyRegex);
        const baseNoExt = m[1].trim();
        const baseName = `${baseNoExt}.bat`;
        const originalKey = normalize(baseName, insensitive);

        if (nameMap.has(originalKey)) {
          removed.push({ file: f, reason: `Cópia numerada; original presente (${baseName})`, originalName: baseName });
        } else if (maintainIfNoOriginal) {
          // Mantém a cópia, renomeando para o nome base
          kept.push({ file: f, outName: baseName, reason: "Sem original; mantida e renomeada para base" });
        } else {
          removed.push({ file: f, reason: "Cópia numerada sem original; política configurada para remover", originalName: baseName });
        }
      }

      renderLists();
      renderCounts();
      ui.downloadBtn.disabled = kept.length === 0;
    }

    function renderCounts() {
      ui.totalCount.textContent = String(filesBuffer.length);
      ui.keptCount.textContent = String(kept.length);
      ui.removedCount.textContent = String(removed.length);
      ui.removedPanel.classList.toggle("hidden", !ui.previewRemoved.checked);
    }

    function renderLists() {
      const keptHtml = kept
        .slice()
        .sort((a,b) => a.outName.localeCompare(b.outName))
        .map(k => `
          <li>
            <span><span class="badge keep">MANTIDO</span> ${escapeHtml(k.file.name)} ${k.outName !== k.file.name ? `→ <strong>${escapeHtml(k.outName)}</strong>` : ""}</span>
            <span title="${escapeHtml(k.reason)}" style="color:var(--muted)">${escapeHtml(k.reason)}</span>
          </li>`)
        .join("");
      ui.keptList.innerHTML = keptHtml || `<li><span>Nenhum arquivo mantido até o momento.</span><span></span></li>`;

      const remHtml = removed
        .slice()
        .sort((a,b) => a.file.name.localeCompare(b.file.name))
        .map(r => `
          <li>
            <span><span class="badge remove">REMOVIDO</span> ${escapeHtml(r.file.name)}</span>
            <span title="${escapeHtml(r.reason)}" style="color:var(--muted)">${escapeHtml(r.reason)}</span>
          </li>`)
        .join("");
      ui.removedList.innerHTML = remHtml || `<li><span>Nenhuma cópia detectada (ou visualização desativada).</span><span></span></li>`;
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
    }

    // ------------------------------
    // Download ZIP
    // ------------------------------
    async function downloadZip() {
      if (!kept.length) return;

      const zip = new JSZip();
      // Pastas opcionais? Aqui vamos direto para raiz do ZIP.
      // Adiciona arquivos com possível renomeação
      for (const item of kept) {
        const data = await item.file.arrayBuffer();
        // Se já existir um nome igual, incrementa um sufixo seguro para não sobrescrever
        let outName = item.outName;
        let idx = 2;
        while (zip.file(outName)) {
          const dot = outName.lastIndexOf(".");
          const base = dot >= 0 ? outName.slice(0, dot) : outName;
          const ext = dot >= 0 ? outName.slice(dot) : "";
          outName = `${base} [${idx}]${ext}`;
          idx++;
        }
        zip.file(outName, data);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `bats-originais-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.zip`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 4000);
    }

    // ------------------------------
    // Eventos de UI
    // ------------------------------
    ui.analyzeBtn.addEventListener("click", analyze);
    ui.downloadBtn.addEventListener("click", downloadZip);
    ui.previewRemoved.addEventListener("change", renderCounts);

    // Atalho: pressionar Enter na dropzone inicia análise (se houver arquivos)
    ui.dz.addEventListener("keydown", (e) => {
      if (e.key === "Enter") analyze();
    });