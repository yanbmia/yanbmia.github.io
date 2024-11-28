const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});
