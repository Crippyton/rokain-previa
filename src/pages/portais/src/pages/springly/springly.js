/* ═══════════════════════════════════════════════════════════════════════
   SpringBoot Config Generator — app.js
   ═══════════════════════════════════════════════════════════════════════ */

   'use strict';

   // ── DOM helpers ──────────────────────────────────────────────────────────
   const $ = id => document.getElementById(id);
   const val = id => $(id).value.trim();
   
   // Global store for generated file contents (id → string)
   const fileContents = {};
   
   // ── Modal ────────────────────────────────────────────────────────────────
   function openModal()  { $('modal').classList.add('active'); }
   function closeModal() { $('modal').classList.remove('active'); }
   
   // Close on backdrop click
   $('modal').addEventListener('click', e => {
     if (e.target === $('modal')) closeModal();
   });
   
   // ── Copy to clipboard ────────────────────────────────────────────────────
   function doCopy(id, btn) {
     const text = fileContents[id];
     if (!text) return;
     navigator.clipboard.writeText(text).then(() => {
       btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
       btn.classList.add('copied');
       setTimeout(() => {
         btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
         btn.classList.remove('copied');
       }, 2200);
     });
   }
   
   // ── Download single file ─────────────────────────────────────────────────
   function downloadFile(fname, id) {
     const content = fileContents[id];
     if (!content) return;
     const a = document.createElement('a');
     a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
     a.download = fname;
     a.click();
   }
   
   // ── Export all files ─────────────────────────────────────────────────────
   function exportAll() {
     const entries = Object.entries(fileContents);
     if (!entries.length) { alert('Gere uma aplicação primeiro.'); return; }
     let delay = 0;
     entries.forEach(([id, content]) => {
       const nameEl = document.querySelector(`[data-file-id="${id}"] .file-name`);
       const fname = nameEl ? nameEl.textContent.replace(/^.*\s/, '') + '.txt' : id + '.txt';
       setTimeout(() => {
         const a = document.createElement('a');
         a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
         a.download = fname;
         a.click();
       }, delay);
       delay += 350;
     });
   }
   
   // ── Tab switching ────────────────────────────────────────────────────────
   function switchTab(id, btn) {
     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
     document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
     btn.classList.add('active');
     $('panel-' + id).classList.add('active');
   }
   
   // ── HTML escape ──────────────────────────────────────────────────────────
   function esc(s) {
     return String(s)
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;');
   }
   
   // ── Build a File Card ────────────────────────────────────────────────────
   /**
    * @param {string} id         - unique key for fileContents store
    * @param {string} iconClass  - CSS class for icon bg (sh / service / php / conf / log / txt)
    * @param {string} iconFa     - Font Awesome icon class(es)
    * @param {string} fname      - display filename
    * @param {string} fpath      - display path
    * @param {string} content    - file content
    */
   function makeCard(id, iconClass, iconFa, fname, fpath, content) {
     fileContents[id] = content;
     return `
     <div class="file-card" data-file-id="${id}">
       <div class="file-header">
         <div class="file-info">
           <div class="file-icon ${iconClass}"><i class="${iconFa}"></i></div>
           <div class="file-meta">
             <div class="file-name">${esc(fname)}</div>
             <div class="file-path">${esc(fpath)}</div>
           </div>
         </div>
         <div class="file-actions">
           <button class="btn-copy" id="cp-${id}" onclick="doCopy('${id}', this)">
             <i class="fa-regular fa-copy"></i> Copiar
           </button>
           <button class="btn-download" onclick="downloadFile('${esc(fname)}', '${id}')">
             <i class="fa-solid fa-download"></i> Download
           </button>
         </div>
       </div>
       <pre>${esc(content)}</pre>
     </div>`;
   }
   
   // ── Main generator ───────────────────────────────────────────────────────
   function generate() {
     // ── Read form values ───────────────────────────────────────────────
     const app        = val('f-appname');
     const context    = val('f-context');
     const port       = val('f-port');
     const javaHome   = val('f-javahome');
     const xms        = val('f-xms')        || '128m';
     const xmx        = val('f-xmx')        || '256m';
     const gc         = val('f-gc');
     const srvAct     = val('f-srv-act');
     const srvPrd1    = val('f-srv-prd1');
     const srvPrd2    = val('f-srv-prd2');
     const basePath   = val('f-basepath')   || '/tms/srvsin01/springboot';
     const cfgAct     = val('f-config-act');
     const cfgPrd     = val('f-config-prd');
     const grayAct    = val('f-gray-act');
     const grayPrd    = val('f-gray-prd');
     const profAct    = val('f-profile-act');
     const profPrd    = val('f-profile-prd');
     const vipAct     = val('f-vip-act');
     const vipPrd     = val('f-vip-prd');
     const ticket     = val('f-ticket');
   
     // ── Validation ─────────────────────────────────────────────────────
     const required = [
       [app,      'Nome da Aplicação'],
       [port,     'Porta'],
       [javaHome, 'JAVA_HOME'],
       [srvAct,   'Servidor Aceite'],
       [srvPrd1,  'Servidor Produção 1'],
       [vipAct,   'VIP Aceite'],
       [vipPrd,   'VIP Produção'],
     ];
     const missing = required.filter(([v]) => !v).map(([, l]) => l);
     if (missing.length) {
       alert('Preencha os campos obrigatórios:\n• ' + missing.join('\n• '));
       return;
     }
   
     closeModal();
   
     // ── Derived values ─────────────────────────────────────────────────
     const appPath   = `${basePath}/${app}`;
     const srvActLc  = srvAct.toLowerCase();
     const srvPrd1Lc = srvPrd1.toLowerCase();
     const gcFlag    = gc ? ` ${gc}` : '';
     const appLabel  = app.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
   
     // Clear previous contents
     Object.keys(fileContents).forEach(k => delete fileContents[k]);
   
     // ════════════════════════════════════════════════════════════════════
     // FILE TEMPLATES
     // ════════════════════════════════════════════════════════════════════
   
     // ── start.sh Aceite ───────────────────────────────────────────────
     const startAct = `#!/bin/bash
   
   export JAVA_HOME=${javaHome}
   export PATH=$JAVA_HOME/bin:$PATH
   
   JAVA_OPTS="-Xms${xms} -Xmx${xmx}${gcFlag} -Duser.timezone=America/Sao_Paulo -Duser.timezone=GMT-3 -Dspring.profiles.active=${profAct} -Dfile.encoding=UTF-8 -Dspring.cloud.config.uri=${cfgAct} -Dgraylog.host=udp:${grayAct} -Dgraylog.port=12201"
   APP_HOME=${appPath}
   APP_NAME=${app}.jar
   
   nohup java -server $JAVA_OPTS -jar $APP_HOME/$APP_NAME --server.port=${port} > $APP_HOME/console.out 2>&1 &
   sleep 2
   
   ps xa | grep java | grep $APP_HOME | grep -v grep | awk '{print $1}' > pid.txt`;
   
     // ── stop.sh (ambos ambientes) ─────────────────────────────────────
     const stopSh = `#!/bin/bash
   
   APP_HOME=${appPath}
   ps xa | grep java | grep $APP_HOME | grep -v grep | awk '{print $1}' > pid.txt
   
   if [ -f pid.txt ]; then
   
           PIDL=\`ps aux | grep $(cat pid.txt) | grep -v grep | wc -l\`
   
           if [ $PIDL != 0 ]; then
   
                   kill $(cat pid.txt)
                   echo "Parando Servidor"
                   sleep 3
   
                   PIDL=\`ps aux | grep $(cat pid.txt) | grep -v grep | wc -l\`
   
                   if [ $PIDL != 0 ]; then
                           kill -9  $(cat pid.txt)
                   fi
   
           fi
   
           rm pid.txt
   
   else
           echo "Arquivo pid.txt nao encontrado"
   fi`;
   
     // ── start.sh Produção ─────────────────────────────────────────────
     const startPrd = `#!/bin/bash
   
   export JAVA_HOME=${javaHome}
   export PATH=$JAVA_HOME/bin:$PATH
   
   JAVA_OPTS="-Xms${xms} -Xmx${xmx}${gcFlag} -Duser.timezone=America/Sao_Paulo -Duser.timezone=GMT-3 -Dspring.profiles.active=${profPrd} -Dfile.encoding=UTF-8 -Dspring.cloud.config.uri=${cfgPrd} -Dgraylog.host=udp:${grayPrd} -Dgraylog.port=12201"
   
   APP_HOME=${appPath}
   APP_NAME=${app}.jar
   
   nohup java -server $JAVA_OPTS -jar $APP_HOME/$APP_NAME --server.port=${port} > $APP_HOME/console.out 2>&1 &
   sleep 2
   
   ps xa | grep java | grep $APP_HOME | grep -v grep | awk '{print $1}' > pid.txt`;
   
     // ── systemctl .service ────────────────────────────────────────────
     const serviceFile = `[Unit]
   Description=${app}
   After=sshd.service
   
   [Service]
   Type=forking
   User=oracle
   WorkingDirectory=${appPath}
   ExecStart=${appPath}/start.sh
   ExecStop=${appPath}/stop.sh
   
   [Install]
   WantedBy=multi-user.target`;
   
     // ── Portal Logs PHP — Aceite ──────────────────────────────────────
     const logPhpAct = `<?php include("cabecalho.php"); ?>
         <!-- Jumbotron -->
         <div class="row-fluid">
           <div class="span12">
                <h1>Logs Springboot - ${appLabel}</h1>
   
               <h3>Ambiente de Aceite</h3>
               <table class="table table-striped table-hover">
                 <thead>
                   <tr>
                     <th width="28%">Tipo de Log</th>
                     <th width="28%">Descri&ccedil;&atilde;o</th>
                     <th width="44%">Link</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>Logs APP ${app}</td>
                     <td>${app} - HOST1</td>
                     <td><i class="icon-share-alt"></i>
                       <a href="http://infralogs-act.xs3.com.br/logs-Springboot-${app}-host1/">
                           http://infralogs-act.xs3.com.br/logs-Springboot-${app}-host1/
                       </a>
                     </td>
                   </tr>
                   <tr>
                     <td>Logs APP ${app}</td>
                     <td>${app} - HOST2</td>
                     <td><i class="icon-share-alt"></i>
                       <a href="http://infralogs-act.xs3.com.br/logs-Springboot-${app}-host2/">
                           http://infralogs-act.xs3.com.br/logs-Springboot-${app}-host2/
                       </a>
                     </td>
                   </tr>
                 </tbody>
               </table>
           </div>
         </div>
   <?php include("rodape.php"); ?>`;
   
     // ── Portal Logs PHP — Produção ────────────────────────────────────
     const logPhpPrd = `<?php include("cabecalho.php"); ?>
         <!-- Jumbotron -->
         <div class="row-fluid">
           <div class="span12">
                <h1>Logs Springboot - ${appLabel}</h1>
   
               <h3>Ambiente de Producao</h3>
               <table class="table table-striped table-hover">
                 <thead>
                   <tr>
                     <th width="28%">Tipo de Log</th>
                     <th width="28%">Descri&ccedil;&atilde;o</th>
                     <th width="44%">Link</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>Logs APP ${app}</td>
                     <td>${app} - HOST1</td>
                     <td><i class="icon-share-alt"></i>
                       <a href="http://infralogs-prd.xs3.com.br/logs-Springboot-${app}-host1/">
                           http://infralogs-prd.xs3.com.br/logs-Springboot-${app}-host1/
                       </a>
                     </td>
                   </tr>
                   <tr>
                     <td>Logs APP ${app}</td>
                     <td>${app} - HOST2</td>
                     <td><i class="icon-share-alt"></i>
                       <a href="http://infralogs-prd.xs3.com.br/logs-Springboot-${app}-host2/">
                           http://infralogs-prd.xs3.com.br/logs-Springboot-${app}-host2/
                       </a>
                     </td>
                   </tr>
                 </tbody>
               </table>
           </div>
         </div>
   <?php include("rodape.php"); ?>`;
   
     // ── index_logs.php entry ──────────────────────────────────────────
     const indexEntry = `<li type="square" class="arial_verde_10px style1"><a href="logs-Springboot-${app}.php" class="link_lista">Logs Springboot_${appLabel}</a></li>`;
   
     // ── httpd.conf — Aceite ───────────────────────────────────────────
     const httpdAct = `############################################################################################
   
   #${appLabel}
   Alias /logs-Springboot-${app}-host1 "/${srvActLc}${appPath}/"
   <Directory "/${srvActLc}${appPath}/">
       Options Indexes MultiViews
       AllowOverride None
       Require all granted
   </Directory>
   
   #${appLabel}
   Alias /logs-Springboot-${app}-host2 "/${srvActLc}${appPath}/"
   <Directory "/${srvActLc}${appPath}/">
       Options Indexes MultiViews
       AllowOverride None
       Require all granted
   </Directory>
   
   ############################################################################################`;
   
     // ── httpd.conf — Produção ─────────────────────────────────────────
     // host2 usa srvPrd2 quando informado; caso contrário repete srvPrd1
     const srvPrd2Lc  = srvPrd2 ? srvPrd2.toLowerCase() : srvPrd1Lc;
     const httpdPrd = `############################################################################################
   
   #${appLabel}
   Alias /logs-Springboot-${app}-host1 "/${srvPrd1Lc}${appPath}/"
   <Directory "/${srvPrd1Lc}${appPath}/">
       Options Indexes MultiViews
       AllowOverride None
       Require all granted
   </Directory>
   
   #${appLabel}
   Alias /logs-Springboot-${app}-host2 "/${srvPrd2Lc}${appPath}/"
   <Directory "/${srvPrd2Lc}${appPath}/">
       Options Indexes MultiViews
       AllowOverride None
       Require all granted
   </Directory>
   
   ############################################################################################`;
   
     // ── Logrotate ─────────────────────────────────────────────────────
     const logrotate = `${appPath}/console.out {
       daily
       rotate 3
       missingok
       notifempty
       compress
       dateext
       dateformat -%Y-%m-%d
       olddir ${appPath}/logs
       copytruncate
   }`;
   
     // ── Chamado VIP ───────────────────────────────────────────────────
     const prd2Line = srvPrd2
       ? `\nhttp://${srvPrd2}:${port}${appPath}`
       : '';
   
     const chamadoVip = `TÍTULO: Criação de VIPS para a aplicação ${app}
   
   DESCRIÇÃO:
   Prezados, por gentileza realizar a criação das seguintes vips:
   
   ACEITE:
   http://${srvAct}:${port}${appPath}
   Contexto: ${context}
   VIP: ${vipAct}
   
   PRODUÇÃO:
   http://${srvPrd1}:${port}${appPath}${prd2Line}
   Contexto: ${context}
   VIP: ${vipPrd}
   ${ticket ? '\nChamado: ' + ticket : ''}`;
   
     // ── Chamado Monitoração ───────────────────────────────────────────
     const chamadoMon = `TÍTULO: Monitoração do ${app}
   
   Aplicação: ${app}
   
   ACEITE:
     Servidor:  ${srvAct}
     Porta:     ${port}
     Instância: ${appPath}/
     VIP:       http://${vipAct}${context}
   
   PRODUÇÃO:
     Servidor:  ${srvPrd1}${srvPrd2 ? ' / ' + srvPrd2 : ''}
     Porta:     ${port}
     Instância: ${appPath}/
     VIP:       http://${vipPrd}${context}/
   ${ticket ? '\nChamado: ' + ticket : ''}`;
   
     // ── Setup commands ────────────────────────────────────────────────
     const setupCmds = `# ── 1. Criar diretório da aplicação ────────────────────────────────────
   mkdir ${appPath}
   
   # ── 2. Permissões do diretório ──────────────────────────────────────────
   chown -R oracle:oracle ${appPath} && chmod -R 775 ${appPath}
   
   # ── 3. Habilitar e recarregar o systemctl ──────────────────────────────
   systemctl enable springboot-${app}
   systemctl daemon-reload
   
   # ── 4. Criar pasta de logs ──────────────────────────────────────────────
   su oracle -c 'mkdir ${appPath}/logs && chmod 777 ${appPath}/logs'
   
   # ── 5. Permissão do console.out (após primeiro start) ──────────────────
   chmod 777 ${appPath}/console.out
   
   # ── 6. Permissão do arquivo logrotate ──────────────────────────────────
   chmod 0644 /etc/logrotate.d/springboot-${app}
   
   # ── 7. Testar configuração do logrotate ────────────────────────────────
   logrotate -d /etc/logrotate.d/springboot-${app}
   
   # ── 8. Forçar rotação ───────────────────────────────────────────────────
   logrotate -f /etc/logrotate.d/springboot-${app}
   
   # ── 9. Permissão total para portal de logs ─────────────────────────────
   chmod 777 -R ${appPath}
   
   # ── 10. Restart Apache após editar httpd.conf ──────────────────────────
   systemctl restart httpd.service`;
   
     // ════════════════════════════════════════════════════════════════════
     // RENDER — App Info Card
     // ════════════════════════════════════════════════════════════════════
   
     $('res-appname').textContent = app;
   
     const infoFields = [
       ['fa-cube',        'Aplicação',     app],
       ['fa-plug',        'Porta',         port],
       ['fa-route',       'Contexto',      context  || '—'],
       ['fa-folder-open', 'JAVA_HOME',     javaHome],
       ['fa-flask',       'Srv Aceite',    srvAct],
       ['fa-circle-check','Srv Produção',  srvPrd1 + (srvPrd2 ? ' / ' + srvPrd2 : '')],
       ['fa-folder-tree', 'APP_HOME',      appPath],
       ['fa-globe',       'VIP Aceite',    vipAct || '—'],
       ['fa-globe',       'VIP Produção',  vipPrd || '—'],
       ['fa-ticket',      'Chamado',       ticket || '—'],
     ];
   
     $('app-info-card').innerHTML = `<div class="info-grid">${
       infoFields.map(([icon, label, value]) => `
         <div class="info-item">
           <label><i class="fa-solid ${icon}"></i> ${label}</label>
           <div class="info-value">${esc(value)}</div>
         </div>`).join('')
     }</div>`;
   
     // ════════════════════════════════════════════════════════════════════
     // RENDER — Tabs
     // ════════════════════════════════════════════════════════════════════
   
     const tabs = [
       { id:'aceite',    icon:'fa-flask',          label:'Aceite' },
       { id:'producao',  icon:'fa-circle-check',   label:'Produção' },
       { id:'systemctl', icon:'fa-gear',           label:'Systemctl' },
       { id:'logs',      icon:'fa-file-code',      label:'Portal Logs' },
       { id:'apache',    icon:'fa-globe',          label:'Apache' },
       { id:'logrotate', icon:'fa-rotate',         label:'Logrotate' },
       { id:'chamados',  icon:'fa-ticket',         label:'Chamados' },
       { id:'cmds',      icon:'fa-terminal',       label:'Comandos' },
     ];
   
     $('tabs-row').innerHTML = tabs.map((t, i) =>
       `<button class="tab-btn${i === 0 ? ' active' : ''}" onclick="switchTab('${t.id}', this)">
         <i class="fa-solid ${t.icon}"></i> ${t.label}
       </button>`
     ).join('');
   
     // ════════════════════════════════════════════════════════════════════
     // RENDER — Tab Panels
     // ════════════════════════════════════════════════════════════════════
   
     const panels = {
   
       aceite: `
         <div class="panel-path"><i class="fa-solid fa-folder-open"></i> ${appPath}/</div>
         ${makeCard('act-start',  'sh',  'fa-brands fa-linux',  'start.sh — Aceite',  appPath + '/start.sh',  startAct)}
         ${makeCard('act-stop',   'sh',  'fa-solid fa-stop',    'stop.sh — Aceite',   appPath + '/stop.sh',   stopSh)}`,
   
       producao: `
         <div class="panel-path"><i class="fa-solid fa-folder-open"></i> ${appPath}/</div>
         ${makeCard('prd-start', 'sh',  'fa-brands fa-linux',  'start.sh — Produção', appPath + '/start.sh', startPrd)}
         ${makeCard('prd-stop',  'sh',  'fa-solid fa-stop',    'stop.sh — Produção',  appPath + '/stop.sh',  stopSh)}`,
   
       systemctl: `
         ${makeCard('svc', 'service', 'fa-solid fa-gear',
           `springboot-${app}.service`,
           `/etc/systemd/system/springboot-${app}.service`,
           serviceFile)}
         <div class="summary-card" style="margin-top:16px;">
           <h4><i class="fa-solid fa-terminal"></i> Comandos após criação do .service</h4>
           <div class="cmd">vim /etc/systemd/system/springboot-${app}.service</div>
           <div class="cmd">systemctl enable springboot-${app}</div>
           <div class="cmd">systemctl daemon-reload</div>
         </div>`,
   
       logs: `
         ${makeCard('log-act', 'php', 'fa-brands fa-php',
           `logs-Springboot-${app}.php — Aceite`,
           `/var/www/html/infralogs-act.xs3.com.br/logs-Springboot-${app}.php`,
           logPhpAct)}
         ${makeCard('log-prd', 'php', 'fa-brands fa-php',
           `logs-Springboot-${app}.php — Produção`,
           `/var/www/html/infralogs-prd.xs3.com.br/logs-Springboot-${app}.php`,
           logPhpPrd)}
         ${makeCard('log-idx', 'txt', 'fa-solid fa-list',
           'Entrada index_logs.php',
           '/var/www/html/infralogs-xxx.xs3.com.br/index_logs.php',
           indexEntry)}`,
   
       apache: `
         ${makeCard('httpd-act', 'conf', 'fa-solid fa-server',
           'httpd.conf — Aceite',
           '/etc/httpd/conf/httpd.conf',
           httpdAct)}
         ${makeCard('httpd-prd', 'conf', 'fa-solid fa-server',
           'httpd.conf — Produção',
           '/etc/httpd/conf/httpd.conf',
           httpdPrd)}
         <div class="summary-card" style="margin-top:14px;">
           <h4><i class="fa-solid fa-rotate"></i> Restart Apache após editar</h4>
           <div class="cmd">systemctl restart httpd.service</div>
         </div>`,
   
       logrotate: `
         ${makeCard('logr', 'log', 'fa-solid fa-rotate',
           `springboot-${app}`,
           `/etc/logrotate.d/springboot-${app}`,
           logrotate)}
         <div class="summary-grid">
           <div class="summary-card">
             <h4><i class="fa-solid fa-lock"></i> Permissão do arquivo</h4>
             <div class="cmd">chmod 0644 /etc/logrotate.d/springboot-${app}</div>
           </div>
           <div class="summary-card">
             <h4><i class="fa-solid fa-flask"></i> Testar</h4>
             <div class="cmd">logrotate -d /etc/logrotate.d/springboot-${app}</div>
           </div>
           <div class="summary-card">
             <h4><i class="fa-solid fa-bolt"></i> Forçar rotação</h4>
             <div class="cmd">logrotate -f /etc/logrotate.d/springboot-${app}</div>
           </div>
           <div class="summary-card">
             <h4><i class="fa-solid fa-unlock"></i> Permissão para portal</h4>
             <div class="cmd">chmod 777 -R ${appPath}</div>
           </div>
         </div>`,
   
       chamados: `
         ${makeCard('ch-vip', 'txt', 'fa-solid fa-globe',
           'Chamado — Criação de VIP',
           'Jira / Helpdesk',
           chamadoVip)}
         ${makeCard('ch-mon', 'txt', 'fa-solid fa-satellite-dish',
           'Chamado — Monitoração',
           'Jira / Helpdesk',
           chamadoMon)}`,
   
       cmds: `
         ${makeCard('cmds-sh', 'sh', 'fa-solid fa-terminal',
           'setup-commands.sh',
           'Sequência completa de setup',
           setupCmds)}
         <div class="summary-card" style="margin-top:16px;">
           <h4><i class="fa-solid fa-table-list"></i> Tabela de Permissões Finais</h4>
           ${[
             [`/${app}`,                        basePath,                        'oracle', '755'],
             ['console.out',                    appPath,                         'oracle', '777'],
             ['/logs',                          appPath,                         'oracle', '777'],
             ['pid.txt',                        appPath,                         'oracle', '644'],
             [`${app}.jar`,                     appPath,                         'oracle', '755'],
             ['start.sh',                       appPath,                         'oracle', '755'],
             ['stop.sh',                        appPath,                         'oracle', '755'],
             [`springboot-${app}.service`,      '/etc/systemd/system',           'root',   '640'],
             [`logs-Springboot-${app}.php`,     '/var/www/html/infralogs-xxx',   'apache', '777'],
             [`springboot-${app}`,              '/etc/logrotate.d',              'root',   '644'],
           ].map(([f, d, g, p]) =>
             `<div class="cmd" style="margin-top:6px;">
               <i class="fa-solid fa-lock fa-xs" style="color:var(--text3)"></i>
               <strong style="color:var(--yellow)">${p}</strong>
               &nbsp;<span style="color:var(--text3)">${g}</span>
               &nbsp;${esc(d)}/<strong style="color:var(--text)">${esc(f)}</strong>
             </div>`
           ).join('')}
         </div>`,
     };
   
     $('tab-panels').innerHTML = Object.entries(panels).map(([id, html]) =>
       `<div class="tab-panel${id === 'aceite' ? ' active' : ''}" id="panel-${id}">${html}</div>`
     ).join('');
   
     // Show results and scroll
     $('results-section').style.display = 'block';
     $('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
   }
   
   /* ── Custom alert: chamado pelo script.js via showAlert(missingArray) ── */
     function showAlert(missingFields) {
       const icons = {
         'Nome da Aplicação':   'fa-tag',
         'Porta':               'fa-plug',
         'JAVA_HOME':           'fa-folder-open',
         'Servidor Aceite':     'fa-flask',
         'Servidor Produção 1': 'fa-circle-check',
         'VIP Aceite':          'fa-globe',
         'VIP Produção':        'fa-globe',
       };
       document.getElementById('alert-fields').innerHTML = missingFields.map(f => `
         <div class="alert-field-item">
           <i class="fa-solid ${icons[f] || 'fa-circle-dot'}"></i>${f}
         </div>`).join('');
       document.getElementById('alert-overlay').classList.add('active');
     }
   
     function closeAlert() {
       document.getElementById('alert-overlay').classList.remove('active');
     }
   
     /* Close on backdrop click */
     document.getElementById('alert-overlay').addEventListener('click', function(e) {
       if (e.target === this) closeAlert();
     });