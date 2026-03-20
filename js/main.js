const desktopLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const mobileLinks = document.querySelectorAll('.off-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function clearActiveLinks() {
  desktopLinks.forEach(link => link.classList.remove('active'));
  mobileLinks.forEach(link => link.classList.remove('active'));
}

function setActiveLink(id) {
  clearActiveLinks();

  const desktopLink = document.querySelector(`.nav-links a[href="#${id}"]`);
  const mobileLink = document.querySelector(`.off-links a[href="#${id}"]`);

  if (desktopLink) desktopLink.classList.add('active');
  if (mobileLink) mobileLink.classList.add('active');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: '-45% 0px -45% 0px',
  threshold: 0.01
});

sections.forEach(section => observer.observe(section));