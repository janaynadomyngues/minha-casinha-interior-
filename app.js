import { gerarDevocional, getTema } from './ai.js';
import { storage } from './storage.js';

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const PETALS = ["🌸","🌺","✨","🌷","💫","🌼","💕"];

const today = new Date();
const todayISO = today.toISOString().split('T')[0];
const dateStr = `${DAYS[today.getDay()]}, ${today.getDate()} de ${MONTHS[today.getMonth()]}`;

let S = {
  screen: 'home', page: 0,
  devo: null, loading: false, error: false,
  isFav: storage.isFav(todayISO),
  favs: storage.getFavs(),
  hist: storage.getHist(),
  notifTime: storage.getNotif(),
  notifOn: false,
  toast: null,
};

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
  render();
  const cached = storage.getCached(todayISO);
  if (cached) { S.devo = cached; storage.addHist(cached, todayISO); S.hist = storage.getHist(); render(); return; }
  S.loading = true; render();
  try {
    const d = await gerarDevocional(today);
    S.devo = d; S.loading = false;
    storage.setCached(todayISO, d);
    storage.addHist(d, todayISO);
    S.hist = storage.getHist();
  } catch { S.loading = false; S.error = true; }
  render();
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function go(screen) { S.screen=screen; S.page=0; render(); }
function nextPage() { if(S.page<4){S.page++; render();} }
function prevPage() { if(S.page>0){S.page--; render();} }
function retry() { S.error=false; S.loading=false; init(); }

// ── Actions ───────────────────────────────────────────────────────────────────
function toggleFav() {
  if(S.isFav){ storage.removeFav(todayISO); S.isFav=false; toast('Removido dos favoritos'); }
  else { storage.saveFav(S.devo, todayISO); S.isFav=true; toast('Salvo nos favoritos 🌸'); }
  S.favs=storage.getFavs(); render();
}
async function share() {
  const d=S.devo; if(!d) return;
  const text=`🌸 *${d.palavra}* — ${dateStr}\n\n"${d.versiculo}"\n— ${d.referencia}\n\n${d.climax}\n\n@minhacasinhainterior\n#Florescendo`;
  if(navigator.share){ try{await navigator.share({title:'Florescendo',text});}catch{} }
  else if(navigator.clipboard){ await navigator.clipboard.writeText(text); toast('Copiado! ✨'); }
}
async function reqNotif() {
  if(!('Notification' in window)){toast('Seu navegador não suporta notificações');return;}
  const p=await Notification.requestPermission();
  if(p==='granted'){S.notifOn=true; schedNotif(); toast('Notificações ativadas! 🌸');}
  else toast('Permissão negada. Verifique as configurações.');
  render();
}
function schedNotif() {
  const [h,m]=S.notifTime.split(':').map(Number);
  const now=new Date(), next=new Date();
  next.setHours(h,m,0,0); if(next<=now) next.setDate(next.getDate()+1);
  setTimeout(()=>{ if(Notification.permission==='granted') new Notification('Florescendo 🌸',{body:'Sua palavra de hoje está esperando, florzinha 💕',icon:'/icon-192.png'}); schedNotif(); }, next-now);
}
function toast(msg){ S.toast=msg; render(); setTimeout(()=>{S.toast=null;render();},2500); }
function fmtDate(iso){ const[y,m,d]=iso.split('-'); return`${d}/${m}/${y}`; }

// ── Floating petals background ────────────────────────────────────────────────
function petalsHTML(dark=false) {
  return PETALS.map((p,i)=>`
    <span style="position:fixed;font-size:${[18,22,14,20,16,24,18][i]}px;opacity:${dark?0.12:0.13};
      top:${[10,30,60,80,20,70,45][i]}%;left:${[5,88,15,75,50,92,35][i]}%;
      animation:petal${i} ${[8,10,7,9,11,6,9][i]}s ease-in-out infinite;
      animation-delay:${i*1.2}s;pointer-events:none;z-index:0">${p}</span>`).join('');
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function renderHome() {
  return `
  <div class="screen" style="background:linear-gradient(160deg,#fdf6f0 0%,#fce8d8 45%,#f5d5e8 100%)">
    <div class="band"></div>
    ${petalsHTML()}
    <div class="z1" style="text-align:center;padding:20px 24px 4px">
      <div class="brand">Florescendo</div>
      <div class="subbrand">Seu devocional diário para florescer com fé</div>
    </div>
    <div class="z1 home-hero">
      ${S.loading ? `
        <div style="text-align:center">
          <div style="font-size:52px;margin-bottom:16px;animation:pulse 1.5s ease-in-out infinite">🌸</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:#9b4d72;margin-bottom:8px">Preparando sua palavra...</div>
          <div style="font-size:13px;color:#b8957e;line-height:1.6">A IA está escrevendo especialmente<br>para você, florzinha 💕</div>
        </div>` :
      S.error ? `
        <div style="text-align:center">
          <div style="font-size:44px;margin-bottom:12px">🙏</div>
          <p style="color:#9b4d72;margin-bottom:20px;font-size:14px;line-height:1.6">Não consegui carregar o devocional.<br>Verifique sua internet.</p>
          <button class="btn-main" onclick="retry()" style="background:linear-gradient(135deg,#9b4d72,#c4836a)">Tentar novamente 🌸</button>
        </div>` : `
        <div style="font-size:58px;animation:float 3s ease-in-out infinite;margin-bottom:12px">🌸</div>
        <div style="font-size:10px;letter-spacing:3px;color:#c4836a;text-transform:uppercase;margin-bottom:6px">A palavra de hoje</div>
        <h1 class="hero-p" style="background:linear-gradient(135deg,#9b4d72,#c4836a,#e8a87c);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${S.devo?.palavra||'...'}</h1>
        <div style="font-size:12px;color:#9b7a6a;letter-spacing:1px;margin-bottom:4px">${getTema(today)}</div>
        <div style="font-size:11px;color:#b8957e;margin-bottom:20px">${dateStr}</div>
        <div style="width:44px;height:2px;background:linear-gradient(90deg,#e8a4c4,#f4b896);border-radius:2px;margin:0 auto 24px;opacity:.7"></div>
        <button class="btn-main" onclick="go('devo')" style="background:linear-gradient(135deg,#9b4d72,#c4836a)">Abrir devocional de hoje 🌸</button>`}
    </div>
    ${bottomNav('home')}
  </div>`;
}

// ── DEVOCIONAL (5 páginas, 2 blocos cada) ─────────────────────────────────────
function renderDevo() {
  if(!S.devo){go('home');return'';}
  const d=S.devo;
  const p=S.page;

  // Cores por página
  const bgs = [
    'linear-gradient(160deg,#fdf6f0,#fce8d8,#f5d5e8)',
    'linear-gradient(160deg,#f8f0fd,#ede0f8,#f5d5e8)',
    'linear-gradient(160deg,#fff8e8,#fce8c8,#f5e0d0)',
    'linear-gradient(160deg,#f0f8f4,#e0f0e8,#d8ece0)',
    'linear-gradient(135deg,#9b4d72,#c4836a,#e8a87c)',
  ];
  const isDark = p===4;
  const txtColor = isDark ? 'white' : '#5a3a2a';
  const lblColor = isDark ? 'rgba(255,255,255,0.75)' : '#9b4d72';

  const dots = [0,1,2,3,4].map(i=>`<div class="dot${i===p?' dot-on':''}" ${i===p&&!isDark?`style="background:#9b4d72"`:''}></div>`).join('');

  // Cada página tem 2 blocos
  let block1='', block2='';

  if(p===0){
    // Capa + Versículo
    block1=`
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:52px;animation:float 3s ease-in-out infinite;margin-bottom:8px">🌸</div>
        <div style="font-size:9px;letter-spacing:3px;color:#c4836a;text-transform:uppercase;margin-bottom:4px">A palavra de hoje</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;background:linear-gradient(135deg,#9b4d72,#c4836a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px">${d.palavra}</div>
        <div style="font-size:11px;color:#9b7a6a;margin-top:4px">${d.tema}</div>
      </div>`;
    block2=`
      <div class="card">
        <div class="lbl" style="color:#9b4d72">📖 Versículo do dia</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:17px;font-style:italic;line-height:1.75;color:#3a2050;margin-bottom:10px">"${d.versiculo}"</p>
        <div style="font-size:12px;font-weight:600;text-align:right;color:#9b4d72">— ${d.referencia}</div>
      </div>`;
  } else if(p===1){
    // Frase central + Reflexão
    block1=`
      <div class="card" style="background:rgba(155,77,114,0.07);border-color:rgba(155,77,114,0.2);text-align:center;margin-bottom:14px">
        <div class="lbl" style="color:#9b4d72">✨ A verdade de hoje</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;font-style:italic;line-height:1.55;color:#7a3f5a">${d.frase_central}</p>
      </div>`;
    block2=`
      <div class="card">
        <div class="lbl" style="color:#c4836a">🌷 Reflexão</div>
        <p style="font-size:14px;line-height:1.85;color:#4a3030">${d.reflexao}</p>
      </div>`;
  } else if(p===2){
    // Pergunta + Verdade bíblica
    block1=`
      <div class="card" style="background:rgba(232,168,124,0.1);border-color:rgba(196,131,106,0.25);text-align:center;margin-bottom:14px">
        <div class="lbl" style="color:#c4836a">🔥 Uma pergunta para você</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:20px;line-height:1.55;color:#7a5a20">${d.pergunta}</p>
      </div>`;
    block2=`
      <div class="card">
        <div class="lbl" style="color:#9b4d72">📖 O que Deus diz sobre você</div>
        <p style="font-size:14px;line-height:1.85;color:#4a3030">${d.verdade}</p>
      </div>`;
  } else if(p===3){
    // Virada + Aplicação
    block1=`
      <div class="card" style="border-color:rgba(74,138,90,0.25);margin-bottom:14px">
        <div class="lbl" style="color:#4a8a5a">🌅 A virada</div>
        <p style="font-size:14px;line-height:1.85;color:#2a4a32;margin-bottom:12px">${d.virada}</p>
        <p style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:#4a8a5a;font-weight:600">${d.climax}</p>
      </div>`;
    const items = Array.isArray(d.aplicacao) ? d.aplicacao : [d.aplicacao];
    block2=`
      <div class="card">
        <div class="lbl" style="color:#4a8a5a">🎯 Para hoje</div>
        ${items.map((a,i)=>`<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;font-size:13px;color:#2a4a32;line-height:1.6">
          <span style="background:linear-gradient(135deg,#4a8a5a,#7ab07a);color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px">${i+1}</span>
          <span>${a}</span></div>`).join('')}
      </div>`;
  } else if(p===4){
    // Clímax + Oração (dark)
    block1=`
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:44px;animation:pulse 2s ease-in-out infinite;margin-bottom:12px">✨</div>
        <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:12px">Declare hoje</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;line-height:1.55;color:white;text-shadow:0 2px 12px rgba(0,0,0,0.15)">${d.climax}</p>
      </div>`;
    block2=`
      <div style="background:rgba(255,255,255,0.15);border-radius:20px;padding:18px 20px;border:1px solid rgba(255,255,255,0.25)">
        <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:12px">🙏 Oração</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;line-height:1.75;color:white;margin-bottom:16px">${d.oracao}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn-ghost" onclick="toggleFav()">${S.isFav?'❤️ Salvo':'🤍 Salvar'}</button>
          <button class="btn-ghost" onclick="share()">📤 Compartilhar</button>
        </div>
      </div>`;
  }

  const btnLabels = ['Continuar 🌸','Aprofundar →','Continuar →','A virada →',''];

  return `
  <div class="screen" style="background:${bgs[p]};transition:background 0.5s">
    <div class="band"></div>
    ${petalsHTML(isDark)}
    <div class="z1 devo-bar">
      <button class="icon-btn${isDark?' white':''}" onclick="go('home')">←</button>
      <div class="dots-row">${dots}</div>
      <button class="icon-btn${isDark?' white':''}" onclick="toggleFav()">${S.isFav?'❤️':'🤍'}</button>
    </div>
    <div class="z1 devo-body fade-up">${block1}${block2}</div>
    <div class="z1 devo-nav">
      ${p>0?`<button class="btn-back${isDark?' btn-back-white':''}" onclick="prevPage()">← Voltar</button>`:''}
      ${p<4?`<button class="btn-main" onclick="nextPage()" style="background:linear-gradient(135deg,#9b4d72,#c4836a);flex:1">${btnLabels[p]}</button>`:''}
      ${p===4?`<button class="btn-main" onclick="go('home')" style="background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.5);flex:1">Voltar ao início 🌷</button>`:''}
    </div>
  </div>`;
}

// ── FAVORITOS ─────────────────────────────────────────────────────────────────
function renderFavs() {
  const favs=S.favs;
  return `
  <div class="screen list-screen" style="background:linear-gradient(160deg,#fdf6f0,#fce8d8)">
    <div class="band"></div>
    <div class="list-hdr"><button class="icon-btn" onclick="go('home')">←</button><h2 class="list-title">Favoritos</h2><div style="width:40px"></div></div>
    <div class="list-body">
      ${favs.length===0?`<div class="empty"><div style="font-size:48px;margin-bottom:12px">🤍</div><p>Nenhum favorito ainda.</p><p style="font-size:12px;margin-top:8px;opacity:.7">No final do devocional, toque em "Salvar".</p></div>`
      :favs.map(f=>`
        <div class="list-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <div><div class="list-p">${f.palavra}</div><div class="list-d">${f.tema||''} · ${fmtDate(f.date)}</div></div>
            <button class="icon-btn sm" onclick="rmFav('${f.date}')">🗑</button>
          </div>
          ${f.versiculo?`<p style="font-size:12px;color:#5a3a2a;line-height:1.6;font-style:italic;margin-bottom:6px">"${f.versiculo}"</p>`:''}
          ${f.referencia?`<div style="font-size:11px;color:#9b4d72;font-weight:600">— ${f.referencia}</div>`:''}
        </div>`).join('')}
    </div>
    ${bottomNav('favs')}
  </div>`;
}

// ── HISTÓRICO ─────────────────────────────────────────────────────────────────
function renderHist() {
  const hist=S.hist;
  return `
  <div class="screen list-screen" style="background:linear-gradient(160deg,#f0f8f4,#e8f4ec)">
    <div class="band"></div>
    <div class="list-hdr"><button class="icon-btn" onclick="go('home')">←</button><h2 class="list-title">Histórico</h2><div style="width:40px"></div></div>
    <div class="list-body">
      ${hist.length===0?`<div class="empty"><div style="font-size:48px;margin-bottom:12px">📖</div><p>Nenhuma leitura ainda.</p></div>`
      :hist.map(h=>`
        <div class="list-card" style="display:flex;align-items:center;gap:14px">
          <div style="width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#9b4d72,#c4836a);flex-shrink:0"></div>
          <div><div class="list-p">${h.palavra}</div><div class="list-d">${h.tema||''}</div><div style="font-size:10px;color:#9b4d72;margin-top:2px">${fmtDate(h.date)}</div></div>
        </div>`).join('')}
    </div>
    ${bottomNav('hist')}
  </div>`;
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
function renderConfig() {
  return `
  <div class="screen list-screen" style="background:linear-gradient(160deg,#fdf6f0,#f5d5e8)">
    <div class="band"></div>
    <div class="list-hdr"><button class="icon-btn" onclick="go('home')">←</button><h2 class="list-title">Configurações</h2><div style="width:40px"></div></div>
    <div class="list-body">
      <div class="cfg-card">
        <div class="cfg-title">🔔 Lembrete Diário</div>
        <p class="cfg-desc">Receba um lembrete toda manhã para abrir seu devocional 🌸</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:14px;color:#5a3a2a">Horário</span>
          <input type="time" style="border:1.5px solid rgba(155,77,114,0.3);border-radius:10px;padding:7px 12px;font-size:14px;color:#7a3f5a;background:white;outline:none" value="${S.notifTime}" onchange="updNotif(this.value)" />
        </div>
        <button class="btn-main" onclick="reqNotif()" style="background:linear-gradient(135deg,#9b4d72,#c4836a);width:100%;padding:12px">
          ${S.notifOn?'✅ Notificações ativas':'🔔 Ativar notificações'}
        </button>
      </div>
      <div class="cfg-card">
        <div class="cfg-title">📲 Instalar no celular</div>
        <p class="cfg-desc">Salve na tela inicial para acessar como um app:</p>
        <div style="font-size:13px;color:#5a3a2a;display:flex;gap:8px;margin-bottom:8px"><span style="color:#9b4d72;font-weight:600">1.</span> Toque no botão compartilhar do navegador</div>
        <div style="font-size:13px;color:#5a3a2a;display:flex;gap:8px;margin-bottom:8px"><span style="color:#9b4d72;font-weight:600">2.</span> Selecione "Adicionar à Tela de Início"</div>
        <div style="font-size:13px;color:#5a3a2a;display:flex;gap:8px"><span style="color:#9b4d72;font-weight:600">3.</span> Confirme e pronto! 🌸</div>
      </div>
      <div class="cfg-card">
        <div class="cfg-title">💕 Sobre</div>
        <p class="cfg-desc">Feito com amor por <strong>@minhacasinhainterior</strong> para cada florzinha que quer florescer com fé todos os dias.</p>
      </div>
    </div>
    ${bottomNav('config')}
  </div>`;
}

function bottomNav(active) {
  const items=[{id:'home',icon:'🏠',lbl:'Início'},{id:'favs',icon:'🤍',lbl:'Favoritos'},{id:'hist',icon:'📖',lbl:'Histórico'},{id:'config',icon:'⚙️',lbl:'Config.'}];
  return `<nav class="bottom-nav">${items.map(i=>`<button class="nav-btn${i.id===active?' nav-on':''}" onclick="go('${i.id}')"><span style="font-size:20px">${i.icon}</span><span>${i.lbl}</span></button>`).join('')}</nav>`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const app=document.getElementById('app');
  let html='';
  if(S.screen==='home') html=renderHome();
  else if(S.screen==='devo') html=renderDevo();
  else if(S.screen==='favs') html=renderFavs();
  else if(S.screen==='hist') html=renderHist();
  else if(S.screen==='config') html=renderConfig();
  if(S.toast) html+=`<div class="toast">${S.toast}</div>`;
  app.innerHTML=html;
}

// ── Globals ───────────────────────────────────────────────────────────────────
window.go=go; window.nextPage=nextPage; window.prevPage=prevPage;
window.toggleFav=toggleFav; window.share=share;
window.reqNotif=reqNotif; window.retry=retry;
window.updNotif=(t)=>{ S.notifTime=t; storage.setNotif(t); if(S.notifOn){schedNotif();toast('Horário atualizado! ✨');} render(); };
window.rmFav=(date)=>{ storage.removeFav(date); if(date===todayISO)S.isFav=false; S.favs=storage.getFavs(); render(); };

init();
