/* ============================================================
   PREMIUM PORTFOLIO 2026 — script.js
   Dinusha S. Dharmadasa | Full Stack Developer
   ============================================================ */

'use strict';

/* ── 1. LOADER ────────────────────────────────────────────── */
function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loader-progress');
  if (!loader || !progress) return;

  let pct       = 0;
  const total   = 1800; // ms
  const step    = 16;   // ~60fps
  const inc     = 100 / (total / step);

  const interval = setInterval(() => {
    pct = Math.min(pct + inc + Math.random() * inc * 0.5, 100);
    progress.style.width = pct + '%';

    if (pct >= 100) {
      clearInterval(interval);
      progress.style.width = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger hero reveals after loader
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
          setTimeout(() => el.classList.add('in-view'), i * 120);
        });
      }, 300);
    }
  }, step);

  document.body.style.overflow = 'hidden';
}

/* ── 2. CUSTOM CURSOR ─────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Only show custom cursor on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lerp for smooth lag
  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(loop);
  }
  loop();

  // Scale on interactive elements
  const interactables = 'a, button, input, textarea, [role="button"]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactables)) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ring.style.width       = '52px';
      ring.style.height      = '52px';
      ring.style.borderColor = isDark ? 'rgba(167,139,250,1)' : 'rgba(99,102,241,1)';
      dot.style.transform    = 'translate(-50%,-50%) scale(1.8)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactables)) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ring.style.width       = '36px';
      ring.style.height      = '36px';
      ring.style.borderColor = isDark ? 'rgba(167,139,250,0.7)' : 'rgba(99,102,241,0.8)';
      dot.style.transform    = 'translate(-50%,-50%) scale(1)';
    }
  });

  document.addEventListener('mousedown', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(0.6)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.85)';
  });

  document.addEventListener('mouseup', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── 3. NAVBAR SCROLL ─────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 4. HAMBURGER ─────────────────────────────────────────── */
function initHamburger() {
  const hamburger   = document.getElementById('hamburger');
  const navPillWrap = document.getElementById('nav-pill-wrap');
  if (!hamburger || !navPillWrap) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navPillWrap.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navPillWrap.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navPillWrap.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (
      navPillWrap.classList.contains('open') &&
      !navPillWrap.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/* ── 5. THEME TOGGLE ──────────────────────────────────────── */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;
  if (!btn || !icon) return;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (theme === 'dark') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }
}

/* ── 6. TYPEWRITER ────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Android Developer',
    'UI/UX Enthusiast'
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END     = 2000;
  const PAUSE_START   = 400;

  function tick() {
    if (paused) return;

    const current = roles[roleIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => {
          paused   = false;
          deleting = true;
          tick();
        }, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        paused   = true;
        setTimeout(() => {
          paused = false;
          tick();
        }, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();
}

/* ── 7. REVEAL ANIMATIONS ─────────────────────────────────── */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Unobserve to avoid re-triggering
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Stagger siblings inside grid/flex parents
  const parents = new Set();
  elements.forEach(el => {
    const parent = el.parentElement;
    if (!parents.has(parent)) {
      parents.add(parent);
      const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
      siblings.forEach((sib, idx) => {
        if (idx > 0) {
          const base = parseFloat(getComputedStyle(sib).transitionDelay) || 0;
          sib.style.transitionDelay = (base + idx * 0.08) + 's';
        }
      });
    }
    observer.observe(el);
  });
}

/* ── 8. ACTIVE NAV LINKS ──────────────────────────────────── */
function initActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-60px 0px -40% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* ── 9. COUNTER ANIMATIONS ────────────────────────────────── */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step     = 16;
    const totalSteps = duration / step;
    let current    = 0;

    const interval = setInterval(() => {
      current++;
      const value = Math.round(easeOut(current / totalSteps) * target);
      el.textContent = value;

      if (current >= totalSteps) {
        el.textContent = target;
        clearInterval(interval);
      }
    }, step);
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

/* ── 10. PARTICLES ────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let mouse     = { x: -9999, y: -9999 };

  const PARTICLE_COUNT   = 65;
  const MAX_DIST         = 130;
  const MOUSE_REPEL_DIST = 100;
  const MOUSE_FORCE      = 2.5;

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  function createParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.5,
      vy:  (Math.random() - 0.5) * 0.5,
      r:   Math.random() * 1.8 + 0.6,
      a:   Math.random() * 0.6 + 0.2
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const dotColor  = isDark ? '255,255,255' : '99,102,241';
    const lineColor = isDark ? '167,139,250' : '99,102,241';

    // Update and draw particles
    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_REPEL_DIST && dist > 0) {
        const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST * MOUSE_FORCE;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Clamp velocity
      const maxSpeed = 1.5;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColor},${p.a})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const ex   = p.x - q.x;
        const ey   = p.y - q.y;
        const eDist = Math.sqrt(ex * ex + ey * ey);

        if (eDist < MAX_DIST) {
          const alpha = (1 - eDist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  // Mouse tracking relative to canvas
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  window.addEventListener('resize', () => {
    resize();
    // Recreate off-canvas particles after resize
    particles = particles.map(p => ({
      ...p,
      x: Math.min(p.x, W),
      y: Math.min(p.y, H)
    }));
  });

  init();
  draw();
}

/* ── 11. CONTACT FORM ─────────────────────────────────────── */
function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    ['name-error', 'email-error', 'message-error'].forEach(id => showError(id, ''));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name) {
      showError('name-error', 'Please enter your name.');
      valid = false;
    }

    if (!email) {
      showError('email-error', 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message) {
      showError('message-error', 'Please enter your message.');
      valid = false;
    } else if (message.length < 10) {
      showError('message-error', 'Message must be at least 10 characters.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate send
    submitBtn.disabled     = true;
    submitBtn.innerHTML    = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      clearErrors();

      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    }, 1600);
  });

  // Live validation feedback
  form.name.addEventListener('input',    () => showError('name-error', ''));
  form.email.addEventListener('input',   () => showError('email-error', ''));
  form.message.addEventListener('input', () => showError('message-error', ''));
}

/* ── 12. BACK TO TOP ──────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 13. FOOTER YEAR ──────────────────────────────────────── */
function initYearFooter() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── INIT ALL ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initHamburger();
  initThemeToggle();
  initTypewriter();
  initRevealAnimations();
  initActiveNavLinks();
  initCounterAnimations();
  initParticles();
  initContactForm();
  initBackToTop();
  initYearFooter();
});
