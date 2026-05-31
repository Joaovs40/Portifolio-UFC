// ─── BOOT ───
const bootLines  = document.getElementById('bootLines');
const bootBar    = document.getElementById('bootBar');
const bootStatus = document.getElementById('bootStatus');
const bootScreen = document.getElementById('boot-screen');

const msgs = [
  { text: '[ OK ] jsales-os v2.0 iniciando...', cls: 'ok',   delay: 0 },
  { text: '[ OK ] Módulos carregados',           cls: 'ok',   delay: 200 },
  { text: '[ WARN ] Nível de café: crítico',     cls: 'warn', delay: 380 },
  { text: '[ OK ] Projetos: 3 encontrados',      cls: 'ok',   delay: 540 },
  { text: '[ OK ] Terminal pronto. CTRL+K',      cls: 'ok',   delay: 700 },
  { text: '[ OK ] Sistema pronto.',              cls: 'ok',   delay: 860 },
];

let pct = 0;
const bi = setInterval(() => { pct = Math.min(pct + 2.5, 100); bootBar.style.width = pct + '%'; if (pct >= 100) clearInterval(bi); }, 18);
msgs.forEach(({ text, cls, delay }) => setTimeout(() => { const s = document.createElement('span'); s.className = 't-line ' + cls; s.textContent = text; bootLines.appendChild(s); }, delay));

setTimeout(() => {
  bootScreen.classList.add('hidden');
  setTimeout(() => { bootScreen.style.display = 'none'; initTyping(); initCounters(); }, 600);
}, 1200);

// ─── TYPING ───
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['Front-end Dev', 'Estagiário TI', 'Analista Suporte Jr.', 'Sempre aprendendo'];
  let pi = 0, ci = 0, del = false;
  function tick() {
    const p = phrases[pi];
    if (del) { ci--; el.textContent = p.slice(0, ci); if (ci === 0) { del = false; pi = (pi+1) % phrases.length; setTimeout(tick, 400); return; } setTimeout(tick, 40); }
    else { ci++; el.textContent = p.slice(0, ci); if (ci === p.length) { del = true; setTimeout(tick, 2000); return; } setTimeout(tick, 90); }
  }
  setTimeout(tick, 300);
}

// ─── COUNTERS ───
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let n = 0;
    const iv = setInterval(() => { n = Math.min(n+1, target); el.textContent = n; if (n >= target) clearInterval(iv); }, 100);
  });
}

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
(function animRing() { rx += (mx-rx)*.1; ry += (my-ry)*.1; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animRing); })();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='16px'; cursor.style.height='16px'; ring.style.width='44px'; ring.style.height='44px'; ring.style.opacity='.75'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='7px';  cursor.style.height='7px';  ring.style.width='28px'; ring.style.height='28px'; ring.style.opacity='.5';  });
});

// ─── FADE IN ───
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// ─── ACTIVE NAV ───
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#'+cur); });
});

// ─── MOBILE MENU ───
const ham = document.getElementById('hamburger');
const mob = document.getElementById('navMobile');
ham.addEventListener('click', () => { ham.classList.toggle('open'); mob.classList.toggle('open'); });
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { ham.classList.remove('open'); mob.classList.remove('open'); }));

// ─── TERMINAL ───
const termOverlay = document.getElementById('terminal-overlay');
const termBody    = document.getElementById('termBody');
const termInput   = document.getElementById('termInput');
let termOpen = false;

const cmds = {
  help: `<span class="t-highlight">Comandos:</span>
whoami   — sobre mim
skills   — habilidades
projetos — projetos
contato  — contatos
github   — abre GitHub
clear    — limpa
exit     — fecha`,
  whoami:   `<span class="t-green">João Pedro Vasques de Sales</span>\nADS · Claretiano | Front-end Dev\nRio Claro — SP — Brasil`,
  skills:   `HTML5 · CSS3 · JavaScript · React\nNode.js · Git · GitHub · SAP/ERP\nIA Generativa · Vite · A11y`,
  projetos: `01 · FinançasBot WhatsApp  <span class="t-green">✓</span>\n02 · Portfólio Pessoal     <span class="t-green">✓</span>\n03 · Sistema RafaelMuller  <span class="t-highlight">⟳ em dev</span>`,
  contato:  `✉  joaovs40.jp@gmail.com\n☎  (19) 99322-9350\nin linkedin.com/in/joaosalesdev\ngh github.com/Joaovs40`,
  github:   `<span class="t-green">Abrindo GitHub...</span>`,
  clear:    '__clear__',
  exit:     '__exit__',
};

function tprint(html) { const d = document.createElement('div'); d.className = 't-line t-out'; d.innerHTML = html; termBody.appendChild(d); termBody.scrollTop = termBody.scrollHeight; }
function tcmd(c)      { const d = document.createElement('div'); d.className = 't-line t-cmd'; d.textContent = 'jsales@portfolio:~$ '+c; termBody.appendChild(d); }

function openTerm() {
  if (termOpen) return; termOpen = true;
  termOverlay.classList.add('open');
  tprint('<span class="t-green">jsales-os v2.0</span> — digite <span class="t-highlight">help</span>');
  setTimeout(() => termInput.focus(), 80);
}
function closeTerm() { termOpen = false; termOverlay.classList.remove('open'); }

document.addEventListener('keydown', e => {
  if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); termOpen ? closeTerm() : openTerm(); }
  if (e.key==='Escape' && termOpen) closeTerm();
});
termInput.addEventListener('keydown', e => {
  if (e.key!=='Enter') return;
  const c = termInput.value.trim().toLowerCase(); termInput.value = '';
  if (!c) return; tcmd(c);
  if (c in cmds) {
    const r = cmds[c];
    if (r==='__clear__') termBody.innerHTML='';
    else if (r==='__exit__') closeTerm();
    else { tprint(r); if (c==='github') setTimeout(()=>window.open('https://github.com/Joaovs40','_blank'),500); }
  } else tprint(`<span class="t-red">Não encontrado: ${c}</span> · tente <span class="t-highlight">help</span>`);
});
termOverlay.addEventListener('click', e => { if (e.target===termOverlay) closeTerm(); });
document.getElementById('termClose').addEventListener('click', closeTerm);
document.getElementById('termBtn').addEventListener('click', () => termOpen ? closeTerm() : openTerm());
