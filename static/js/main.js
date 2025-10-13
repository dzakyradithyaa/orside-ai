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
  const themeToggles = document.querySelectorAll(".theme-toggle-input");
  const body = document.body;

  const applyTheme = (theme) => {
    const isNight = theme === "night";
    body.classList.toggle("night-mode", isNight);
    themeToggles.forEach((toggle) => (toggle.checked = isNight));
  };

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const newTheme = toggle.checked ? "night" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  });
}
