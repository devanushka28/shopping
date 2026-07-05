/* =====================================================
   ANUSHKA'S SHOPPING STORE - JAVASCRIPT
   This file makes the website interactive.
   ===================================================== */

/* ---------- HELPER: create a simple product image ----------
   Instead of loading pictures from the internet, we draw a small
   SVG image using code. This keeps the website working even
   without an internet connection. */
function makeProductImage(emoji, color1, color2) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)" />
      <text x="50%" y="55%" font-size="90" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/* ---------- PRODUCT DATA ----------
   This array holds all the products shown on the website.
   Each product is a simple object with id, name, price, etc. */
const products = [
  {
    id: 1,
    name: "Running Shoes",
    desc: "Comfortable shoes for daily running.",
    price: 1999,
    category: "Footwear",
    rating: 4,
    sold: 3120,
    image: makeProductImage("👟", "#1d4ed8", "#2563eb"),
  },
  {
    id: 2,
    name: "Wireless Headphones",
    desc: "Enjoy music with amazing sound quality.",
    price: 2499,
    category: "Electronics",
    rating: 5,
    sold: 8597,
    image: makeProductImage("🎧", "#d97706", "#f59e0b"),
  },
  {
    id: 3,
    name: "Travel Backpack",
    desc: "Spacious backpack for school and travel.",
    price: 1299,
    category: "Bags",
    rating: 4,
    sold: 2210,
    image: makeProductImage("🎒", "#2563eb", "#3b82f6"),
  },
  {
    id: 4,
    name: "Smart Watch",
    desc: "Track your fitness and notifications.",
    price: 3499,
    category: "Accessories",
    rating: 5,
    sold: 5430,
    image: makeProductImage("⌚", "#f59e0b", "#fbbf24"),
  },
  {
    id: 5,
    name: "Cotton T-Shirt",
    desc: "Soft and stylish t-shirt for everyday wear.",
    price: 599,
    category: "Fashion",
    rating: 4,
    sold: 8597,
    image: makeProductImage("👕", "#1d4ed8", "#2563eb"),
  },
  {
    id: 6,
    name: "Laptop",
    desc: "Powerful laptop for study and work.",
    price: 45999,
    category: "Electronics",
    rating: 5,
    sold: 1875,
    image: makeProductImage("💻", "#d97706", "#f59e0b"),
  },
  {
    id: 7,
    name: "Water Bottle",
    desc: "Keeps water cool for hours.",
    price: 399,
    category: "Accessories",
    rating: 4,
    sold: 4360,
    image: makeProductImage("🚰", "#2563eb", "#3b82f6"),
  },
  {
    id: 8,
    name: "Smartphone",
    desc: "Latest smartphone with great camera.",
    price: 15999,
    category: "Electronics",
    rating: 5,
    sold: 2960,
    image: makeProductImage("📱", "#f59e0b", "#fbbf24"),
  },
];

/* ---------- CATEGORY DATA ----------
   Used to build the "All Categories" row. Clicking a category
   filters the product grid below. */
const categories = [
  { name: "Electronics", emoji: "💻", color: "#fde2e2" },
  { name: "Fashion", emoji: "👕", color: "#d9f5ec" },
  { name: "Footwear", emoji: "👟", color: "#fff3cd" },
  { name: "Accessories", emoji: "⌚", color: "#dbeafe" },
  { name: "Bags", emoji: "🎒", color: "#f5e6d3" },
];

// Currently selected category filter (null means "show all")
let activeCategory = null;

/* ---------- CART DATA ----------
   This array stores the products the user has added to cart. */
let cart = [];

/* ---------- GRAB ELEMENTS FROM THE PAGE ---------- */
const productGrid = document.getElementById("product-grid");
const categoryRow = document.getElementById("category-row");
const noProductsMsg = document.getElementById("no-products-msg");
const cartItemsBox = document.getElementById("cart-items");
const emptyCartMsg = document.getElementById("empty-cart-msg");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const cartIcon = document.getElementById("cart-icon");
const searchBox = document.getElementById("search-box");
const themeToggleBtn = document.getElementById("theme-toggle");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const scrollTopBtn = document.getElementById("scroll-top-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const modalOverlay = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal-btn");
const confettiContainer = document.getElementById("confetti-container");
const pageLoader = document.getElementById("page-loader");

/* =====================================================
   1. DISPLAY PRODUCTS ON THE PAGE
   ===================================================== */
function displayProducts(list) {
  productGrid.innerHTML = ""; // clear old cards first

  // Show/hide the "no products found" message
  noProductsMsg.style.display = list.length === 0 ? "block" : "none";

  list.forEach((product, index) => {
    // Create a card for each product
    const card = document.createElement("div");
    card.className = "product-card";
    // Small delay for each card so they slide up one by one
    card.style.animationDelay = `${index * 0.1}s`;

    // Build the star rating text, e.g. ★★★★☆
    const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-body">
        <h3>${product.name}</h3>
        <p class="desc">${product.desc}</p>
        <div class="card-meta-row">
          <span class="price">₹${product.price}</span>
          <span class="stars">${stars}</span>
        </div>
        <p class="sold">${product.sold} Sold</p>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* =====================================================
   2. CATEGORY ROW (clicking a category filters products)
   ===================================================== */
function displayCategories() {
  categoryRow.innerHTML = "";

  // "All" is a built-in chip (not part of the data list) that clears the filter
  const allChip = { name: "All", emoji: "🛍️", color: "#e5e7eb" };
  const chips = [allChip, ...categories];

  chips.forEach((category, index) => {
    // Count how many products belong to this category (or all, for the "All" chip)
    const count =
      category.name === "All"
        ? products.length
        : products.filter((p) => p.category === category.name).length;

    const isActive = activeCategory ? category.name === activeCategory : category.name === "All";

    const item = document.createElement("button");
    item.className = "category-item" + (isActive ? " active" : "");
    item.dataset.category = category.name;
    item.style.animationDelay = `${index * 0.08}s`;

    item.innerHTML = `
      <span class="category-circle-wrap">
        <span class="category-circle" style="background:${category.color}">${category.emoji}</span>
        <span class="category-count">${count}</span>
      </span>
      <span class="category-label">${category.name}</span>
    `;

    categoryRow.appendChild(item);
  });
}

categoryRow.addEventListener("click", (event) => {
  const item = event.target.closest(".category-item");
  if (!item) return;

  const clickedCategory = item.dataset.category;

  // Clicking "All" clears the filter, otherwise filter by that category
  activeCategory = clickedCategory === "All" ? null : clickedCategory;

  // Highlight whichever chip was just clicked
  categoryRow.querySelectorAll(".category-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.category === clickedCategory);
  });

  applyFilters();
});

/* =====================================================
   3. SEARCH + CATEGORY FILTERING (extra feature)
   ===================================================== */
function applyFilters() {
  const searchTerm = searchBox.value.toLowerCase().trim();

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !activeCategory || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

searchBox.addEventListener("input", applyFilters);

/* =====================================================
   3. ADD TO CART BUTTON CLICKS (using event delegation)
   ===================================================== */
productGrid.addEventListener("click", (event) => {
  // Only run this code if an "Add to Cart" button was clicked
  if (!event.target.classList.contains("add-to-cart-btn")) return;

  createRipple(event); // ripple/glow effect on click

  const productId = Number(event.target.dataset.id);
  addToCart(productId);
});

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  // Check if this product is already in the cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1; // increase quantity
  } else {
    cart.push({ ...product, quantity: 1 }); // add new item
  }

  updateCartDisplay();
  bounceCartIcon();
}

/* =====================================================
   5. RIPPLE EFFECT FOR BUTTONS
   ===================================================== */
function createRipple(event) {
  const button = event.target;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.classList.add("ripple");

  button.appendChild(ripple);

  // Remove the ripple element after the animation finishes
  setTimeout(() => ripple.remove(), 600);
}

/* =====================================================
   6. CART ICON BOUNCE ANIMATION
   ===================================================== */
function bounceCartIcon() {
  cartIcon.classList.add("bounce");
  setTimeout(() => cartIcon.classList.remove("bounce"), 500);
}

/* =====================================================
   7. UPDATE CART DISPLAY
   ===================================================== */
function updateCartDisplay() {
  cartItemsBox.innerHTML = "";

  // Update the small counter badge on the cart icon
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;

  // Show empty cart message if there are no items
  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
  } else {
    emptyCartMsg.style.display = "none";

    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "cart-item";

      cartItemDiv.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <span>₹${item.price} x ${item.quantity}</span>
          </div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          <button class="remove-btn" data-action="remove" data-id="${item.id}">🗑️</button>
        </div>
      `;

      cartItemsBox.appendChild(cartItemDiv);
    });
  }

  // Calculate and display the total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = total;
}

/* =====================================================
   8. HANDLE QUANTITY BUTTONS & REMOVE BUTTON IN CART
   ===================================================== */
cartItemsBox.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;
  const item = cart.find((p) => p.id === productId);

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((p) => p.id !== productId); // remove if quantity hits 0
    }
  } else if (action === "remove") {
    cart = cart.filter((p) => p.id !== productId);
  }

  updateCartDisplay();
});

/* =====================================================
   9. DARK MODE TOGGLE (extra feature)
   ===================================================== */
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Change the icon depending on the current mode
  themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

/* =====================================================
   10. MOBILE HAMBURGER MENU
   ===================================================== */
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close the mobile menu when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* =====================================================
   11. SCROLL TO TOP BUTTON (extra feature)
   ===================================================== */
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =====================================================
   12. CHECKOUT / PLACE ORDER MODAL
   ===================================================== */
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some products before checking out.");
    return;
  }

  modalOverlay.classList.add("active");
  launchConfetti();

  // Empty the cart after placing the order
  cart = [];
  updateCartDisplay();
});

closeModalBtn.addEventListener("click", closeModal);

// Also close modal if user clicks outside the modal box
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("active");
  confettiContainer.innerHTML = ""; // clear old confetti pieces
}

/* =====================================================
   13. CONFETTI CELEBRATION ANIMATION (pure CSS + JS)
   ===================================================== */
function launchConfetti() {
  const colors = ["#2563eb", "#f59e0b", "#22c55e", "#3b82f6", "#fbbf24"];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
    confettiContainer.appendChild(piece);
  }
}

/* =====================================================
   14. PAGE LOADING SPINNER
   ===================================================== */
window.addEventListener("load", () => {
  // Hide the loader shortly after everything has loaded
  setTimeout(() => {
    pageLoader.classList.add("hidden");
  }, 700);
});

/* =====================================================
   15. INITIAL SETUP WHEN PAGE STARTS
   ===================================================== */
displayProducts(products);
displayCategories();
updateCartDisplay();
