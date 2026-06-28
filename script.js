const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

// header hide/show logic
window.addEventListener('scroll', () => {
  if (window.scrollY === 0) {
    // show header at the top
    header.classList.remove('hidden');
  } else if (window.scrollY > lastScrollY) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// scroll Fade-in Animation
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

// all elements with the 'hidden-fade' class
const fadeElements = document.querySelectorAll('.hidden-fade');
fadeElements.forEach(el => observer.observe(el));

// Project Modal Functionality
const projectData = {
    'airbnb-albany-pricing': {
        title: 'airbnb-albany-pricing',
        description: 'A model that predicts whether an Airbnb listing in Albany, NY will be booked on a given day and recommends a competitive nightly price, built on 11 months of real Inside Airbnb data (1.66M calendar-day records, 478 listings).',
        reflection: 'Pricing variation across 478 listings and messy time-series data! Which meant chronological train/test splits and auditing every feature for leakage. But at least I got to catch a leaky neighborhood-occupancy feature that I fixed with K-fold target encoding. :D',
        link: 'https://github.com/yanbmia/airbnb-albany-pricing'
    },
    'proximity': {
        title: 'proximity',
        description: 'An interactive map that shades NYC neighborhoods based on how well they match your preferences — proximity to NYU/Columbia, safety, parks, grocery chains, subway access, rent, and bikeshare coverage.',
        reflection: 'I built this after one too many group chats where everyone weighed the same tradeoffs (safety, rent, commute) with no consistent way to compare neighborhoods. Pure Python with no GIS libraries!',
        link: 'https://github.com/yanbmia/proximity',
        playLink: 'https://yanbmia.github.io/proximity/'
    },
    'cooking-p5': {
        title: 'cooking-p5',
        description: 'An interactive cooking game built using p5.js. Features interactive animations and a modern interface design.',
        reflection: 'This was a 3-week group assignment. I pushed for hand-drawn art (Procreate, not an artist but I tried)!. The harder problem was coordination, not code, so we agreed on shared conventions and a branching workflow up front, which made integration less painful.',
        link: 'https://github.com/yanbmia/cooking-p5',
        playLink: 'https://yanbmia.github.io/cooking-p5/'
    },
    'modified-tiktok': {
        title: 'modified-tiktok-link',
        description: 'A tool that allows users to view TikTok content without requiring the TikTok app.',
        reflection: 'I built this because I deleted TikTok off my phone but kept getting links from friends with no way to watch them :( I still use it almost every day, which is the best validation for building something yourself.',
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
        reflection: 'I started this project a while ago, but been going back and forth on what to do with it...',
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
        reflection: 'One of my first Python projects. I picked a board game because the rules map cleanly onto objects (players, board, dice, snakes, ladders), which made it a low-stakes way to actually learn object-oriented programming instead of just reading about it.',
        link: 'https://github.com/yanbmia/snakes-and-ladders'
    },
    'dancing-ducks': {
        title: 'project-dancing-ducks',
        description: 'A portfolio website built using a virtual environment and deployed on DigitalOcean. Utilizes server configuration, deployment practices, and cloud hosting.',
        reflection: 'Built through Major League Hacking x Meta\'s production engineering program. I joined to get exposure to server configuration and deployment, since coursework never covered that. Not currently live, and most of what I worked on isn\'t shareable, but it\'s where I learned what actually goes into shipping something beyond writing the code.',
        link: 'https://github.com/yanbmia/project-dancing-ducks'
    },
    'experimenting-microgpt': {
        title: 'experimenting-microgpt',
        description: 'Exploring lightweight transformer-based LLM architecture and inference optimization with MicroGPT.',
        link: 'https://github.com/yanbmia/experimenting-microgpt'
    },
    'farming-p5': {
        description: 'A farming simulation game inspired by Stardew Valley, built using p5.js. Features crop management, seasonal cycles, and interactive gameplay mechanics.',
        reflection: 'I built this to get more comfortable with p5.js\'s animation and game-loop model after using it once before. Inspired by Stardew Valley! Further developments to come.',
        link: 'https://github.com/yanbmia/farming-p5',
        playLink: 'https://yanbmia.github.io/farming-p5/'
    }
};

const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalReflection = document.getElementById('modalReflection');
const modalLink = document.getElementById('modalLink');
const modalPlayLink = document.getElementById('modalPlayLink');
const modalClose = document.querySelector('.modal-close');

// open modal when clicking project cards
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
            if (project.playLink) {
                modalPlayLink.href = project.playLink;
                modalPlayLink.style.display = 'inline-block';
            } else {
                modalPlayLink.style.display = 'none';
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
