/* ===== Portfolio Interactive Features ===== */

// ==== 1) THEME TOGGLE ====
(() => {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeText = document.querySelector('[data-theme-text]');
  const STORAGE_KEY = 'theme';

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    themeText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTheme(saved);
    } else {
      const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(prefer);
    }
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  initTheme();
})();

// ==== 2) TYPEWRITER ANIMATION ====
(() => {
  const phrases = [
    'Building secure, scalable web apps.',
    'Full-stack developer with product mindset.',
    'Performance • Security • Clean UX.',
    'Crafting digital experiences.',
    'Code with purpose and passion.'
  ];

  const typewriter = document.getElementById('typewriter');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !typewriter) {
    if (typewriter) typewriter.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const speed = 50;
  const deleteSpeed = 30;
  const pauseTime = 2000;

  function typeNextChar() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      if (charIndex < phrase.length) {
        typewriter.textContent += phrase[charIndex];
        charIndex++;
        setTimeout(typeNextChar, speed);
      } else {
        isDeleting = true;
        setTimeout(typeNextChar, pauseTime);
      }
    } else {
      if (charIndex > 0) {
        typewriter.textContent = phrase.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeNextChar, deleteSpeed);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeNextChar, 500);
      }
    }
  }

  typeNextChar();
})();

// ==== 3) SCROLL PROGRESS INDICATOR ====
(() => {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progress.style.width = scrolled + '%';
  });
})();

// ==== 4) SCROLL REVEAL WITH INTERSECTION OBSERVER ====
(() => {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();

// ==== 5) ACTIVE NAV HIGHLIGHTING ====
(() => {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -66% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
    });
  });
})();

// ==== 6) MOBILE NAV TOGGLE ====
(() => {
  const navToggle = document.getElementById('nav-toggle');
  if (!navToggle) return;

  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();

// ==== 7) PROJECT CARD SPOTLIGHT ====
(() => {
  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length === 0) return;

  projectCards.forEach(card => {
    const spotlight = card.querySelector('.project-spotlight');
    if (!spotlight) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.left = x + 'px';
      spotlight.style.top = y + 'px';
      spotlight.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  });
})();

// ==== 8) SKILLS CHIP FILTERING ====
(() => {
  const skillChips = document.querySelectorAll('.skill-chip');
  const skillItems = document.querySelectorAll('.skill-item');

  if (skillChips.length === 0 || skillItems.length === 0) return;

  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const selectedSkill = chip.getAttribute('data-skill');

      // Update active state
      skillChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Filter skills
      skillItems.forEach(item => {
        const itemSkill = item.getAttribute('data-skill');
        if (selectedSkill === 'all' || itemSkill === selectedSkill) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Set initial "All" as active
  const allChip = document.querySelector('[data-skill="all"]');
  if (allChip) {
    allChip.classList.add('active');
  }
})();

// ==== 9) PROFILE PHOTO FALLBACK ====
(() => {
  const profilePhoto = document.getElementById('profile-photo');
  const photoWrap = document.querySelector('.photo-wrap');

  if (profilePhoto && photoWrap) {
    profilePhoto.addEventListener('error', () => {
      photoWrap.classList.add('no-photo');
    });

    // Show placeholder if image doesn't exist
    const img = new Image();
    img.onerror = () => {
      photoWrap.classList.add('no-photo');
    };
    img.src = profilePhoto.src;
  }
})();

// ==== 10) CONTACT FORM WITH MAILTO ====
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Build mailto with encoded subject and body
    const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:nirajthapa457@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    // Optionally reset form
    setTimeout(() => {
      form.reset();
    }, 1000);
  });
})();

// ==== 11) PREVENT HORIZONTAL OVERFLOW ====
(() => {
  const html = document.documentElement;
  const originalOverflow = html.style.overflowX;

  function checkOverflow() {
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    if (scrollWidth > clientWidth) {
      console.warn('Horizontal overflow detected');
    }
  }

  window.addEventListener('resize', checkOverflow);
  window.addEventListener('load', checkOverflow);
})();

// ==== 12) SMOOTH SCROLL BEHAVIOR FOR INTERNAL LINKS ====
(() => {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
