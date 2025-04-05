// Soul counter animation
let soulCount = 0;
const soulCounter = document.getElementById('soul-count');

function updateSoulCount(count) {
    gsap.to(soulCounter, {
        innerHTML: count,
        duration: 1,
        snap: { innerHTML: 1 },
        ease: "power2.out"
    });
}

// Random soul flame effect
function createSoulFlame() {
    const flame = document.createElement('div');
    flame.className = 'soul-flame';
    flame.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%);
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        pointer-events: none;
        z-index: 998;
    `;
    document.body.appendChild(flame);

    gsap.to(flame, {
        opacity: 0,
        scale: 2,
        duration: 2,
        ease: "power2.out",
        onComplete: () => flame.remove()
    });
}

// Create random soul flames
setInterval(createSoulFlame, 3000);

// Glitch effect on hover
document.querySelectorAll('.glitch').forEach(element => {
    element.addEventListener('mouseover', () => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch 0.3s infinite';
    });

    element.addEventListener('mouseout', () => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch 1s infinite';
    });
});

// Parallax effect for soul flames
document.addEventListener('mousemove', (e) => {
    const flames = document.querySelector('.soul-flames');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    gsap.to(flames, {
        backgroundPosition: `${x * 100}% ${y * 100}%`,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Game card hover effect
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.05,
            boxShadow: '0 0 30px rgba(255,0,0,0.5)',
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            boxShadow: '0 0 20px rgba(255,0,0,0.3)',
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Page load animation
document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.main-header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from('.nav-link', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Initialize soul count
    updateSoulCount(0);
}); 