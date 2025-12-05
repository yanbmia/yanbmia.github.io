const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

// Header hide/show logic
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// Scroll Fade-in Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible-fade');
            observer.unobserve(entry.target); // animate once
        }
    });
}, observerOptions);

// Watch all elements with the 'hidden-fade' class
const fadeElements = document.querySelectorAll('.hidden-fade');
fadeElements.forEach(el => observer.observe(el));