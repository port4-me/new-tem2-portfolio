// Premium smooth scrolling with active section indicator
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active section indicator
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('a').getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .skill-card, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add current year to footer
const currentYear = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

    // Initialize drag and drop functionality
    initializeDragAndDrop();
});

// Drag and Drop functionality for customization
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let originalPosition = { x: 0, y: 0 };

// Make elements draggable
function makeElementDraggable(element) {
    element.style.cursor = 'grab';
    element.style.position = 'relative';
    element.style.zIndex = '10';

    element.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left mouse button

        draggedElement = element;
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        originalPosition.x = rect.left - parentRect.left;
        originalPosition.y = rect.top - parentRect.top;

        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';

        // Add visual feedback
        element.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
        element.style.transform = 'scale(1.05)';

        e.preventDefault();
    });

    element.addEventListener('mousemove', (e) => {
        if (draggedElement !== element) return;

        const parentRect = element.parentElement.getBoundingClientRect();
        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;

        // Constrain to parent bounds
        const maxX = parentRect.width - element.offsetWidth;
        const maxY = parentRect.height - element.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        element.style.left = constrainedX + 'px';
        element.style.top = constrainedY + 'px';
    });

    element.addEventListener('mouseup', () => {
        if (draggedElement !== element) return;

        draggedElement = null;
        element.style.cursor = 'grab';
        element.style.zIndex = '10';

        // Remove visual feedback
        element.style.boxShadow = '';
        element.style.transform = '';

        // Save position
        saveElementPosition(element);
    });
}

// Save element position
function saveElementPosition(element) {
    const position = {
        id: element.id || element.className,
        left: element.style.left,
        top: element.style.top
    };

    // Save to localStorage for persistence
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');
    const existingIndex = positions.findIndex(p => p.id === position.id);

    if (existingIndex >= 0) {
        positions[existingIndex] = position;
    } else {
        positions.push(position);
    }

    localStorage.setItem('elementPositions', JSON.stringify(positions));
    console.log('Element position saved:', position);
}

// Load saved positions
function loadSavedPositions() {
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');

    positions.forEach(position => {
        const element = document.querySelector(`#${position.id}`) ||
                       document.querySelector(`.${position.id.split(' ').join('.')}`);
        if (element) {
            element.style.left = position.left;
            element.style.top = position.top;
        }
    });
}

// Initialize drag and drop for draggable elements
function initializeDragAndDrop() {
    // Make specific elements draggable
    const draggableElements = document.querySelectorAll('.profile-image, .skill-card, .project-card, .contact-item');

    draggableElements.forEach(element => {
        makeElementDraggable(element);
    });

    // Load saved positions
    loadSavedPositions();
}
