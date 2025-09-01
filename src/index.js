
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
