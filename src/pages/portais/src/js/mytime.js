const pad = n => String(n).padStart(2,'0');
    const fmtHMS = ms => { if (ms<0) ms=0; const s=Math.floor(ms/1000); const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const sec=s%60; return `${pad(h)}:${pad(m)}:${pad(sec)}`; };

    const tzSel = document.getElementById('tz');
    const startEl = document.getElementById('startTime');
    const elapsedEl = document.getElementById('elapsed');
    const elapsedErr = document.getElementById('elapsedErr');
    const workH = document.getElementById('workHours');
    const lunchM = document.getElementById('lunchMinutes');
    const outStart = document.getElementById('outStart');
    const outEnd = document.getElementById('outEnd');
    const outWorked = document.getElementById('outWorked');
    const outRemaining = document.getElementById('outRemaining');
    const bar = document.getElementById('bar');
    const note = document.getElementById('note');
    const autoUpdate = document.getElementById('autoUpdate');
    const modeStart = document.getElementById('modeStart');
    const modeElapsed = document.getElementById('modeElapsed');

    function populateTZ(){
      try{
        const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const zones=[currentTZ,'America/Sao_Paulo','UTC'];
        [...new Set(zones)].forEach(z=>{const o=document.createElement('option');o.value=z;o.textContent=z;tzSel.appendChild(o)});
        tzSel.value=currentTZ;
      }catch(e){const o=document.createElement('option');o.value='America/Sao_Paulo';o.textContent='America/Sao_Paulo';tzSel.appendChild(o)}
    }

    function parseStart(){
      const v = startEl.value; if(!v) return null; const [hh,mm,ss='0']=v.split(':'); if([hh,mm,ss].some(x=>x===undefined||x==='')) return null;
      const now=new Date(); return new Date(now.getFullYear(),now.getMonth(),now.getDate(),Number(hh),Number(mm),Number(ss));
    }

    function parseElapsed(text){
      if(!text) return null; const parts = text.trim().split(':');
      let h=0,m=0,s=0; if(parts.length===2){[h,m]=parts.map(Number);} else if(parts.length===3){[h,m,s]=parts.map(Number);} else {return null}
      if([h,m,s].some(x=>Number.isNaN(x)||x<0)) return null; if(m>=60||s>=60) return null; return ((h*60+m)*60+s)*1000; // ms
    }

    function formatTime(date,tz){
      try{return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:tz}).format(date);}catch(e){return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`}
    }

    function calculate(){
      const tz = tzSel.value || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const wh = Math.max(1, Number(workH.value||8));
      const lm = Math.max(0, Number(lunchM.value||60));
      const totalMs = (wh*3600+lm*60)*1000;

      let start=null; let workedMs=0; elapsedErr.style.display='none'; elapsedErr.textContent='';

      if(modeElapsed.checked){
        const ms = parseElapsed(elapsedEl.value);
        if(ms==null){
          elapsedErr.textContent = 'Formato inválido. Use HH:MM ou HH:MM:SS (min e seg até 59).';
          elapsedErr.style.display='block';
        } else {
          const now = new Date();
          start = new Date(now.getTime() - ms);
          // Atualiza o campo startTime para o usuário ver a hora calculada
          startEl.value = `${pad(start.getHours())}:${pad(start.getMinutes())}:${pad(start.getSeconds())}`;
          workedMs = ms;
        }
      } else {
        start = parseStart();
        if(start){ workedMs = Math.max(0, Date.now() - start.getTime()); }
      }

      if(!start){
        outStart.textContent='--:--:--'; outEnd.textContent='--:--:--'; outWorked.textContent='--:--:--'; outRemaining.textContent='--:--:--'; bar.style.width='0%'; note.textContent='Informe hora de início ou tempo trabalhado.'; return;
      }

      const end = new Date(start.getTime() + totalMs);
      const now = new Date();
      if(modeElapsed.checked){ workedMs = Math.max(0, now.getTime() - start.getTime()); }
      const remainingMs = Math.max(0, end - now);
      const progress = Math.min(100, Math.max(0, (workedMs/totalMs)*100));

      outStart.textContent = formatTime(start, tz);
      outEnd.textContent = formatTime(end, tz);
      outWorked.textContent = fmtHMS(workedMs);
      outRemaining.textContent = fmtHMS(remainingMs);
      bar.style.width = progress.toFixed(2)+'%';
      if(remainingMs===0){ note.innerHTML='<span class="danger">Jornada concluída. Boa saída! ✔</span>'; } else { note.textContent=`Faltam aproximadamente ${(remainingMs/3600000).toFixed(2)} horas.`; }

      saveState();
    }

    function toggleMode(){
      document.getElementById('blockStart').style.display = modeStart.checked? 'block':'none';
      document.getElementById('blockElapsed').style.display = modeElapsed.checked? 'block':'none';
      calculate();
    }

    function saveState(){
      const state={ mode: modeElapsed.checked? 'elapsed':'start', start:startEl.value, elapsed:elapsedEl.value, wh:workH.value, lm:lunchM.value, tz:tzSel.value };
      try{ localStorage.setItem('workCalcState', JSON.stringify(state)); }catch(e){}
    }
    function loadState(){
      try{
        const s = JSON.parse(localStorage.getItem('workCalcState')||'null'); if(!s) return;
        if(s.mode==='elapsed'){ modeElapsed.checked=true; } else { modeStart.checked=true; }
        startEl.value = s.start||''; elapsedEl.value = s.elapsed||''; workH.value=s.wh||8; lunchM.value=s.lm||60; if(s.tz) tzSel.value=s.tz;
        toggleMode();
      }catch(e){}
    }

    document.getElementById('btnNow').addEventListener('click',()=>{
      const now = new Date();
      if(modeElapsed.checked){
        // no modo elapsed, apenas recalcular com base na hora atual
        calculate();
      } else {
        startEl.value=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`; calculate();
      }
    });

    document.getElementById('btnCalc').addEventListener('click', calculate);

    modeStart.addEventListener('change', toggleMode);
    modeElapsed.addEventListener('change', toggleMode);

    let timer=null; const auto=document.getElementById('autoUpdate');
    function startAuto(){ stopAuto(); timer=setInterval(calculate,1000); }
    function stopAuto(){ if(timer){clearInterval(timer); timer=null;} }
    auto.addEventListener('change',()=>{ if(auto.checked) startAuto(); else stopAuto(); });

    (function init(){ populateTZ(); loadState(); calculate(); if(document.getElementById('autoUpdate').checked) startAuto(); })();