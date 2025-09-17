document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const nav = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const menuToggle = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  // Menú móvil
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
  
  // Cerrar menú al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle?.classList.remove('active');
    });
  });
  
  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const headerOffset = nav.offsetHeight;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
  
  // Cambiar clase activa en navegación al hacer scroll
  const setActiveLink = () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.pageYOffset + nav.offsetHeight + 100;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  
  // Efecto de scroll para el navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    setActiveLink();
  };
  
  // Inicializar animaciones al cargar
  const initAnimations = () => {
    const animatedElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  };
  
  // Inicialización
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('load', () => {
    handleScroll();
    initAnimations();
  });
  
  // Validación de formulario de contacto
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validación simple
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Aquí iría el código para enviar el formulario
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
      } else {
        alert('Por favor completa todos los campos requeridos.');
      }
    });
  }
});

// Función para el contador de estadísticas
function initCounter() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count') || '0', 10);
        const duration = 2000; // 2 segundos
        const step = count / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < count) {
            target.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = count;
          }
        };
        
        updateCounter();
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Inicializar contadores cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCounter);