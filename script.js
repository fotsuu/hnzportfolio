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
   TYPING ANIMATION (HERO ROLE)
   =================================================================== */
const roles = [
  'Customer Service Representative',
  'Transcriber & Subtitle Editor',
  'Virtual Assistant',
  'Sabre GDS Certified',
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
  head.addEventListener('click', () => {
    const isOpen = card.classList.contains('active');
    // Close all
    document.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
    // Toggle clicked
    if (!isOpen) card.classList.add('active');
  });
});

/* ===================================================================
   BACK TO TOP
   =================================================================== */
const backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backBtn.classList.toggle('show', window.scrollY > 400);
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
