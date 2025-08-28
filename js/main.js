document.addEventListener('DOMContentLoaded', function ( ) {
    // 1. تحديد العناصر الرئيسية
    const menuButton = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // التأكد من وجود العناصر قبل إضافة الأوامر لتجنب الأخطاء
    if (menuButton && mobileMenu) {
        
        // 2. وظيفة لفتح وإغلاق القائمة
        const toggleMenu = () => {
            mobileMenu.classList.toggle('-translate-x-full');
            mobileMenu.classList.toggle('translate-x-0');
        };

        // 3. إضافة حدث النقر على زر القائمة
        menuButton.addEventListener('click', function (event) {
            event.stopPropagation(); 
            toggleMenu();
        });

        // (موصى به) إغلاق القائمة عند الضغط على أحد الروابط
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('translate-x-0')) {
                    toggleMenu();
                }
            });
        });

        // (موصى به) إغلاق القائمة عند الضغط خارجها
        document.addEventListener('click', function (event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnButton = menuButton.contains(event.target);

            if (mobileMenu.classList.contains('translate-x-0') && !isClickInsideMenu && !isClickOnButton) {
                toggleMenu();
            }
        });
    } else {
        // إذا لم يتم العثور على العناصر، اطبع رسالة في الكونسول للمساعدة
        console.error("خطأ: لم يتم العثور على زر القائمة (menu-btn) أو قائمة الموبايل (mobile-menu).");
    }
});









  
// // Function to handle scroll event
//  window.addEventListener('scroll', function() {
//   const navbar = document.querySelector('.navbar');
  
//   if (window.pageYOffset > 100) {
//       navbar.classList.add('navbar-scrolled');
//   } else {
//       navbar.classList.remove('navbar-scrolled');
//   }
// });






// const showToast = (message, isError = false) => {
//   Toastify({
//     text: message,
//     duration: 3000,
//     gravity: "top",
//     position: "center",
//     style: {
//       background: isError ? "#ef4444" : "#22c55e",
//       direction: "rtl"
//     }
//   }).showToast();
// };

// // Form validation rules
// const validateForm = (formData) => {
//   const errors = {};
  
//   if (!formData.name.trim()) {
//     errors.name = 'الرجاء إدخال الاسم';
//   } else if (!/^[\u0600-\u06FF\s\w]+$/.test(formData.name)) {
//     errors.name = 'الرجاء إدخال اسم صحيح';
//   }
  

  
//   return errors;
// };

// // Create error message elements
// const createErrorElement = (message) => {
//   const errorDiv = document.createElement('div');
//   errorDiv.className = 'error-message';
//   errorDiv.textContent = message;
//   return errorDiv;
// };

// // Remove existing error messages
// const removeErrorMessages = () => {
//   document.querySelectorAll('.error-message').forEach(el => el.remove());
// };

// // Display error messages
// const showErrors = (errors) => {
//   removeErrorMessages();
//   Object.keys(errors).forEach(fieldName => {
//     const input = document.getElementById(fieldName);
//     const errorElement = createErrorElement(errors[fieldName]);
//     input.parentNode.appendChild(errorElement);
//     input.classList.add('border-red-500');
    
//     // Show toast for first error
//     if (Object.keys(errors)[0] === fieldName) {
//       showToast(errors[fieldName], true);
//     }
//   });
// };

// // Remove error styling
// const removeErrorStyles = () => {
//   const inputs = document.querySelectorAll('input');
//   inputs.forEach(input => input.classList.remove('border-red-500'));
// };

// // Google Sheets submission with loading state
// const submitToGoogleSheets = async (formData) => {
//   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxZaDxfoXwkrlpXSuDMJxW1C3wgekcwPWmjKDzwS1F4saENK5kH4DHJSubus6qRtwyv/exec';
  
//   // Show sending toast
//   showToast('جاري إرسال البيانات...');
  
//   try {
//     const response = await fetch(GOOGLE_SHEETS_URL, {
//       method: 'POST',
//       mode: 'no-cors',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData)
//     });
    
//     // Show success toast
//     showToast('تم التسجيل بنجاح!');
//     return true;
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     // Show error toast
//     showToast('حدث خطأ في التسجيل. الرجاء المحاولة مرة أخرى.', true);
//     return false;
//   }
// };

// // Form submission handler
// document.getElementById('contact-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
  
//   // Get form data
//   const formData = {
//     name: document.getElementById('name').value,
//     email: document.getElementById('email').value,
//     message: document.getElementById('message').value,
//     timestamp: new Date().toISOString()
//   };
  
//   // Validate form
//   const errors = validateForm(formData);
  
//   // Remove existing error styling
//   removeErrorStyles();
  
//   // If there are errors, show them and return
//   if (Object.keys(errors).length > 0) {
//     showErrors(errors);
//     return;
//   }
  
//   // Show loading state
//   const submitButton = e.target.querySelector('button[type="submit"]');
//   const originalButtonText = submitButton.textContent;
//   submitButton.textContent = 'جاري التسجيل...';
//   submitButton.disabled = true;
  
//   // Submit to Google Sheets
//   const success = await submitToGoogleSheets(formData);
  
//   if (success) {
//     // Reset form
//     e.target.reset();
//   }
  
//   // Reset button state
//   submitButton.textContent = originalButtonText;
//   submitButton.disabled = false;
// });
// // **********************
// /*** 1 ***/
// // let num1 = prompt("صلي علي النبي:");
// // console.log("Consonant");

// // var color =window.prompt("color");
// // if(color == "red"){
// //   console.log ("gooo");
  
// // }
// //  else if(color == "blue"){
// //   console.log ("wait");
 
// // }
// // else if(color == "yellow"){
// //   console.log ("stop");
 
// // }

// // else{
// //   console.log ("good");
// // }
// // var color =window.prompt("color");
// // switch(color){
// //   case "red" :
// //   console.log ("gooo");
// //   break;
// //   case "blue":
// //   console.log ("wait");
// //   break;
// //   case "yellow":
// //   console.log ("stop");
// //   break;
// //   default:
// //   console.log ("good");
// // // }
// // var color =window.prompt("color");
// // console.log (color);

// // var num1 = prompt("رقم ");
// // console.log(num1%3);

// // if(num1%3==0){
// //   console.log("Consonant");
// // }
// // else{
// //   console.log("Vowel");
// // }
// // var num3 = prompt("first number");  
// // var num4 = prompt("second number");
// // if(num3>num4){
// //   console.log(num3);
// // }
// // else{
// //   console.log(num4);
// // }
// // var num5=prompt("num");
// // if(num5<0){
// //   console.log("Negative")
// // }
// // else{
// //   console.log("Positive")
// // }
// // let num5_1 = prompt("Enter the first number:");
// // let num5_2 = prompt("Enter the second number:");
// // let num5_3 = prompt("Enter the third number:");
// // let max = num5_1;
// // let min = num5_1;

// // if (num5_2 > max) max = num5_2;
// // if (num5_3 > max) max = num5_3;

// // if (num5_2 < min) min = num5_2;
// // if (num5_3 < min) min = num5_3;

// // console.log("Max value = " + max);
// // console.log("Min value = " + min);


// // let num10 = prompt("Enter a number:");
// // for (let i = 1; i <= num10; i++) {
// //     if (i % 2 === 0) {
// //         console.log(i);
// //     }
// // }


// // Get integer input from user
// const number = parseInt(prompt("Enter an integer:"));

// // Validate input
// if (isNaN(number)) {
//     console.log("Please enter a valid integer.");
// } else {
//     // Print multiplication table up to 12
//     console.log(`Multiplication table for ${number}:`);
//     for (let i = 1; i <= 12; i++) {
//         console.log(`${number} × ${i} = ${number * i}`);
//     }
// }



