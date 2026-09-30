/* ===================================================================
   THEME MANAGER
   =================================================================== */
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===================================================================
   MOBILE NAVIGATION
   =================================================================== */
const menuBtn = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('nav-open');
}

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('nav-open', isOpen);
});

document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

/* ===================================================================
   TYPING ANIMATION (HERO ROLE)
   =================================================================== */
const roles = [
  'Virtual Assistant',
  'E-Commerce Customer Support',
  'Transcriber & Subtitle Specialist',
  'Email & Calendar Management Specialist',
];

let rIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typingText');

function typeLoop() {
  const current = roles[rIdx];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 42 : 68);
}
typeLoop();

/* ===================================================================
   COUNTER ANIMATION (STAT NUMBERS)
   =================================================================== */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let count = 0;
    const step = Math.ceil(target / 20);
    const iv = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(iv);
    }, 55);
  });
}

/* ===================================================================
   SCROLL REVEAL (IntersectionObserver)
   =================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      if (entry.target.classList.contains('hero-section')) {
        setTimeout(animateCounters, 600);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===================================================================
   ACTIVE NAV HIGHLIGHT (scroll-spy)
   =================================================================== */
const sections = ['hero', 'experience', 'skills', 'education', 'contact'];
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) spyObserver.observe(el);
});

/* ===================================================================
   EXPERIENCE ACCORDION
   =================================================================== */
document.querySelectorAll('.exp-card').forEach(card => {
  const head = card.querySelector('.exp-card-head');
  const toggleCard = () => {
    const isOpen = card.classList.contains('active');
    // Close all
    document.querySelectorAll('.exp-card').forEach(c => {
      c.classList.remove('active');
      c.querySelector('.exp-card-head').setAttribute('aria-expanded', 'false');
    });
    // Toggle clicked
    if (!isOpen) {
      card.classList.add('active');
      head.setAttribute('aria-expanded', 'true');
    }
  };

  head.addEventListener('click', toggleCard);
  head.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard();
    }
  });
});

/* ===================================================================
   BACK TO TOP
   =================================================================== */
const backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backBtn.classList.toggle('show', window.scrollY > 400);
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===================================================================
   CONTACT FORM SUBMISSION (MOCK)
   =================================================================== */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();

  const btnText = submitBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  submitBtn.disabled = true;
  btnText.textContent = 'Sending…';

  setTimeout(() => {
    form.reset();
    btnText.textContent = 'Sent ✓';
    successMsg.classList.add('visible');

    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = originalText;
      successMsg.classList.remove('visible');
    }, 4500);
  }, 1200);
});

/* ===================================================================
   SKILL PILL INTERACTION (re-trigger animation on scroll)
   =================================================================== */
const skillsSection = document.getElementById('skills');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.skill-pill').forEach((p, i) => {
        p.style.animationDelay = `${i * 80}ms`;
        p.style.animationName = 'none';
        void p.offsetWidth; // force reflow
        p.style.animationName = '';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
if (skillsSection) skillObserver.observe(skillsSection);
