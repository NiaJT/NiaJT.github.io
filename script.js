// script.js — Enhanced interactive portfolio
// Theme management, nav behavior, skill filtering, scroll reveals, improved contact form

// --- 1) Theme Toggle & Persistence ---
(function () {
  const THEME_KEY = "theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const themeText = document.querySelector(".theme-text");

  function updateThemeText(isDark) {
    if (themeText) {
      themeText.textContent = isDark ? "Dark" : "Light";
    }
  }

  function applyTheme(theme) {
    const isDark = theme !== "light";
    if (isDark) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
    updateThemeText(isDark);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  // Initialize theme from localStorage or system preference
  const saved = (function () {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  })();

  if (saved) {
    applyTheme(saved);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Toggle on button click
  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const newTheme = current === "light" ? "dark" : "light";
      applyTheme(newTheme);
    });
  }

  // Listen for system preference changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
})();

// --- 2) Nav Toggle & Responsive Behavior ---
(function () {
  const navToggle = document.getElementById("nav-toggle");
  const body = document.body;
  const navList = document.getElementById("nav-list");

  function setNavOpen(open) {
    body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = !body.classList.contains("nav-open");
      setNavOpen(open);
    });
  }

  // Close on link click
  document
    .querySelectorAll(".nav-link")
    .forEach((a) => a.addEventListener("click", () => setNavOpen(false)));

  // Close when resizing beyond mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && body.classList.contains("nav-open")) {
      setNavOpen(false);
    }
  });
})();

// --- 3) Active Nav Link via IntersectionObserver ---
(function () {
  const options = { root: null, rootMargin: "-50%", threshold: 0 };
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
    ".section, .project-card, .profile-card"
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
    { threshold: 0.15 }
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

  skillChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
  });
})();

// --- 7) Cursor-Following Spotlight on Project Cards ---
(function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const spotlight = card.querySelector(".project-spotlight");
    if (!spotlight) return;

    car8.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.left = x + "px";
      spotlight.style.top = y + "px";
      spotlight.style.opacity = "0.8";
    });

    card.addEventListener("mouseleave", () => {
      spotlight.style.opacity = "0";
    });
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
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Encode and create mailto link
    const mailtoLink = `mailto:nirajthapa457@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Clear form after a delay
    setTimeout(() => {
      form.reset();
    }, 500);
  });
})();

// --- 9) Smooth Focus for Section Links ---
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
          }, 100);
        }
      }
    });
  });
})();

// --- 10) Prevent horizontal scroll on long content ---
(function () {
  document.documentElement.style.overflowX = "hidden";
  document.body.style.overflowX = "hidden";
})();
