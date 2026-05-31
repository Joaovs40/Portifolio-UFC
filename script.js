// ─── BOOT SCREEN ───
const bootLines  = document.getElementById('bootLines');
const bootBar    = document.getElementById('bootBar');
const bootStatus = document.getElementById('bootStatus');
const bootScreen = document.getElementById('boot-screen');

const bootMessages = [
  { text: '[ OK ] Sistema jsales-os v2.0 iniciando...', cls: 'ok',   delay: 0 },
  { text: '[ OK ] Módulo CSS carregado',                cls: 'ok',   delay: 180 },
  { text: '[ OK ] JavaScript engine ativo',             cls: 'ok',   delay: 340 },
  { text: '[ WARN ] Nível de café: crítico',            cls: 'warn', delay: 480 },
  { text: '[ OK ] Projetos carregados: 3',              cls: 'ok',   delay: 620 },
  { text: '[ OK ] Terminal interativo pronto',          cls: 'ok',   delay: 780 },
  { text: '[ OK ] Sistema pronto.',                     cls: 'ok',   delay: 940 },
];

let pct = 0;
const barInterval = setInterval(() => {
  pct = Math.min(pct + 2, 100);
  bootBar.style.width = pct + '%';
  if (pct >= 100) clearInterval(barInterval);
}, 16);

bootMessages.forEach(({ text, cls, delay }) => {
  setTimeout(() => {
    const span = document.createElement('span');
    span.className = 't-line ' + cls;
    span.textContent = text;
    bootLines.appendChild(span);
  }, delay);
});

setTimeout(() => {
  bootStatus.textContent = 'Pronto.';
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    setTimeout(() => {
      bootScreen.style.display = 'none';
      initMatrix();
      initTyping();
      initCounters();
    }, 700);
  }, 200);
}, 1400);

// ─── MATRIX RAIN (muito sutil) ───
function initMatrix() {
  const canvas = document.getElementById('matrix');
  const ctx    = canvas.getContext('2d');
  let W, H, cols, drops;
  const chars = 'アイウエオ01アBCDEF0110GHIJKL';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols  = Math.floor(W / 20);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  setInterval(() => {
    ctx.fillStyle = 'rgba(19,19,31,0.06)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '13px Share Tech Mono';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = '#A5A8AF';
      ctx.globalAlpha = Math.random() * 0.2 + 0.05;
      ctx.fillText(ch, i * 20, y * 20);
      ctx.globalAlpha = 1;
      if (y * 20 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 70);
}

// ─── TYPING ───
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    'desenvolvendo soluções reais',
    'apaixonado por front-end',
    'sempre aprendendo algo novo',
    'disponível para oportunidades',
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (deleting) {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 500); return; }
      setTimeout(tick, 40);
    } else {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 85);
    }
  }
  setTimeout(tick, 400);
}

// ─── COUNTERS ───
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 1, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 80);
  });
}

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px'; cursor.style.height = '18px';
    ring.style.width   = '50px'; ring.style.height   = '50px';
    ring.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '7px';  cursor.style.height = '7px';
    ring.style.width   = '28px'; ring.style.height   = '28px';
    ring.style.opacity = '0.5';
  });
});

// ─── CURSOR TRAIL ───
const trailCanvas = document.getElementById('cursorTrail');
const tCtx = trailCanvas.getContext('2d');
function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

const particles = [];
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.4) return;
  particles.push({
    x: e.clientX, y: e.clientY,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    life: 1, size: Math.random() * 2 + 0.5,
  });
});
function drawTrail() {
  tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.life -= 0.05;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    tCtx.beginPath();
    tCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    tCtx.fillStyle = `rgba(165,168,175,${p.life * 0.35})`;
    tCtx.fill();
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

// ─── FADE IN + SKILL BARS ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
      const level = bar.getAttribute('data-level');
      setTimeout(() => { bar.querySelector('.skill-fill').style.width = level + '%'; }, i * 80);
    });
    observer.unobserve(e.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in, .stack-bars').forEach(el => observer.observe(el));

// ─── ACTIVE NAV ───
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : ''; });
});

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const navMobile  = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// ─── TERMINAL EASTER EGG ───
const termOverlay = document.getElementById('terminal-overlay');
const termBody    = document.getElementById('termBody');
const termInput   = document.getElementById('termInput');
let termOpen = false;

const termCommands = {
  help: `<span class="t-highlight">Comandos disponíveis:</span>
whoami    — informações sobre mim
skills    — habilidades técnicas
projetos  — lista de projetos
contato   — formas de contato
github    — abre meu GitHub
clear     — limpa o terminal
exit      — fecha o terminal`,

  whoami: `<span class="t-green">João Pedro Vasques de Sales</span>
Estudante ADS · Claretiano
Front-end Dev · Estagiário TI
Rio Claro — SP — Brasil`,

  skills: `<span class="t-highlight">[ HARD SKILLS ]</span>
HTML5 ████████░░ 90%
CSS3  ████████░░ 85%
JS    ███████░░░ 75%
React ██████░░░░ 65%
Git   ████████░░ 80%`,

  projetos: `<span class="t-highlight">[ PROJETOS ]</span>
01 · FinançasBot WhatsApp   <span class="t-green">✓ concluído</span>
02 · Portfólio Pessoal      <span class="t-green">✓ concluído</span>
03 · Sistema RafaelMuller   <span class="t-highlight">⟳ em desenvolvimento</span>`,

  contato: `<span class="t-highlight">[ CONTATO ]</span>
📱 (19) 99322-9350
✉️ joaovs40.jp@gmail.com
💼 linkedin.com/in/joaosalesdev
🐙 github.com/Joaovs40`,

  github: `<span class="t-green">Abrindo GitHub...</span>`,
  clear:  '__clear__',
  exit:   '__exit__',
};

function termPrint(html) {
  const line = document.createElement('div');
  line.className = 't-line t-out';
  line.innerHTML = html;
  termBody.appendChild(line);
  termBody.scrollTop = termBody.scrollHeight;
}
function termPrintCmd(cmd) {
  const line = document.createElement('div');
  line.className = 't-line t-cmd';
  line.textContent = 'jsales@portfolio:~$ ' + cmd;
  termBody.appendChild(line);
}

function openTerminal() {
  if (termOpen) return;
  termOpen = true;
  termOverlay.classList.add('open');
  termPrint('<span class="t-green">jsales-os v2.0 — Terminal interativo</span>\nDigite <span class="t-highlight">help</span> para ver os comandos.');
  setTimeout(() => termInput.focus(), 100);
}
function closeTerminal() {
  termOpen = false;
  termOverlay.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); termOpen ? closeTerminal() : openTerminal(); }
  if (e.key === 'Escape' && termOpen) closeTerminal();
});

termInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const cmd = termInput.value.trim().toLowerCase();
  termInput.value = '';
  if (!cmd) return;
  termPrintCmd(cmd);
  if (cmd in termCommands) {
    const result = termCommands[cmd];
    if (result === '__clear__') termBody.innerHTML = '';
    else if (result === '__exit__') closeTerminal();
    else {
      termPrint(result);
      if (cmd === 'github') setTimeout(() => window.open('https://github.com/Joaovs40', '_blank'), 500);
    }
  } else {
    termPrint(`<span class="t-red">Comando não encontrado: ${cmd}</span>\nDigite <span class="t-highlight">help</span>.`);
  }
});

termOverlay.addEventListener('click', e => { if (e.target === termOverlay) closeTerminal(); });
document.querySelector('.term-close').addEventListener('click', closeTerminal);
