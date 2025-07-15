document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const heroContainer = document.querySelector('.hero-container');
    const logoContainer = document.querySelector('.logo-container');
    const logo = document.querySelector('.logo');
    const mainContent = document.querySelector('.main-content');
    
    // Scroll thresholds
    const SHRINK_START = 50;    // Start shrinking at 50px scroll
    const SHRINK_COMPLETE = 150; // Complete shrinking at 150px scroll
    const HIDE_COMPLETE = 250;   // Hide logo completely at 250px scroll
    
    let ticking = false;
    
    function updateLogo() {
        const scrollY = window.scrollY;
        
        // Calculate shrink progress (0 to 1)
        const shrinkProgress = Math.min(Math.max((scrollY - SHRINK_START) / (SHRINK_COMPLETE - SHRINK_START), 0), 1);
        
        // Calculate hide progress (0 to 1)
        const hideProgress = Math.min(Math.max((scrollY - SHRINK_COMPLETE) / (HIDE_COMPLETE - SHRINK_COMPLETE), 0), 1);
        
        if (scrollY < SHRINK_START) {
            // No scrolling effect - original state
            heroContainer.classList.remove('scrolled');
            logoContainer.classList.remove('shrunk', 'hidden');
            logo.classList.remove('shrunk', 'hidden');
            mainContent.classList.remove('shrunk', 'no-logo');
            
        } else if (scrollY < SHRINK_COMPLETE) {
            // Shrinking phase
            heroContainer.classList.add('scrolled');
            logoContainer.classList.add('shrunk');
            logoContainer.classList.remove('hidden');
            logo.classList.add('shrunk');
            logo.classList.remove('hidden');
            mainContent.classList.add('shrunk');
            mainContent.classList.remove('no-logo');
            
            // Smooth scaling during shrink
            const scale = 1 - (shrinkProgress * 0.7); // Scale from 1 to 0.3
            logo.style.transform = `scale(${scale})`;
            
        } else if (scrollY < HIDE_COMPLETE) {
            // Hiding phase
            heroContainer.classList.add('scrolled');
            logoContainer.classList.add('shrunk');
            logo.classList.add('shrunk');
            mainContent.classList.add('shrunk');
            mainContent.classList.remove('no-logo');
            
            // Fade out during hide phase
            const opacity = 1 - hideProgress;
            const scale = 0.3 - (hideProgress * 0.3); // Scale from 0.3 to 0
            logo.style.opacity = opacity;
            logo.style.transform = `scale(${scale})`;
            
        } else {
            // Logo completely hidden
            heroContainer.classList.add('scrolled');
            logoContainer.classList.add('shrunk', 'hidden');
            logo.classList.add('shrunk', 'hidden');
            mainContent.classList.add('shrunk', 'no-logo');
            
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0)';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateLogo);
            ticking = true;
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', requestTick);
    
    // Initial call to set correct state
    updateLogo();
    
    // Handle resize events
    window.addEventListener('resize', function() {
        updateLogo();
    });
    
    // Add smooth scrolling to navigation links
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
    
    // Optional: Add intersection observer for enhanced performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe content sections for fade-in effect
        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }
});

// Add CSS for fade-in effect
const style = document.createElement('style');
style.textContent = `
    .content-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .content-section.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .content-section:first-child {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);