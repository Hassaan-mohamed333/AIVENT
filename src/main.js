// AIvent Tickets Website - Main JavaScript File

// Global Variables
const ticketsData = [
  {
    id: "standard",
    name: "Standard",
    price: 299,
    benefits: [
      "Access to keynotes and sessions",
      "Admission to exhibitions and demos",
      "Networking opportunities",
      "Digital materials and session recordings",
    ],
    originalAvailable: 100,
    currentAvailable: 100,
  },
  {
    id: "vip",
    name: "VIP",
    price: 699,
    benefits: [
      "All Standard benefits",
      "VIP lounge access and exclusive events",
      "Front-row seating and priority workshop access",
      "VIP swag bag and exclusive content",
    ],
    originalAvailable: 50,
    currentAvailable: 50,
  },
  {
    id: "full-access",
    name: "Full Access Pass",
    price: 1199,
    benefits: [
      "All VIP benefits",
      "Access to all workshops and breakout sessions",
      "Personalized session scheduling",
      "Speaker meet-and-greet and after-party access",
    ],
    originalAvailable: 25,
    currentAvailable: 25,
  },
  {
    id: "exclusive",
    name: "Exclusive Access",
    price: 2499,
    benefits: [
      "All Full Access Pass benefits",
      "Private one-on-one sessions with speakers",
      "Priority access to all events and workshops",
      "Exclusive VIP gala and after-party invitations",
    ],
    originalAvailable: 10,
    currentAvailable: 10,
  },
  {
    id: "student",
    name: "Student",
    price: 149,
    benefits: [
      "Access to keynotes and workshops",
      "Student-specific networking events",
      "Discounted online resources post-event",
      "Special student meetups for networking",
    ],
    originalAvailable: 200,
    currentAvailable: 200,
  },
  {
    id: "virtual",
    name: "Virtual",
    price: 99,
    benefits: [
      "Live-streamed keynotes and workshops",
      "On-demand access to recorded sessions",
      "Interactive Q&A with speakers",
      "Virtual networking and digital swag",
    ],
    originalAvailable: 500,
    currentAvailable: 500,
  },
];

let cart = {};
let isScrolling = false;

// Storage Keys
const STORAGE_KEYS = {
  CART: "aivent_cart",
  TICKET_AVAILABILITY: "aivent_ticket_availability",
};

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  loadFromStorage();
  initializePreloader();
  initializeHeader();
  initializeMobileMenu();
  initializeScrollEffects();
  initializeSmoothScrolling();
  initializeRevealAnimations();
  generateTickets();
  updateCartDisplay();
  initializeHeadingAnimation();
  initializeCreativeCursor();
  initializeTicketCardsHover();
  initializeInteractiveLetters();
});

// Storage Functions
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));

    const availabilityData = {};
    ticketsData.forEach((ticket) => {
      availabilityData[ticket.id] = ticket.currentAvailable;
    });
    localStorage.setItem(
      STORAGE_KEYS.TICKET_AVAILABILITY,
      JSON.stringify(availabilityData)
    );
  } catch (error) {
    showToast("Warning: Data will not persist after page refresh", "info");
  }
}

function loadFromStorage() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }

    const savedAvailability = localStorage.getItem(
      STORAGE_KEYS.TICKET_AVAILABILITY
    );
    if (savedAvailability) {
      const availabilityData = JSON.parse(savedAvailability);
      ticketsData.forEach((ticket) => {
        if (availabilityData[ticket.id] !== undefined) {
          ticket.currentAvailable = availabilityData[ticket.id];
        }
      });
    }
  } catch (error) {
    cart = {};
    ticketsData.forEach((ticket) => {
      ticket.currentAvailable = ticket.originalAvailable;
    });
  }
}

// Ticket Availability Functions
function updateTicketAvailability(ticketId, quantityChange) {
  const ticket = ticketsData.find((t) => t.id === ticketId);
  if (!ticket) return;

  ticket.currentAvailable = Math.max(
    0,
    Math.min(ticket.currentAvailable - quantityChange, ticket.originalAvailable)
  );
  updateTicketAvailabilityDisplay(ticketId);
  saveToStorage();
}

function updateTicketAvailabilityDisplay(ticketId) {
  const ticket = ticketsData.find((t) => t.id === ticketId);
  if (!ticket) return;

  const availabilityElement = document.getElementById(
    `availability-${ticketId}`
  );
  const ticketCard = document.querySelector(`[data-ticket-card="${ticketId}"]`);
  const addToCartBtn = document.querySelector(
    `[data-add-to-cart="${ticketId}"]`
  );
  const quantityInput = document.getElementById(`quantity-${ticketId}`);
  const quantityButtons = document.querySelectorAll(
    `[data-quantity-btn="${ticketId}"]`
  );

  if (availabilityElement) {
    if (ticket.currentAvailable === 0) {
      availabilityElement.textContent = "SOLD OUT";
      availabilityElement.className =
        "text-center text-sm text-red-400 font-bold mt-4";

      if (ticketCard) ticketCard.classList.add("sold-out");
      if (addToCartBtn) {
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML =
          '<i class="fas fa-times mr-2"></i><span>SOLD OUT</span>';
        addToCartBtn.classList.add("disabled-btn");
      }
      if (quantityInput) {
        quantityInput.disabled = true;
        quantityInput.value = 0;
        quantityInput.max = 0;
      }
      quantityButtons.forEach((btn) => {
        btn.disabled = true;
        btn.classList.add("disabled-btn");
      });
    } else if (ticket.currentAvailable <= 5) {
      availabilityElement.textContent = `Only ${ticket.currentAvailable} tickets left!`;
      availabilityElement.className = "text-center text-sm stock-warning mt-4";
      if (ticketCard) {
        ticketCard.classList.remove("sold-out");
        ticketCard.classList.add("low-stock");
      }
      if (quantityInput) {
        quantityInput.max = ticket.currentAvailable;
        quantityInput.disabled = false;
      }
      quantityButtons.forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove("disabled-btn");
      });
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML =
          '<i class="fas fa-cart-plus mr-2"></i><span>Add to Cart</span>';
        addToCartBtn.classList.remove("disabled-btn");
      }
    } else {
      availabilityElement.textContent = `${ticket.currentAvailable} tickets available`;
      availabilityElement.className = "text-center text-sm text-white/60 mt-4";
      if (ticketCard) {
        ticketCard.classList.remove("sold-out", "low-stock");
      }
      if (quantityInput) {
        quantityInput.max = ticket.currentAvailable;
        quantityInput.disabled = false;
      }
      quantityButtons.forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove("disabled-btn");
      });
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML =
          '<i class="fas fa-cart-plus mr-2"></i><span>Add to Cart</span>';
        addToCartBtn.classList.remove("disabled-btn");
      }
    }
  }
}

// Preloader
function initializePreloader() {
  window.addEventListener("load", function () {
    const loader = document.getElementById("de-loader");
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 1000);
  });
}

// Header Initialization
function initializeHeader() {
  const header = document.getElementById("main-header");
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      if (!header.classList.contains("header-bg")) {
        header.classList.add("header-bg");
        const logo = header.querySelector("#logo img");
        if (logo) {
          gsap.to(logo, { scale: 0.9, duration: 0.3, ease: "power2.out" });
        }
      }
    } else {
      if (header.classList.contains("header-bg")) {
        header.classList.remove("header-bg");
        const logo = header.querySelector("#logo img");
        if (logo) {
          gsap.to(logo, { scale: 1, duration: 0.3, ease: "power2.out" });
        }
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", updateHeader, { passive: true });

  // Initial animations
  gsap.fromTo(
    header,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
  );

  gsap.fromTo(
    "#mainmenu a",
    { opacity: 0, y: -20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      delay: 1,
    }
  );

  gsap.fromTo(
    "#logo",
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.7 }
  );

  gsap.fromTo(
    ".fx-slide",
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", delay: 1.5 }
  );

  const menuBtn = document.getElementById("menu-btn");
  if (menuBtn) {
    gsap.fromTo(
      menuBtn,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", delay: 1.3 }
    );
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuPanel = document.getElementById("menu-panel");
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");
  let menuOpen = false;

  if (!menuBtn || !mobileMenu || !menuPanel) {
    console.error("Mobile menu elements not found!");
    return;
  }

  menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  if (menuOverlay) {
    menuOverlay.addEventListener("click", function (e) {
      if (e.target === menuOverlay) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) {
      closeMobileMenu();
    }
  });

  function toggleMobileMenu() {
    if (menuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    menuOpen = true;
    mobileMenu.style.display = "block";

    if (menuOverlay) menuOverlay.style.opacity = "0";
    if (menuPanel) menuPanel.style.transform = "translateX(100%)";

    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline();

      tl.to(menuOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          menuPanel,
          {
            x: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.1"
        )
        .fromTo(
          ".mobile-menu-item",
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );

      if (line1 && line2 && line3) {
        gsap.to(line1, {
          rotation: 45,
          y: 6,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(line2, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.out",
        });
        gsap.to(line3, {
          rotation: -45,
          y: -6,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    } else {
      if (menuOverlay) menuOverlay.style.opacity = "1";
      if (menuPanel) menuPanel.style.transform = "translateX(0)";
    }

    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!menuOpen) return;

    menuOpen = false;

    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline({
        onComplete: () => {
          mobileMenu.style.display = "none";
        },
      });

      tl.to(".mobile-menu-item", {
        opacity: 0,
        x: 50,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in",
      })
        .to(
          menuPanel,
          {
            x: "100%",
            duration: 0.4,
            ease: "power3.in",
          },
          "-=0.1"
        )
        .to(
          menuOverlay,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          "-=0.2"
        );

      if (line1 && line2 && line3) {
        gsap.to(line1, {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(line2, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
          delay: 0.1,
        });
        gsap.to(line3, {
          rotation: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    } else {
      mobileMenu.style.display = "none";
    }

    document.body.style.overflow = "";
  }

  window.closeMobileMenu = closeMobileMenu;

  const menuLinks = mobileMenu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(closeMobileMenu, 150);
    });
  });
}

// Scroll Effects
function initializeScrollEffects() {
  const scrollToTopContainer = document.querySelector(
    ".scroll-to-top-container"
  );
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollBarV = document.querySelector(".scrollbar-v");

  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress * 100;
      if (scrollProgress) {
        scrollProgress.style.height = progress + "%";
      }
    },
  });

  ScrollTrigger.create({
    trigger: "body",
    start: "200px top",
    end: "bottom bottom",
    onUpdate: (self) => {
      if (scrollToTopContainer && scrollBarV) {
        if (self.isActive) {
          scrollToTopContainer.style.opacity = "1";
          scrollBarV.style.opacity = "1";
        } else {
          scrollToTopContainer.style.opacity = "0";
          scrollBarV.style.opacity = "0";
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: "#section-hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const yPos = -(self.progress * 50);
      const heroContainer = document.querySelector("#jarallax-container-0");
      if (heroContainer) {
        heroContainer.style.transform = `translateY(${yPos}px)`;
      }
    },
  });
}

// Scroll to Top Function
function scrollToTop() {
  if (isScrolling) return;

  isScrolling = true;
  const scrollBtn = document.querySelector(".scroll-to-top-container .group");

  gsap.to(scrollBtn, {
    scale: 0.9,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });

  const arrow = scrollBtn.querySelector("i");
  gsap.to(arrow, {
    rotation: 360,
    duration: 0.6,
    ease: "power2.out",
    transformOrigin: "center",
  });

  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: 0 },
    ease: "power3.inOut",
    onComplete: () => {
      isScrolling = false;
    },
  });
}

// Ticket Generation
function generateTickets() {
  const container = document.getElementById("tickets-container");
  if (!container) return;

  ticketsData.forEach((ticket) => {
    const ticketHTML = createTicketHTML(ticket);
    container.appendChild(ticketHTML);
  });

  ticketsData.forEach((ticket) => {
    updateTicketAvailabilityDisplay(ticket.id);
  });
}

function createTicketHTML(ticket) {
  const ticketDiv = document.createElement("div");
  ticketDiv.className = "ticket-item";
  ticketDiv.innerHTML = `
        <div class="relative overflow-hidden h-full border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group ticket-card" data-ticket-card="${
          ticket.id
        }">
            <div class="absolute bottom-0 w-full h-1/2 bg-primary-gradient opacity-30"></div>
            <div class="p-8 pb-32 z-10 relative">
                <div class="text-center">
                    <h2 class="text-3xl mb-2 font-bold text-white">${
                      ticket.name
                    }</h2>
                    <div class="flex items-center justify-center mb-4">
                        <h3 class="text-primary text-2xl font-bold" id="price-display-${
                          ticket.id
                        }">${ticket.price.toLocaleString()}</h3>
                        <span class="text-white/40 ml-2" id="quantity-multiplier-${
                          ticket.id
                        }" style="display: none;">x <span id="current-quantity-${
    ticket.id
  }">0</span></span>
                    </div>
                    <h4 class="mb-4 text-white/80">Benefits:</h4>
                </div>

                <div class="border-b border-white/20 mb-4"></div>

                <ul class="ul-check mb-4 space-y-3">
                    ${ticket.benefits
                      .map(
                        (benefit) => `
                        <li class="text-white/80 text-sm leading-relaxed">${benefit}</li>
                    `
                      )
                      .join("")}
                </ul>
                
                <div class="text-center text-sm text-white/60 mt-4" id="availability-${
                  ticket.id
                }">
                    ${ticket.currentAvailable} tickets available
                </div>
            </div>

            <div class="absolute bottom-0 left-0 p-6 z-10 w-full">
                <div class="flex items-center justify-center space-x-3 mb-4">
                    <button onclick="changeQuantity('${
                      ticket.id
                    }', -1)" data-quantity-btn="${
    ticket.id
  }" class="d-minus -mt-1.5 cursor-pointer text-white text-2xl w-9 h-9 py-1 px-1 inline-block align-middle text-center select-none bg-primary hover:bg-secondary transition-colors duration-300 rounded">−</button>
                    <div class="flex flex-col items-center">
                        <input type="number" id="quantity-${
                          ticket.id
                        }" class="w-10 text-center text-xl p-1 bg-transparent text-white border border-primary rounded-none" value="0" min="0" max="${
    ticket.currentAvailable
  }" onchange="updateTicketDisplay('${ticket.id}')">
                    </div>
                    <button onclick="changeQuantity('${
                      ticket.id
                    }', 1)" data-quantity-btn="${
    ticket.id
  }" class="d-plus -mt-1.5 cursor-pointer text-white text-2xl w-9 h-9 py-1 px-1 inline-block align-middle text-center select-none bg-primary hover:bg-secondary transition-colors duration-300 rounded">+</button>
                </div>
                
                <button onclick="addToCart('${ticket.id}')" data-add-to-cart="${
    ticket.id
  }" class="w-full bg-primary hover:bg-primary/80 text-white py-2 px-4 font-bold text-xs uppercase tracking-wider rounded-md transition-all duration-300 flex items-center justify-center">
                    <i class="fas fa-cart-plus mr-2"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    `;

  return ticketDiv;
}

// Update Ticket Display
function updateTicketDisplay(ticketId) {
  const quantityInput = document.getElementById(`quantity-${ticketId}`);
  const priceDisplay = document.getElementById(`price-display-${ticketId}`);
  const quantityMultiplier = document.getElementById(
    `quantity-multiplier-${ticketId}`
  );
  const currentQuantitySpan = document.getElementById(
    `current-quantity-${ticketId}`
  );

  const ticket = ticketsData.find((t) => t.id === ticketId);
  let quantity = parseInt(quantityInput.value) || 0;

  quantity = Math.max(0, Math.min(quantity, ticket.currentAvailable));
  quantityInput.value = quantity;

  if (quantity > 0) {
    const totalPrice = ticket.price * quantity;
    priceDisplay.textContent = `${totalPrice.toLocaleString()}`;
    quantityMultiplier.style.display = "inline";
    currentQuantitySpan.textContent = quantity;
  } else {
    priceDisplay.textContent = `${ticket.price.toLocaleString()}`;
    quantityMultiplier.style.display = "none";
  }
}

// Change Quantity
function changeQuantity(ticketId, change) {
  const input = document.getElementById(`quantity-${ticketId}`);
  const ticket = ticketsData.find((t) => t.id === ticketId);

  if (!ticket || ticket.currentAvailable === 0) return;

  let currentValue = parseInt(input.value) || 0;
  const max = ticket.currentAvailable;

  const newValue = Math.max(0, Math.min(currentValue + change, max));
  input.value = newValue;

  updateTicketDisplay(ticketId);
}

// Add to Cart
function addToCart(ticketId) {
  const quantityInput = document.getElementById(`quantity-${ticketId}`);
  const quantity = parseInt(quantityInput.value) || 0;
  const ticket = ticketsData.find((t) => t.id === ticketId);

  if (quantity === 0) {
    showToast("Please select a quantity first!", "error");
    return;
  }

  if (ticket.currentAvailable < quantity) {
    showToast(`Only ${ticket.currentAvailable} tickets available!`, "error");
    return;
  }

  const sourceElement = quantityInput.closest(".ticket-card");
  const cartSection = document.querySelector("#section-tickets .lg\\:w-1\\/3");

  createDragAnimation(sourceElement, cartSection, quantity, ticket.name);

  updateTicketAvailability(ticketId, quantity);

  if (cart[ticketId]) {
    cart[ticketId].quantity += quantity;
  } else {
    cart[ticketId] = {
      ...ticket,
      quantity: quantity,
    };
  }

  quantityInput.value = 0;
  updateTicketDisplay(ticketId);

  setTimeout(() => {
    updateCartDisplay();
    showToast("Added to cart successfully!", "success");
  }, 800);
}

// Create Drag Animation
function createDragAnimation(
  sourceElement,
  targetElement,
  quantity,
  ticketName
) {
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const dragItem = document.createElement("div");
  dragItem.className = "drag-item";
  dragItem.textContent = `${quantity}x ${ticketName}`;

  dragItem.style.left = sourceRect.left + sourceRect.width / 2 + "px";
  dragItem.style.top = sourceRect.top + sourceRect.height / 2 + "px";
  dragItem.style.transform = "translate(-50%, -50%) scale(0)";

  document.body.appendChild(dragItem);

  gsap
    .timeline()
    .to(dragItem, { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
    .to(dragItem, {
      x:
        targetRect.left +
        targetRect.width / 2 -
        sourceRect.left -
        sourceRect.width / 2,
      y:
        targetRect.top +
        targetRect.height / 2 -
        sourceRect.top -
        sourceRect.height / 2,
      duration: 0.8,
      ease: "power2.inOut",
    })
    .to(dragItem, {
      scale: 0.5,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        dragItem.remove();
      },
    });
}

// Remove from Cart
function removeFromCart(ticketId) {
  if (!cart[ticketId]) {
    showToast("Item not found in cart!", "error");
    return;
  }

  const itemName = cart[ticketId].name;
  const removedQuantity = cart[ticketId].quantity;
  const cartItemElement = document.querySelector(
    `[data-ticket-id="${ticketId}"]`
  );

  if (cartItemElement) {
    gsap.to(cartItemElement, {
      x: 100,
      opacity: 0,
      height: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        updateTicketAvailability(ticketId, -removedQuantity);
        delete cart[ticketId];
        updateCartDisplay();
        showToast(`${itemName} removed from cart`, "info");
      },
    });
  } else {
    updateTicketAvailability(ticketId, -removedQuantity);
    delete cart[ticketId];
    updateCartDisplay();
    showToast(`${itemName} removed from cart`, "info");
  }
}

// Update Cart Quantity
function updateCartQuantity(ticketId, newQuantity) {
  const ticket = ticketsData.find((t) => t.id === ticketId);
  const currentCartQuantity = cart[ticketId] ? cart[ticketId].quantity : 0;

  if (newQuantity <= 0) {
    removeFromCart(ticketId);
    return;
  }

  const quantityDifference = newQuantity - currentCartQuantity;

  if (quantityDifference > 0 && ticket.currentAvailable < quantityDifference) {
    showToast(
      `Only ${ticket.currentAvailable} more tickets available!`,
      "error"
    );
    return;
  }

  updateTicketAvailability(ticketId, quantityDifference);
  cart[ticketId].quantity = newQuantity;
  updateCartDisplay();
}

// Update Cart Display
function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const emptyMessage = document.getElementById("empty-cart-message");
  const totalSection = document.getElementById("cart-total-section");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems) return;

  const itemsInCart = Object.keys(cart);
  const totalQuantity = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartCount) {
    gsap.to(cartCount, {
      scale: 1.3,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        cartCount.textContent = totalQuantity;
      },
    });
  }

  if (itemsInCart.length === 0) {
    if (emptyMessage) {
      emptyMessage.style.display = "block";
      gsap.to(emptyMessage, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (totalSection) {
      gsap.to(totalSection, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          totalSection.classList.add("hidden");
        },
      });
    }

    cartItems.innerHTML = "";
  } else {
    if (emptyMessage) {
      gsap.to(emptyMessage, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          emptyMessage.style.display = "none";
        },
      });
    }

    if (totalSection) {
      totalSection.classList.remove("hidden");
      gsap.fromTo(
        totalSection,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }

    cartItems.innerHTML = "";

    Object.entries(cart).forEach(([id, item], index) => {
      const itemTotal = item.price * item.quantity;
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className =
        "cart-item flex items-center justify-between border-b border-white/20 py-3 opacity-0 transform translate-y-4";
      cartItemDiv.setAttribute("data-ticket-id", id);

      cartItemDiv.innerHTML = `
                <div class="flex-1">
                    <h5 class="mb-1 text-white font-semibold text-sm">${
                      item.name
                    }</h5>
                    <div class="flex items-center space-x-2 text-xs">
                        <span class="text-primary font-bold">${
                          item.price
                        }</span>
                        <span class="text-white/40">×</span>
                        <div class="flex items-center space-x-1">
                            <button onclick="updateCartQuantity('${id}', ${
        item.quantity - 1
      })" class="quantity-btn d-minus cursor-pointer text-white text-lg w-7 h-7 py-0.5 px-0.5 inline-block align-middle text-center select-none bg-primary hover:bg-secondary transition-colors duration-300 rounded transform hover:scale-110">−</button>
                            <span class="text-white font-bold w-8 text-center">${
                              item.quantity
                            }</span>
                            <button onclick="updateCartQuantity('${id}', ${
        item.quantity + 1
      })" class="quantity-btn d-plus cursor-pointer text-white text-lg w-7 h-7 py-0.5 px-0.5 inline-block align-middle text-center select-none bg-primary hover:bg-secondary transition-colors duration-300 rounded transform hover:scale-110">+</button>
                        </div>
                    </div>
                </div>
                <div class="text-right ml-4">
                    <p class="font-bold text-white mb-1 text-sm">${itemTotal.toLocaleString()}</p>
                    <button onclick="removeFromCart('${id}')" class="remove-btn text-red-400 hover:text-red-300 transition-colors duration-300 text-xs transform hover:scale-105" data-ticket-id="${id}">
                        <i class="fas fa-trash mr-1"></i>Remove
                    </button>
                </div>
            `;

      cartItems.appendChild(cartItemDiv);

      gsap.to(cartItemDiv, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: index * 0.1,
        ease: "power2.out",
      });
    });

    if (cartTotal) {
      gsap.to(cartTotal, {
        scale: 1.1,
        color: "#764DF0",
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          cartTotal.textContent = `${totalPrice.toLocaleString()}`;
          gsap.set(cartTotal, { color: "#ffffff" });
        },
      });
    }
  }

  saveToStorage();
}

// Clear Cart
function clearCart() {
  if (Object.keys(cart).length === 0) {
    showToast("Cart is already empty!", "info");
    return;
  }

  if (confirm("Are you sure you want to clear your cart?")) {
    const cartItems = document.getElementById("cart-items");
    const cartItemElements = cartItems.querySelectorAll(".cart-item");

    if (cartItemElements.length > 0) {
      gsap.to(cartItemElements, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          Object.entries(cart).forEach(([ticketId, item]) => {
            updateTicketAvailability(ticketId, -item.quantity);
          });

          cart = {};
          updateCartDisplay();
          showToast("Cart cleared successfully!", "success");
        },
      });
    } else {
      Object.entries(cart).forEach(([ticketId, item]) => {
        updateTicketAvailability(ticketId, -item.quantity);
      });

      cart = {};
      updateCartDisplay();
      showToast("Cart cleared successfully!", "success");
    }
  }
}

// Checkout
function checkout() {
  if (Object.keys(cart).length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalQuantity = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (
    confirm(
      `Checkout ${totalQuantity} tickets for ${totalPrice.toLocaleString()}?`
    )
  ) {
    showToast("Redirecting to payment...", "info");
    setTimeout(() => {
      cart = {};
      updateCartDisplay();
      showToast("Purchase successful! Thank you!", "success");
    }, 2000);
  }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
  document.addEventListener("click", function (e) {
    if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
      e.preventDefault();
      const link = e.target.matches('a[href^="#"]')
        ? e.target
        : e.target.closest('a[href^="#"]');
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: target, offsetY: 100 },
          ease: "power3.inOut",
        });
      }
    }
  });
}

// Reveal Animations
function initializeRevealAnimations() {
  ScrollTrigger.batch(".ticket-item", {
    onEnter: (elements) => {
      elements.forEach((element, index) => {
        gsap.set(element, { opacity: 0, y: 50, rotationX: -15, scale: 0.9 });
        gsap.to(element, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: index * 0.15,
        });
      });
    },
    start: "top 85%",
    once: true,
  });
}

// Creative Cursor
function initializeCreativeCursor() {
  const cursor = document.querySelector(".creative-cursor");
  if (!cursor) return;

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 6 + "px";
    cursor.style.top = e.clientY - 6 + "px";
  });
}

// Ticket Cards Hover
function initializeTicketCardsHover() {
  document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".ticket-card");

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distance = Math.sqrt(
        Math.pow(mouseX - cardCenterX, 2) + Math.pow(mouseY - cardCenterY, 2)
      );

      if (distance < 200) {
        const rotateX = (mouseY - cardCenterY) / 30;
        const rotateY = (cardCenterX - mouseX) / 30;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          z: 20,
          duration: 0.3,
          ease: "power2.out",
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
        });
      } else {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  });
}

// Enhanced Toast System
function showToast(message, type = "success") {
  const toast = document.getElementById("success-toast");
  if (!toast) {
    console.error("Toast element not found!");
    return;
  }

  const toastMessage = toast.querySelector("span");
  const icon = toast.querySelector("i");

  // تحديث النص
  if (toastMessage) {
    toastMessage.textContent = message;
  } else {
    console.warn("Toast message element not found");
  }

  // إيقاف أي أنيمشن سابق
  gsap.killTweensOf(toast);

  // تحديد النوع والألوان
  if (type === "success") {
    toast.className =
      "fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-[1001]";
    if (icon) icon.className = "fas fa-check-circle mr-2";
  } else if (type === "error") {
    toast.className =
      "fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-[1001]";
    if (icon) icon.className = "fas fa-exclamation-circle mr-2";
  } else if (type === "info") {
    toast.className =
      "fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-[1001]";
    if (icon) icon.className = "fas fa-info-circle mr-2";
  }

  // أنيمشن الظهور باستخدام GSAP
  gsap.fromTo(
    toast,
    {
      x: 400,
      opacity: 0,
      scale: 0.8,
    },
    {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      onComplete: () => {
        // الاختفاء التلقائي بعد 3 ثواني
        setTimeout(() => {
          gsap.to(toast, {
            x: 400,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
          });
        }, 3000);
      },
    }
  );

  // إضافة إمكانية الإغلاق اليدوي
  const closeHandler = function () {
    gsap.to(toast, {
      x: 400,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
    });
    toast.removeEventListener("click", closeHandler);
  };

  toast.addEventListener("click", closeHandler);
}

// دالة إغلاق التوست
function closeToast() {
  const toast = document.getElementById("success-toast");
  if (!toast) return;

  gsap.to(toast, {
    x: 400,
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "power2.in",
  });
}

// تحسين دالة إضافة للسلة لاختبار التوست
function addToCart(ticketId) {
  console.log("Adding to cart:", ticketId); // للتشخيص

  const quantityInput = document.getElementById(`quantity-${ticketId}`);
  if (!quantityInput) {
    console.error("Quantity input not found for:", ticketId);
    showToast("Error: Could not find quantity input!", "error");
    return;
  }

  const quantity = parseInt(quantityInput.value) || 0;
  const ticket = ticketsData.find((t) => t.id === ticketId);

  if (!ticket) {
    console.error("Ticket not found:", ticketId);
    showToast("Error: Ticket not found!", "error");
    return;
  }

  if (quantity === 0) {
    showToast("Please select a quantity first!", "error");
    return;
  }

  if (ticket.currentAvailable < quantity) {
    showToast(`Only ${ticket.currentAvailable} tickets available!`, "error");
    return;
  }

  console.log("Creating drag animation..."); // للتشخيص

  const sourceElement = quantityInput.closest(".ticket-card");
  const cartSection = document.querySelector("#section-tickets .lg\\:w-1\\/3");

  if (sourceElement && cartSection) {
    createDragAnimation(sourceElement, cartSection, quantity, ticket.name);
  }

  // تحديث المخزون
  updateTicketAvailability(ticketId, quantity);

  // إضافة للسلة
  if (cart[ticketId]) {
    cart[ticketId].quantity += quantity;
  } else {
    cart[ticketId] = {
      ...ticket,
      quantity: quantity,
    };
  }

  quantityInput.value = 0;
  updateTicketDisplay(ticketId);

  console.log("Showing success toast..."); // للتشخيص

  // تحديث العرض وإظهار التوست
  setTimeout(() => {
    updateCartDisplay();
    showToast("Added to cart successfully!", "success");
  }, 800);
}

// Heading Animation
function initializeHeadingAnimation() {
  const letters = document.querySelectorAll(".letter");
  if (letters.length === 0) return;

  gsap.to(".letter", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: { amount: 0.6, from: "start" },
    delay: 1.5,
  });
}

// Interactive Letters
function initializeInteractiveLetters() {
  const letters = document.querySelectorAll(".interactive-letter");
  const container = document.getElementById("animated-heading");

  if (!letters.length || !container) return;

  container.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    letters.forEach((letter, index) => {
      const letterRect = letter.getBoundingClientRect();
      const letterCenterX = letterRect.left + letterRect.width / 2;
      const letterCenterY = letterRect.top + letterRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mouseX - letterCenterX, 2) +
          Math.pow(mouseY - letterCenterY, 2)
      );

      const maxDistance = 100;
      const influence = Math.max(0, 1 - distance / maxDistance);

      if (influence > 0) {
        const angle = Math.atan2(
          mouseY - letterCenterY,
          mouseX - letterCenterX
        );
        const pushX = Math.cos(angle) * influence * 15;
        const pushY = Math.sin(angle) * influence * 15;

        gsap.to(letter, {
          x: -pushX,
          y: -pushY,
          scale: 1 + influence * 0.1,
          color: `hsl(${250 + influence * 30}, 70%, ${60 + influence * 20}%)`,
          textShadow: `0 0 ${influence * 20}px rgba(118, 77, 240, ${
            influence * 0.8
          })`,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(letter, {
          x: 0,
          y: 0,
          scale: 1,
          color: "#ffffff",
          textShadow: "none",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  });

  container.addEventListener("mouseleave", () => {
    letters.forEach((letter) => {
      gsap.to(letter, {
        x: 0,
        y: 0,
        scale: 1,
        color: "#ffffff",
        textShadow: "none",
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });
}
