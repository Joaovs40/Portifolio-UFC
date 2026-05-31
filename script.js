// ─── BOOT SCREEN ───
const bootLines = document.getElementById('bootLines');
const bootBar   = document.getElementById('bootBar');
const bootStatus = document.getElementById('bootStatus');
const bootScreen = document.getElementById('boot-screen');

const bootMessages = [
  { text: '[ OK ] Carregando kernel jsales-os v2.0...', cls: 'ok', delay: 0 },
  { text: '[ OK ] Módulo CSS3 inicializado', cls: 'ok', delay: 200 },
  { text: '[ OK ] Motor JavaScript ativo', cls: 'ok', delay: 380 },
  { text: '[ WARN ] Nível de café: crítico', cls: 'warn', delay: 520 },
  { text: '[ OK ] Conectando ao GitHub...', cls: 'ok', delay: 680 },
  { text: '[ OK ] Projetos carregados: 3', cls: 'ok', delay: 840 },
  { text: '[ OK ] Matrix rain ativado', cls: 'ok', delay: 980 },
  { text: '[ OK ] Sistema pronto. Bem-vindo.', cls: 'ok', delay: 1100 },
];

let pct = 0;
const barInterval = setInterval(() => {
  pct = Math.min(pct + 2, 100);
  bootBar.style.width = pct + '%';
  if (pct >= 100) clearInterval(barInterval);
}, 18);

bootMessages.forEach(({ text, cls, delay }) => {
  setTimeout(() => {
    const span = document.createElement('span');
    span.className = 't-line ' + cls;
    span.textContent = text;
    bootLines.appendChild(span);
  }, delay);
});

setTimeout(() => {
  bootStatus.textContent = 'Sistema pronto.';
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    setTimeout(() => { bootScreen.style.display = 'none'; startHero(); }, 600);
  }, 300);
}, 1600);

function startHero() {
  initMatrix();
  initTyping();
  initScramble();
  initCounters();
}

// ─── MATRIX RAIN ───
function initMatrix() {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01アBCDEFGHIJKL0110';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols  = Math.floor(W / 18);
    drops = Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(8,8,8,0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = '14px Share Tech Mono';

    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const bright = Math.random() > 0.95;
      ctx.fillStyle = bright ? '#ffffff' : '#E8001D';
      ctx.globalAlpha = bright ? 0.9 : 0.4;
      ctx.fillText(ch, i * 18, y * 18);
      ctx.globalAlpha = 1;
      if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(draw, 55);
}

// ─── TYPING EFFECT ───
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
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 45);
    } else {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 80);
    }
  }

  setTimeout(tick, 500);
}

// ─── SCRAMBLE EFFECT ───
function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

  document.querySelectorAll('.scramble').forEach(el => {
    const target = el.getAttribute('data-text').toUpperCase();
    let frame = 0;
    let running = false;

    function scramble() {
      if (running) return;
      running = true;
      frame = 0;
      const total = target.length * 3;

      const interval = setInterval(() => {
        let out = '';
        for (let i = 0; i < target.length; i++) {
          if (frame > i * 3) {
            out += target[i];
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.childNodes[0]
          ? (el.firstChild.nodeType === 3
              ? (el.firstChild.textContent = out)
              : (el.textContent = out))
          : (el.textContent = out);
        frame++;
        if (frame > total) { clearInterval(interval); el.textContent = target; running = false; }
      }, 40);
    }

    el.addEventListener('mouseenter', scramble);
    setTimeout(scramble, Math.random() * 800 + 200);
  });
}

// ─── COUNTER ANIMATION ───
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    let current = 0;
    const step = Math.ceil(target / 30);

    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = current + suffix;
      if (current >= target) clearInterval(interval);
    }, 50);
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
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px'; cursor.style.height = '20px';
    ring.style.width    = '56px'; ring.style.height   = '56px';
    ring.style.opacity  = '1';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px'; cursor.style.height = '12px';
    ring.style.width    = '36px'; ring.style.height   = '36px';
    ring.style.opacity  = '0.6';
  });
});

// ─── CURSOR TRAIL ───
const trailCanvas = document.getElementById('cursorTrail');
const tCtx = trailCanvas.getContext('2d');
trailCanvas.width  = window.innerWidth;
trailCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
});

const particles = [];
document.addEventListener('mousemove', e => {
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      size: Math.random() * 3 + 1,
    });
  }
});

function drawTrail() {
  tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.04;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    tCtx.beginPath();
    tCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    tCtx.fillStyle = `rgba(232,0,29,${p.life * 0.6})`;
    tCtx.fill();
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

// ─── FADE IN + STAGGER + SKILL BARS ───
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');

    // animate skill bars inside
    e.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
      const level = bar.getAttribute('data-level');
      setTimeout(() => {
        bar.querySelector('.skill-fill').style.width = level + '%';
      }, i * 100);
    });

    observer.unobserve(e.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .stagger-children').forEach(el => observer.observe(el));

// also observe stack-bars separately
document.querySelectorAll('.stack-bars').forEach(el => observer.observe(el));

// ─── ACTIVE NAV ───
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--red)' : '';
  });
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
whoami    — exibe informações sobre mim
skills    — lista minhas habilidades
projetos  — lista meus projetos
contato   — formas de me contatar
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
Git   ████████░░ 80%

<span class="t-highlight">[ SOFT SKILLS ]</span>
Proatividade · Comunicação · Trabalho em equipe`,

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

  clear: '__clear__',
  exit:  '__exit__',
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
  termPrint('<span class="t-green">jsales-os v2.0 — Terminal interativo</span>\nDigite <span class="t-highlight">help</span> para ver os comandos disponíveis.');
  setTimeout(() => termInput.focus(), 100);
}

function closeTerminal() {
  termOpen = false;
  termOverlay.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    termOpen ? closeTerminal() : openTerminal();
  }
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
    if (result === '__clear__') {
      termBody.innerHTML = '';
    } else if (result === '__exit__') {
      closeTerminal();
    } else {
      if (cmd === 'github') {
        termPrint(result);
        setTimeout(() => window.open('https://github.com/Joaovs40', '_blank'), 600);
      } else {
        termPrint(result);
      }
    }
  } else {
    termPrint(`<span class="t-red">Comando não encontrado: ${cmd}</span>\nDigite <span class="t-highlight">help</span> para ver os comandos.`);
  }
});

// close on overlay click
termOverlay.addEventListener('click', e => {
  if (e.target === termOverlay) closeTerminal();
});

// close button
document.querySelector('.term-close').addEventListener('click', closeTerminal);
