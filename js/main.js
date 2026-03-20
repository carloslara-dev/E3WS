document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    const headerH = (document.querySelector("header")?.offsetHeight || 72) - 2;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

const observedSections = document.querySelectorAll("section[id]");
const desktopLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const mobileLinks = document.querySelectorAll('.off-links a[href^="#"]');

function clearActiveLinks() {
  desktopLinks.forEach(link => link.classList.remove("active"));
  mobileLinks.forEach(link => link.classList.remove("active"));
}

function setActiveLink(id) {
  clearActiveLinks();

  const desktopLink = document.querySelector(`.nav-links a[href="#${id}"]`);
  const mobileLink = document.querySelector(`.off-links a[href="#${id}"]`);

  if (desktopLink) desktopLink.classList.add("active");
  if (mobileLink) mobileLink.classList.add("active");
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: "-45% 0px -45% 0px",
  threshold: 0.01
});

observedSections.forEach(section => sectionObserver.observe(section));

const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".hero, section").forEach(el => appearObserver.observe(el));

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 6000);
}

const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const casosSection = document.getElementById("casos");

let currentCase = 0;

function moveCarousel() {
  if (!track) return;
  track.style.transform = `translateX(-${currentCase * 100}%)`;
}

function userInteracted() {
  pauseUntil = Date.now() + 12000;
}

function goNext() {
  currentCase = (currentCase === items.length - 1) ? 0 : currentCase + 1;
  moveCarousel();
  userInteracted();
}

function goPrev() {
  currentCase = (currentCase === 0) ? items.length - 1 : currentCase - 1;
  moveCarousel();
  userInteracted();
}

if (prev) prev.addEventListener("click", goPrev);
if (next) next.addEventListener("click", goNext);

let startX = null;

if (track) {
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;

    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  }, { passive: true });
}

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let autoTimer = null;
let pauseUntil = 0;

function startAutoCarousel() {
  if (prefersReducedMotion) return;
  if (autoTimer) return;

  autoTimer = setInterval(() => {
    if (Date.now() < pauseUntil) return;
    currentCase = (currentCase + 1) % items.length;
    moveCarousel();
  }, 9000);
}

function stopAutoCarousel() {
  if (!autoTimer) return;
  clearInterval(autoTimer);
  autoTimer = null;
}

if (casosSection) {
  const casosVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoCarousel();
      else stopAutoCarousel();
    });
  }, {
    threshold: 0.35
  });

  casosVisibilityObserver.observe(casosSection);
}

let casosVisible = false;

if (casosSection) {
  const casosKeyboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      casosVisible = entry.isIntersecting;
    });
  }, {
    threshold: 0.35
  });

  casosKeyboardObserver.observe(casosSection);
}

document.addEventListener("keydown", (e) => {
  if (!casosVisible) return;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    goNext();
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    goPrev();
  }
});

const form = document.getElementById("contactForm");
const ok = document.getElementById("ok");

if (form && ok) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const honey = form.querySelector('input[name="company"]');
    if (honey && honey.value.trim() !== "") return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    ok.classList.add("visible");
  });
}

const burger = document.getElementById("burger");
const offcanvas = document.getElementById("offcanvas");
const closeMenuBtn = document.getElementById("closeMenu");
const backdrop = document.getElementById("backdrop");

function getFocusable(container) {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )].filter(el =>
    !el.hasAttribute("disabled") &&
    el.getAttribute("aria-hidden") !== "true"
  );
}

let lastFocus = null;

function isMenuOpen() {
  return offcanvas?.classList.contains("open");
}

function openMenu() {
  if (!offcanvas || !backdrop || !burger) return;

  lastFocus = document.activeElement;

  offcanvas.classList.add("open");
  backdrop.classList.add("open");

  burger.setAttribute("aria-expanded", "true");
  offcanvas.setAttribute("aria-hidden", "false");
  backdrop.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  const focusables = getFocusable(offcanvas);
  if (focusables.length) focusables[0].focus();
}

function closeMenu() {
  if (!offcanvas || !backdrop || !burger) return;

  offcanvas.classList.remove("open");
  backdrop.classList.remove("open");

  burger.setAttribute("aria-expanded", "false");
  offcanvas.setAttribute("aria-hidden", "true");
  backdrop.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  else burger.focus();
}

if (burger) {
  burger.addEventListener("click", () => {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  });
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", closeMenu);
}

if (backdrop) {
  backdrop.addEventListener("click", () => {
    if (isMenuOpen()) closeMenu();
  });
}

document.addEventListener("keydown", (e) => {
  if (!isMenuOpen() || !offcanvas) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeMenu();
    return;
  }

  if (e.key === "Tab") {
    const focusables = getFocusable(offcanvas);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

if (offcanvas) {
  offcanvas.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      if (isMenuOpen()) closeMenu();
    });
  });
}