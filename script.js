/* ================================================
   PORTFOLIO SCRIPT
   D W D Shashini Dharmadasa
================================================ */

'use strict';

/* ------------------------------------------------
   1. DOM READY HELPER
------------------------------------------------ */
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


/* ------------------------------------------------
   2. NAVBAR – sticky + blur on scroll
------------------------------------------------ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


/* ------------------------------------------------
   3. HAMBURGER MENU
------------------------------------------------ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!hamburger || !navMenu) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}


/* ------------------------------------------------
   4. TYPEWRITER ANIMATION
------------------------------------------------ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const texts = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Android Developer',
    'UI/UX Enthusiast',
  ];

  let textIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingSpeed = 100;

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 55;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentText.length) {
      // Pause before deleting
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex  = (textIndex + 1) % texts.length;
      typingSpeed = 400; // pause before typing next
    }

    setTimeout(type, typingSpeed);
  };

  // Small initial delay before starting
  setTimeout(type, 600);
}


/* ------------------------------------------------
   5. SCROLL-TRIGGERED FADE-IN ANIMATIONS
   (Intersection Observer)
------------------------------------------------ */
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  fadeEls.forEach(el => observer.observe(el));
}


/* ------------------------------------------------
   6. ACTIVE NAV LINK ON SCROLL
------------------------------------------------ */
function initActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const NAV_OFFSET = 90;

  const setActive = () => {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - NAV_OFFSET;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}


/* ------------------------------------------------
   7. COUNTER ANIMATIONS (stats)
------------------------------------------------ */
function initCounterAnimations() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400;
    const step     = target / (duration / 16); // ~60fps
    let current    = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}


/* ------------------------------------------------
   8. CONTACT FORM VALIDATION
------------------------------------------------ */
function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  const getField  = id => document.getElementById(id);
  const getError  = id => document.getElementById(`${id}-error`);

  const showError = (fieldId, message) => {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (field)  field.classList.add('error');
    if (error)  error.textContent = message;
  };

  const clearError = (fieldId) => {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (field)  field.classList.remove('error');
    if (error)  error.textContent = '';
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    let valid = true;

    const name    = getField('name')?.value.trim() || '';
    const email   = getField('email')?.value.trim() || '';
    const message = getField('message')?.value.trim() || '';

    // Name
    clearError('name');
    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      valid = false;
    }

    // Email
    clearError('email');
    if (!email) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    // Message
    clearError('message');
    if (!message) {
      showError('message', 'Please enter your message.');
      valid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      valid = false;
    }

    return valid;
  };

  // Real-time validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const field = getField(id);
    if (field) {
      field.addEventListener('blur', () => validate());
      field.addEventListener('input', () => {
        clearError(id);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Disable button and show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    }

    // Simulate a send delay (replace this with real API call if needed)
    setTimeout(() => {
      form.reset();
      ['name', 'email', 'message'].forEach(id => clearError(id));

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
      }

      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    }, 1200);
  });
}


/* ------------------------------------------------
   9. BACK TO TOP BUTTON
------------------------------------------------ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ------------------------------------------------
   10. FOOTER YEAR
------------------------------------------------ */
function initYearFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ------------------------------------------------
   11. SMOOTH SCROLL FOR ANCHOR LINKS
   (Supplementary – CSS scroll-behavior covers most,
    this handles edge cases & offset for fixed navbar)
------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 70;

    const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  });
});
