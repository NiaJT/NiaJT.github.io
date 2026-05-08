// script.js — Enhanced interactive portfolio
// Theme management, nav behavior, skill filtering, scroll reveals, improved contact form

// --- 1) Theme Toggle & Persistence ---
(function () {
  const THEME_KEY = "theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  // Initialize
  const saved = (function () {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  })();
  applyTheme(saved === "light" ? "light" : "dark");

  if (btn) {
    btn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      applyTheme(isLight ? "dark" : "light");
    });
  }
})();

// --- 2) Nav Toggle & Responsive Behavior ---
(function () {
  const navToggle = document.getElementById("nav-toggle");
  const body = document.body;
  const navList = document.getElementById("nav-list");

  function setNavOpen(open) {
    body.classList.toggle("nav-open", open);
    navToggle &&
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  navToggle &&
    navToggle.addEventListener("click", () => {
      const open = !body.classList.contains("nav-open");
      setNavOpen(open);
    });

  // Close on link click
  document
    .querySelectorAll(".nav-link")
    .forEach((a) => a.addEventListener("click", () => setNavOpen(false)));

  // Close when resizing beyond mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && body.classList.contains("nav-open"))
      setNavOpen(false);
  });
})();

// --- 3) Active Nav Link via IntersectionObserver ---
(function () {
  const options = { root: null, rootMargin: "0px", threshold: 0.5 };
  const sections = document.querySelectorAll("section[data-section]");
  const navLinks = document.querySelectorAll(".nav-link");

  function clearActive() {
    navLinks.forEach((l) => l.classList.remove("active"));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        clearActive();
        const link = document.querySelector(`.nav-link[data-nav="${id}"]`);
        if (link) link.classList.add("active");
      }
    });
  }, options);

  sections.forEach((s) => io.observe(s));
})();

// --- 4) Scroll Reveal Animations ---
(function () {
  const reveals = document.querySelectorAll(
    ".section, .project-card, .profile-card",
  );
  const ro = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          ro.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((r) => {
    r.classList.add("reveal");
    ro.observe(r);
  });
})();

// --- 5) Profile Image Fallback ---
(function () {
  const img = document.getElementById("profile-photo");
  if (!img) return;

  img.addEventListener("error", () => {
    const wrap = img.closest(".photo-wrap");
    if (wrap) wrap.classList.add("no-photo");
  });

  img.addEventListener("load", () => {
    if (img.naturalWidth === 0) {
      const wrap = img.closest(".photo-wrap");
      if (wrap) wrap.classList.add("no-photo");
    }
  });
})();

// --- 6) Skill Chip Filtering ---
(function () {
  const skillChips = document.querySelectorAll(".skill-chip");
  const projectCards = document.querySelectorAll(".project-card");

  // Chips are interactive for future filtering
  skillChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      // Future: filter projects by skill
    });
  });

  // Show all projects by default
  projectCards.forEach((card) => {
    card.classList.add("reveal");
  });
})();

// --- 7) Contact Form with Encoded Mailto ---
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Build subject and body
    const subject = `Portfolio Contact — ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`;

    // Encode and create mailto link
    const mailtoLink = `mailto:nirajthapa457@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Clear form after a delay
    setTimeout(() => {
      form.reset();
    }, 500);
  });
})();

// --- 8) Smooth Focus for Section Links ---
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = a.getAttribute("href");
      if (target && target.startsWith("#")) {
        const el = document.querySelector(target);
        if (el) {
          setTimeout(() => {
            el.setAttribute("tabindex", "-1");
            el.focus();
          }, 300);
        }
      }
    });
  });
})();

// --- 9) Prevent horizontal scroll on long content ---
(function () {
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
})();
