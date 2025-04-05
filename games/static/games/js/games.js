// Card animations
document.addEventListener('DOMContentLoaded', function() {
    // Card flip animation on hover
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                gsap.to(card, {
                    scale: 1.05,
                    rotationY: 5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                gsap.to(card, {
                    scale: 1,
                    rotationY: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Touch feedback
        card.addEventListener('touchstart', () => {
            gsap.to(card, {
                scale: 0.98,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        card.addEventListener('touchend', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });

    // Stagger animation for cards on page load
    gsap.from('.game-card', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    });
}); 