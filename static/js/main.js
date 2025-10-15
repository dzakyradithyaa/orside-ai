let scrollProgress = 0;

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initScrollAnimations();
  initParallaxWaves();
  initHeaderScroll();
  initThemeToggle();
});

function toggleMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  const offsetTop = element.offsetTop - 80;
  window.scrollTo({ top: offsetTop, behavior: "smooth" });
}

function initScrollProgress() {
  const progressBar = document.querySelector(".progress-bar");
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    scrollProgress = (scrolled / documentHeight) * 100;
    progressBar.style.transform = `scaleX(${scrollProgress / 100})`;
  });
}

function initHeaderScroll() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      scrollToSection(href.substring(1));
    }
  });
});

window.addEventListener("scroll", () => {
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  if (mobileMenu.classList.contains("active")) {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  if (mobileMenu.classList.contains("active")) {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
});

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
});

function initThemeToggle() {
  const toggles = document.querySelectorAll(".theme-toggle-input");
  const body = document.body;

  const applyTheme = (theme) => {
    const night = theme === "night";
    body.classList.toggle("night-mode", night);
    toggles.forEach((t) => (t.checked = night));
  };

  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  toggles.forEach((t) => {
    t.addEventListener("change", () => {
      const newTheme = t.checked ? "night" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  });
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");
if (scrollToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);
