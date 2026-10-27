// ---------- Sticky nav + mobile menu ----------
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.getElementById('links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  })
);

// ---------- Hero: viewfinder that follows the cursor ----------
const hero = document.getElementById('hero');
const focus = document.getElementById('focus');
const flash = document.getElementById('flash');
let tx = 0, ty = 0, x = 0, y = 0;

function track(e) {
  const p = e.touches ? e.touches[0] : e;
  const r = hero.getBoundingClientRect();
  tx = p.clientX - r.left - focus.offsetWidth / 2;
  ty = p.clientY - r.top - focus.offsetHeight / 2;
  hero.classList.add('active');
}
hero.addEventListener('mousemove', track);
hero.addEventListener('touchmove', track, { passive: true });
hero.addEventListener('mouseleave', () => hero.classList.remove('active'));

function glide() {
  x += (tx - x) * 0.15;
  y += (ty - y) * 0.15;
  focus.style.transform = `translate(${x}px, ${y}px)`;
  requestAnimationFrame(glide);
}
glide();

hero.addEventListener('click', e => {
  if (e.target.closest('a, button')) return;
  flash.classList.remove('go');
  void flash.offsetWidth; // restart animation
  flash.classList.add('go');
  focus.classList.add('snap');
  setTimeout(() => focus.classList.remove('snap'), 200);
});

// Recording timecode
const tc = document.getElementById('timecode');
const start = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - start) / 1000);
  const pad = n => String(n).padStart(2, '0');
  tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}, 1000);

// ---------- Service tabs ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', false); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', true);
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ---------- Work filter ----------
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('hide', f !== 'all' && card.dataset.cat !== f);
    });
  });
});

// ---------- Form validation ----------
const form = document.getElementById('form');
const ok = document.getElementById('ok');
const fields = [
  { id: 'name',    err: 'e-name',    test: v => v.trim().length >= 2, msg: 'Enter your name.' },
  { id: 'email',   err: 'e-email',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
  { id: 'service', err: 'e-service', test: v => v !== '', msg: 'Choose a service.' },
  { id: 'msg',     err: 'e-msg',     test: v => v.trim().length >= 10, msg: 'Write at least 10 characters.' }
];

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const good = f.test(input.value);
    input.classList.toggle('invalid', !good);
    document.getElementById(f.err).textContent = good ? '' : f.msg;
    if (!good) valid = false;
  });
  if (valid) {
    const name = document.getElementById('name').value.trim().split(' ')[0];
    ok.textContent = `Thanks, ${name}. We will reply within 24 hours.`;
    form.reset();
  } else {
    ok.textContent = '';
  }
});
