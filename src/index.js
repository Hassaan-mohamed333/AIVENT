

//   ************* logo slider *********************** 

document.addEventListener('DOMContentLoaded', function() {
    // الانتظار حتى تحميل جميع الصور
    function initSlider() {
        const slider = document.getElementById('logo-slider');
        const images = slider.querySelectorAll('img');
        
        // حساب العرض الكلي للصور مع المسافات بينها
        let totalWidth = 0;
        images.forEach(img => {
            totalWidth += img.offsetWidth + 32; // 32 هو قيمة الـ px-4 (16px على كل جانب)
        });
        
        // إنشاء نسخة مكررة من الصور للتأثير اللانهائي
        images.forEach(img => {
            const clone = img.cloneNode(true);
            slider.appendChild(clone);
        });
        
        // إعداد حركة GSAP
        const duration = 30; // مدة الحركة بالثواني (يمكن تعديلها)
        
        // إنشاء الحركة
        const animation = gsap.to(slider, {
            x: -totalWidth,
            duration: duration,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
        
        // التحكم بالماوس - إيقاف الحركة عند التمرير
        const sliderContainer = slider.parentElement;
        
        sliderContainer.addEventListener('mouseenter', () => {
            animation.pause();
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            animation.play();
        });
    }
    
    // التأكد من تحميل جميع الصور أولاً
    if (document.readyState === 'complete') {
        initSlider();
    } else {
        window.addEventListener('load', initSlider);
    }
});
//  ************* end logo slider *********************** 
//  ************* Marquee *********************** 

   document.addEventListener('DOMContentLoaded', function () {

            // Create timeline for entrance animations
            const tl = gsap.timeline();

            // First text content enters from left to right into fixed div
            tl.to("#marquee-content-1", {
                duration: 1,
                x: "0%",
                ease: "power2.out"
            })
                // Second text content enters from right to left after 1 second into fixed div
                .to("#marquee-content-2", {
                    duration: 1.5,
                    x: "0%",
                    ease: "power2.out"
                }, "+=1");

            // Start continuous marquee animations after entrance is complete
            tl.call(() => {
                startMarqueeAnimations();
            });

            function startMarqueeAnimations() {
                // Get content widths for seamless loop calculation
                const content1 = document.getElementById('marquee-content-1');
                const content2 = document.getElementById('marquee-content-2');

                const content1Width = content1.scrollWidth / 2; // Divide by 2 because we duplicated content
                const content2Width = content2.scrollWidth / 2;

                // Animate first marquee (left to right)
                gsap.fromTo(content1,
                    { x: 0 },
                    {
                        x: -content1Width,
                        duration: 30,
                        ease: "none",
                        repeat: -1
                    }
                );

                // Animate second marquee (right to left)
                gsap.fromTo(content2,
                    { x: -content2Width },
                    {
                        x: 0,
                        duration: 30,
                        ease: "none",
                        repeat: -1
                    }
                );
            }

            // Optional: Pause animations on scroll (as mentioned in your requirement)
            let isScrolling = false;
            let scrollTimeout;

            window.addEventListener('scroll', function () {
                if (!isScrolling) {
                    // Pause all GSAP animations
                    gsap.globalTimeline.pause();
                    isScrolling = true;
                }

                // Clear timeout and set new one
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function () {
                    // Resume animations after scrolling stops
                    gsap.globalTimeline.play();
                    isScrolling = false;
                }, 10);
            });
        });

//  ************* end Marquee *********************** 

//    ************* section-schedule ***********************  
 document.addEventListener('DOMContentLoaded', function ( ) {
            const tabButtons = document.querySelectorAll('.tab-nav-item');
            const tabPanes = document.querySelectorAll('.tab-pane');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // إزالة الكلاس النشط من جميع الأزرار
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // إضافة الكلاس النشط للزر المضغوط
                    button.classList.add('active');

                    const targetTab = button.getAttribute('data-tab');

                    // إخفاء جميع لوحات المحتوى
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
        });

    // ************* end section-schedule ***********************  

