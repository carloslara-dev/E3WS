const menuDesktopLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const menuMobileLinks = document.querySelectorAll('.off-links a[href^="#"]');
const observedSections = document.querySelectorAll('section[id]');

function clearMenuActive() {
  menuDesktopLinks.forEach(link => link.classList.remove('active'));
  menuMobileLinks.forEach(link => link.classList.remove('active'));
}

function activateMenuLink(sectionId) {
  clearMenuActive();

  const desktopTarget = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
  const mobileTarget = document.querySelector(`.off-links a[href="#${sectionId}"]`);

  if (desktopTarget) desktopTarget.classList.add('active');
  if (mobileTarget) mobileTarget.classList.add('active');
}

const menuObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateMenuLink(entry.target.id);
    }
  });
}, {
  rootMargin: '-45% 0px -45% 0px',
  threshold: 0.01
});

observedSections.forEach(section => menuObserver.observe(section));

[...menuDesktopLinks, ...menuMobileLinks].forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      activateMenuLink(href.slice(1));
    }
  });
});