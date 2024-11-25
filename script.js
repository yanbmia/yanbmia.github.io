// JavaScript to handle dynamic header visibility
let lastScrollY = window.scrollY;
const scrollHeader = document.querySelector('.scroll-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling down
        scrollHeader.style.transform = 'translateY(0)';
    } else {
        // Scrolling up
        scrollHeader.style.transform = 'translateY(-100%)';
    }
    lastScrollY = window.scrollY;
});
