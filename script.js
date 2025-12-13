const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

// Header hide/show logic
window.addEventListener('scroll', () => {
  if (window.scrollY === 0) {
    // Always show header at the top
    header.classList.remove('hidden');
  } else if (window.scrollY > lastScrollY) {
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
    threshold: 0.1
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

// Project Modal Functionality
const projectData = {
    'cooking-p5': {
        title: 'cooking-p5',
        description: 'An interactive cooking game built using p5.js. Features interactive animations and a modern interface design.',
        reflection: 'This project was built as a group assignment over 3 weeks. All of the art was hand drawn with Procreate. I drew the object elements (not an artist but I tried)! It was interesting managing this assignment as a group, as we had to coordinate our coding styles and ensure integration of different components. I learned a lot about teamwork and version control through this project. ',
        link: 'https://github.com/yanbmia/cooking-p5'
    },
    'modified-tiktok': {
        title: 'modified-tiktok-link',
        description: 'A tool that allows users to view TikTok content without requiring the TikTok app.',
        reflection: 'I use this tool just about every day to view Tiktok links that my friends send me. This was one of those moments where I thought, "there has to be a better way to do this," so I built it myself.',
        link: 'https://github.com/yanbmia/Modified-Tiktok-Link'
    },
    'spotify-bot': {
        title: 'spotify-automation-bot',
        description: 'An automation bot designed to streamline artist following on Spotify. ',
        reflection: '',
        link: 'https://github.com/yanbmia/spotify-automation-bot'
    },
    'headline-crawler': {
        title: 'headline-crawler',
        description: 'A web crawler that navigates and tracks news headlines. Uses web scraping techniques and data collection methods.',
        reflection: 'This is still in development! The web scraping functionality works. But the larger goal of this project is take all the scraped data and compile them into a single database for analysis.',
        link: 'https://github.com/yanbmia/headline-crawler'
    },
    'weather-packed': {
        title: 'weather-packed',
        description: 'An application that utilizes weather API data provides personalized packing recommendations based on destination and travel dates.',
        reflection: '',
        link: 'https://github.com/yanbmia/weather-packed'
    },
    'snakes-ladders': {
        title: 'snakes-and-ladders',
        description: 'A Python implementation of the classic board game Snakes and Ladders. This project recreates the traditional game experience with digital gameplay mechanics and player interaction.',
        reflection: 'I think this was one of my first Python projects (a long long time ago)! It was a fun way to learn about classes and object-oriented programming.',
        link: 'https://github.com/yanbmia/snakes-and-ladders'
    },
    'dancing-ducks': {
        title: 'project-dancing-ducks',
        description: 'A portfolio website built using a virtual environment and deployed on DigitalOcean. Utilizes server configuration, deployment practices, and cloud hosting.',
        reflection: 'Not currently live. This was build with Major League Hacking x Meta for their production engineering program. Most of the stuff I worked on can not be shared unfortunately.',
        link: 'https://github.com/yanbmia/project-dancing-ducks'
    }
};

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalReflection = document.getElementById('modalReflection');
const modalLink = document.getElementById('modalLink');
const modalClose = document.querySelector('.modal-close');

// Open modal when clicking project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const project = projectData[projectId];
        
        if (project) {
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalReflection.textContent = project.reflection;
            modalReflection.style.display = project.reflection ? 'block' : 'none';
            modalLink.href = project.link;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});