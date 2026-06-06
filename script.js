'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypewriter();
  initScrollAnimations();
  initActiveNavLinks();
  initCounterAnimations();
  initContactForm();
  initBackToTop();
  initYearFooter();
});

/* NAVBAR — add .scrolled class on scroll */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* HAMBURGER */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  const close = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('open')) close();
  });
}

/* TYPEWRITER */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const texts = ['Full Stack Developer', 'MERN Stack Developer', 'Android Developer', 'UI/UX Enthusiast'];
  let ti = 0, ci = 0, deleting = false, speed = 110;

  const type = () => {
    const cur = texts[ti];
    el.textContent = deleting
      ? cur.substring(0, --ci)
      : cur.substring(0, ++ci);

    if (!deleting && ci === cur.length)       { speed = 1800; deleting = true; }
    else if (deleting && ci === 0)            { deleting = false; ti = (ti + 1) % texts.length; speed = 400; }
    else                                      { speed = deleting ? 55 : 110; }

    setTimeout(type, speed);
  };
  setTimeout(type, 600);
}

/* SCROLL FADE-IN */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ACTIVE NAV LINK */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;

  const setActive = () => {
    const scrollY = window.scrollY;
    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - NAV_H - 10) current = s.id; });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

/* COUNTER ANIMATIONS */
function initCounterAnimations() {
  const nums = document.querySelectorAll('.stat-number[data-target]');
  if (!nums.length) return;
  const animate = el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let cur = 0;
    const step = target / (1400 / 16);
    const update = () => { cur += step; if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(update); } else { el.textContent = target; } };
    requestAnimationFrame(update);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  nums.forEach(el => obs.observe(el));
}

/* CONTACT FORM */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successEl = document.getElementById('form-success');
  if (!form) return;

  const getField = id => document.getElementById(id);
  const getError = id => document.getElementById(`${id}-error`);
  const showErr  = (id, msg) => { getField(id)?.classList.add('error'); const e = getError(id); if (e) e.textContent = msg; };
  const clearErr = id => { getField(id)?.classList.remove('error'); const e = getError(id); if (e) e.textContent = ''; };
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    let ok = true;
    const name    = getField('name')?.value.trim()    || '';
    const email   = getField('email')?.value.trim()   || '';
    const message = getField('message')?.value.trim() || '';
    clearErr('name');    if (!name    || name.length    < 2)  { showErr('name',    'Please enter your name (min 2 chars).');     ok = false; }
    clearErr('email');   if (!email   || !validEmail(email))  { showErr('email',   'Please enter a valid email address.');        ok = false; }
    clearErr('message'); if (!message || message.length < 10) { showErr('message', 'Please enter a message (min 10 chars).');     ok = false; }
    return ok;
  };

  ['name','email','message'].forEach(id => {
    getField(id)?.addEventListener('blur',  validate);
    getField(id)?.addEventListener('input', () => clearErr(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }
    setTimeout(() => {
      form.reset();
      ['name','email','message'].forEach(clearErr);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
      if (successEl) { successEl.style.display = 'flex'; setTimeout(() => successEl.style.display = 'none', 5000); }
    }, 1200);
  });
}

/* BACK TO TOP */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* FOOTER YEAR */
function initYearFooter() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* SMOOTH SCROLL with nav offset */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});
