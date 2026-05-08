// script.js — theme toggle, nav behavior, intersection observers for active nav and reveal
// Saves theme in localStorage key 'theme'.

// --- Theme handling ---
(function () {
  const THEME_KEY = "theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  // initialize
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

// --- Nav toggle and responsive closing ---
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

// --- Section active link using IntersectionObserver ---
(function () {
  const options = { root: null, rootMargin: "0px", threshold: 0.6 };
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

// --- Reveal animations for elements on scroll ---
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

// --- Profile image fallback placeholder ---
(function () {
  const img = document.getElementById("profile-photo");
  if (!img) return;
  img.addEventListener("error", () => {
    const wrap = img.closest(".photo-wrap");
    if (wrap) wrap.classList.add("no-photo");
  });
  // If image loads but is blank, still show placeholder
  img.addEventListener("load", () => {
    if (img.naturalWidth === 0) {
      const wrap = img.closest(".photo-wrap");
      if (wrap) wrap.classList.add("no-photo");
    }
  });
})();

// --- Smooth keyboard focus for links that jump to sections ---
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = a.getAttribute("href");
      if (target && target.startsWith("#")) {
        const el = document.querySelector(target);
        if (el) {
          // allow default jump but ensure focus for accessibility
          setTimeout(
            () => el.setAttribute("tabindex", "-1") && el.focus(),
            300,
          );
        }
      }
    });
  });
})();
