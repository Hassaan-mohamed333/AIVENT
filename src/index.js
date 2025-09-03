document.addEventListener('DOMContentLoaded', function() {
    // GSAP Scale Animation Initialization
    if (typeof gsap === 'undefined') {
        console.warn('GSAP library not loaded');
        return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('ScrollTrigger plugin not loaded');
        return;
    }

    window.addEventListener('load', function() {
        initScaleAnimation();
    });

    function initScaleAnimation() {
        const scaleElements = document.querySelectorAll(".scale-in");

        if (scaleElements.length === 0) {
            console.warn('No elements with .scale-in class found');
            return;
        }

        gsap.set(scaleElements, {
            scale: 0.5,
            opacity: 0,
            transformOrigin: "center center",
            force3D: true
        });

        scaleElements.forEach((element) => {
            gsap.to(element, {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: "back.out(1.2)",
                force3D: true,
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    let isThrottled = false;
    window.addEventListener('scroll', function() {
        if (!isThrottled) {
            updateHeader();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 16);
        }
    });

    updateHeader();

    // Logo Slider
    function initSlider() {
        const slider = document.getElementById('logo-slider');
        const images = slider.querySelectorAll('img');

        let totalWidth = 0;
        images.forEach(img => {
            totalWidth += img.offsetWidth + 32;
        });

        images.forEach(img => {
            const clone = img.cloneNode(true);
            slider.appendChild(clone);
        });

        const duration = 30;

        const animation = gsap.to(slider, {
            x: -totalWidth,
            duration: duration,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });

        const sliderContainer = slider.parentElement;

        sliderContainer.addEventListener('mouseenter', () => {
            animation.pause();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            animation.play();
        });
    }

    if (document.readyState === 'complete') {
        initSlider();
    } else {
        window.addEventListener('load', initSlider);
    }

    // Marquee Animation
    const tlMarquee = gsap.timeline();

    tlMarquee.to("#marquee-content-1", {
        duration: 1,
        x: "0%",
        ease: "power2.out"
    }).to("#marquee-content-2", {
        duration: 1.5,
        x: "0%",
        ease: "power2.out"
    }, "+=1");

    tlMarquee.call(() => {
        startMarqueeAnimations();
    });

    function startMarqueeAnimations() {
        const content1 = document.getElementById('marquee-content-2');
        const content2 = document.getElementById('marquee-content-1');

        const content1Width = content1.scrollWidth / 2;
        const content2Width = content2.scrollWidth / 2;

        gsap.fromTo(content1, {
            x: 0
        }, {
            x: -content1Width,
            duration: 30,
            ease: "none",
            repeat: -1
        });

        gsap.fromTo(content2, {
            x: -content2Width
        }, {
            x: 0,
            duration: 30,
            ease: "none",
            repeat: -1
        });
    }

    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            gsap.globalTimeline.pause();
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            gsap.globalTimeline.play();
            isScrolling = false;
        }, 10);
    });

    console.log("Marquee script loaded");

    // Tabs Functionality (Schedule Section)
    const tabButtons = document.querySelectorAll('.tab-nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetTab = button.getAttribute('data-tab');

            tabPanes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.remove('hidden');
                    pane.classList.add('block');
                } else {
                    pane.classList.remove('block');
                    pane.classList.add('hidden');
                }
            });
        });
    });

    // Accordion Functionality (FAQ Section)
    const accordionHeaders = document.querySelectorAll("[data-target]");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", function() {
            const targetId = this.dataset.target;
            const targetContent = document.querySelector(targetId);
            const arrowIcon = this.querySelector("svg");

            if (targetContent.classList.contains("max-h-0")) {
                targetContent.classList.remove("max-h-0", "opacity-0");
                targetContent.classList.add("max-h-screen", "opacity-100");
            } else {
                targetContent.classList.remove("max-h-screen", "opacity-100");
                targetContent.classList.add("max-h-0", "opacity-0");
            }

            arrowIcon.classList.toggle("rotate-180");
        });
    });
});


// Standalone functions
// Animate Scale in a specific section
function animateScaleInSection(sectionId) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not available');
        return;
    }

    const elements = document.querySelectorAll(`${sectionId} .scale-in`);

    if (elements.length === 0) {
        console.warn(`No .scale-in elements found in ${sectionId}`);
        return;
    }

    gsap.set(elements, {
        scale: 0.5,
        opacity: 0,
        transformOrigin: "center center",
        force3D: true
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionId,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
        }
    });

    tl.to(elements, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: {
            amount: 0.6,
            from: "start"
        },
        force3D: true
    });
}

// Fallback animation for browsers without GSAP
function fallbackAnimation() {
    const elements = document.querySelectorAll('.scale-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });

    elements.forEach(el => observer.observe(el));
}

if (typeof gsap === 'undefined') {
    document.addEventListener('DOMContentLoaded', fallbackAnimation);
}