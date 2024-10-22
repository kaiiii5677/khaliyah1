const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

let attemptCount = 0; // Track login attempts
const MAX_ATTEMPTS = 3; // Maximum allowed attempts

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");

  const username = document.querySelector(".sign-in-form input[type='text']").value;
  const password = document.querySelector(".sign-in-form input[type='password']").value;

  // Simple validation
  if (username === "" || password === "") {
    alert("Please enter both username and password."); // Alert for empty fields
    return;
  }

  // Mock validation (replace this with real validation logic)
  if (username === "user" && password === "pass") { // Replace with your actual logic
    window.location.href = "products_page.html"; // Redirect to products page on successful login
  } else {
    attemptCount++; // Increment attempt count
    alert(`Incorrect username or password. Attempts left: ${MAX_ATTEMPTS - attemptCount}`);

    // Check if maximum attempts have been reached
    if (attemptCount >= MAX_ATTEMPTS) {
      window.location.href = "error_page.html"; // Redirect to error page
    }
  }
});

// Global arrays to store cart items and quantities
let cart = [];
let cartQuantities = [];
const TAX_RATE = 0.15; // 15% tax rate

// Products array
let products = [
    { id: 1, name: 'Jerk Chicken', price: 1500, stock: 50 },
    { id: 2, name: 'Jerk Chicken and Oxtail', price: 2600, stock: 30 },
    { id: 3, name: 'Coconut Curry Shrimp', price: 2600, stock: 25 },
    { id: 4, name: 'Charcuterie board', price: 3000, stock: 20 },
    { id: 5, name: 'Cheese board', price: 3000, stock: 20 },
    { id: 6, name: 'Jamaican Platter', price: 12000, stock: 15 },
    { id: 7, name: 'Breakfast Platter', price: 10000, stock: 15 },
    { id: 8, name: 'Buffet 1', price: 12000, stock: 10 },
    { id: 9, name: 'Seafood Buffet', price: 15000, stock: 10 },
    { id: 10, name: 'Oxtail Platter', price: 8000, stock: 20 },
    { id: 11, name: 'Whole Ham', price: 7000, stock: 15 },
    { id: 12, name: 'Jerk Chicken Platter', price: 8000, stock: 20 },
    { id: 13, name: 'Lobster Platter', price: 10000, stock: 15 },
    { id: 14, name: 'Mac & Cheese', price: 7000, stock: 25 },
    { id: 15, name: 'Raw Veggies', price: 4000, stock: 30 },
    { id: 16, name: 'Grilled Corn', price: 4000, stock: 30 },
    { id: 17, name: 'Kebabs', price: 5000, stock: 25 },
    { id: 18, name: 'Coconut Sorbet', price: 700, stock: 40 },
    { id: 19, name: 'Coconut Macaroon', price: 700, stock: 40 },
    { id: 20, name: 'Dessert Variety Platter', price: 8000, stock: 15 }
];


function addToCart(productId) {
    let product = products.find(p => p.id === productId);
    if (!product) return false;
    
    let existingIndex = cart.findIndex(item => item.id === product.id);
    
    // Check if we have enough stock
    if (existingIndex > -1) {
        if (product.stock > cartQuantities[existingIndex]) {
            cartQuantities[existingIndex]++;
            product.stock--;
        } else {
            alert("Sorry, no more stock available!");
            return false;
        }
    } else {
        if (product.stock > 0) {
            cart.push(product);
            cartQuantities.push(1);
            product.stock--;
        } else {
            alert("Sorry, this item is out of stock!");
            return false;
        }
    }
    
    updateCart();
    updateCartCount();
    return true;
}// Function to calculate subtotal
function calculateSubtotal() {
    return cart.reduce((sum, product, index) => {
        return sum + (product.price * cartQuantities[index]);
    }, 0);
}

// Function to calculate discount
function calculateDiscount(subtotal) {
    if (subtotal >= DISCOUNT_THRESHOLD) {
        return subtotal * DISCOUNT_RATE;
    }
    return 0;
}

// Function to calculate tax
function calculateTax(amountAfterDiscount) {
    return amountAfterDiscount * TAX_RATE;
}

// Function to calculate final total
function calculateTotal(subtotal, discount, tax) {
    return subtotal - discount + tax;
}

// Function to update cart display with calculations
function updateCart() {
    let cartDisplay = document.getElementById("cart-display");
    if (!cartDisplay) return;
    
    cartDisplay.innerHTML = '';
    
    // Display individual items
    cart.forEach((product, index) => {
        let itemSubtotal = product.price * cartQuantities[index];
        cartDisplay.innerHTML += `
            <div class="cart-item">
                <span>${product.name}</span>
                <span>Qty: ${cartQuantities[index]}</span>
                <span>Price: $${product.price.toFixed(2)}</span>
                <span>Subtotal: $${itemSubtotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    // Calculate and display totals
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const taxableAmount = subtotal - discount;
    const tax = calculateTax(taxableAmount);
    const total = calculateTotal(subtotal, discount, tax);

    // Add summary section
    cartDisplay.innerHTML += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Discount: -$${discount.toFixed(2)}</p>
            <p>Tax (15%): $${tax.toFixed(2)}</p>
            <h4>Total: $${total.toFixed(2)}</h4>
        </div>
    `;
}

// Function to remove item from cart
function removeFromCart(index) {
    // Return item to stock
    products.find(p => p.id === cart[index].id).stock += cartQuantities[index];
    
    // Remove from cart
    cart.splice(index, 1);
    cartQuantities.splice(index, 1);
    
    updateCart();
    updateCartCount();
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = cartQuantities.reduce((sum, qty) => sum + qty, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    }
}

// Function to generate invoice
function generateInvoice() {
    // Store cart data in sessionStorage to pass to invoice page
    const invoiceData = {
        items: cart.map((product, index) => ({
            ...product,
            quantity: cartQuantities[index],
            subtotal: product.price * cartQuantities[index]
        })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(calculateSubtotal()),
        tax: calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal())),
        total: calculateTotal(
            calculateSubtotal(),
            calculateDiscount(calculateSubtotal()),
            calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal()))
        ),
        date: new Date().toLocaleDateString(),
        invoiceNumber: generateInvoiceNumber()
    };
    
    sessionStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    window.location.href = 'invoice.html';
}

// Function to generate unique invoice number
function generateInvoiceNumber() {
    return 'INV-' + Date.now();
}

// Function to load and display invoice
function loadInvoice() {
    const invoiceDisplay = document.getElementById("invoice-display");
    if (!invoiceDisplay) return;
    
    const invoiceData = JSON.parse(sessionStorage.getItem('invoiceData'));
    if (!invoiceData) {
        invoiceDisplay.innerHTML = '<p>No invoice data found</p>';
        return;
    }
    
}
// Function to handle checkout button click
function handleCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    generateInvoice();
}

// Login System Functions
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.querySelector(".sign-in-form input[type='text']").value;
    const password = document.querySelector(".sign-in-form input[type='password']").value;

    // Validation for empty fields
    if (!username || !password) {
        showError("Please enter both username and password.");
        return;
    }

    // Mock validation (replace with real authentication)
    if (username === "user" && password === "pass") {
        window.location.href = "products_page.html";
    } else {
        attemptCount++;
        showError(`Invalid credentials. ${MAX_ATTEMPTS - attemptCount} attempts remaining.`);

        if (attemptCount >= MAX_ATTEMPTS) {
            window.location.href = "error_page.html";
        }
    }
}

function showError(message) {
    alert(message); // Replace with better UI feedback if desired
}

// Product Display Functions
function displayProducts() {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;

    productContainer.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="addToCart(${product.id})" 
                    ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `).join('');
}

// Cart Management Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        if (product.stock > 0) {
            cartQuantities[existingIndex]++;
            product.stock--;
        } else {
            showError("Sorry, item is out of stock!");
            return;
        }
    } else {
        if (product.stock > 0) {
            cart.push(product);
            cartQuantities.push(1);
            product.stock--;
        } else {
            showError("Sorry, item is out of stock!");
            return;
        }
    }

    updateCart();
    updateCartCount();
    displayProducts(); // Refresh product display to update stock
}

function removeFromCart(index) {
    // Return item to stock
    const product = products.find(p => p.id === cart[index].id);
    if (product) {
        product.stock += cartQuantities[index];
    }

    // Remove from cart
    cart.splice(index, 1);
    cartQuantities.splice(index, 1);

    updateCart();
    updateCartCount();
    displayProducts();
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        const totalItems = cartQuantities.reduce((sum, qty) => sum + qty, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Price Calculation Functions
function calculateSubtotal() {
    return cart.reduce((sum, product, index) => {
        return sum + (product.price * cartQuantities[index]);
    }, 0);
}

function calculateDiscount(subtotal) {
    return subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
}

function calculateTax(amountAfterDiscount) {
    return amountAfterDiscount * TAX_RATE;
}

function calculateTotal(subtotal, discount, tax) {
    return subtotal - discount + tax;
}

function updateCart() {
    const cartDisplay = document.getElementById("cart-display");
    if (!cartDisplay) return;

    cartDisplay.innerHTML = '';

    // Display cart items
    cart.forEach((product, index) => {
        const itemSubtotal = product.price * cartQuantities[index];
        cartDisplay.innerHTML += `
            <div class="cart-item">
                <span>${product.name}</span>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${cartQuantities[index]}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <span>$${itemSubtotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    // Calculate totals
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const taxableAmount = subtotal - discount;
    const tax = calculateTax(taxableAmount);
    const total = calculateTotal(subtotal, discount, tax);

    // Display summary
    cartDisplay.innerHTML += `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Discount (${DISCOUNT_RATE * 100}%): -$${discount.toFixed(2)}</p>
            <p>Tax (${TAX_RATE * 100}%): $${tax.toFixed(2)}</p>
            <h4>Total: $${total.toFixed(2)}</h4>
            <button onclick="handleCheckout()" 
                    ${cart.length === 0 ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
        </div>
    `;
}

function updateQuantity(index, change) {
    const newQuantity = cartQuantities[index] + change;
    const product = products.find(p => p.id === cart[index].id);

    if (newQuantity <= 0) {
        removeFromCart(index);
    } else if (change > 0 && product.stock > 0) {
        cartQuantities[index] = newQuantity;
        product.stock--;
        updateCart();
        updateCartCount();
        displayProducts();
    } else if (change < 0) {
        cartQuantities[index] = newQuantity;
        product.stock++;
        updateCart();
        updateCartCount();
        displayProducts();
    } else {
        showError("Sorry, not enough stock available!");
    }
}

// Invoice Generation Functions
function generateInvoiceNumber() {
    return 'INV-' + Date.now();
}

function handleCheckout() {
    if (cart.length === 0) {
        showError("Your cart is empty!");
        return;
    }

    const invoiceData = {
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toLocaleDateString(),
        items: cart.map((product, index) => ({
            ...product,
            quantity: cartQuantities[index],
            subtotal: product.price * cartQuantities[index]
        })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(calculateSubtotal()),
        tax: calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal())),
        total: calculateTotal(
            calculateSubtotal(),
            calculateDiscount(calculateSubtotal()),
            calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal()))
        )
    };

    sessionStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    window.location.href = 'invoice.html';
}

function loadInvoice() {
    const invoiceDisplay = document.getElementById("invoice-display");
    if (!invoiceDisplay) return;
    const invoiceData = JSON.parse(sessionStorage.getItem('invoiceData'));
    if (!invoiceData) {
        invoiceDisplay.innerHTML = '<p>No invoice data found</p>';
        return;
    }
    // You can keep other functions based on the current page
    document.addEventListener('DOMContentLoaded', () => {
        const currentPage = window.location.pathname;

        if (currentPage.includes('products_page.html')) {
            displayProducts();
            updateCart();
            updateCartCount();
        } else if (currentPage.includes('invoice.html')) {
            // Do something specific to invoice page, if needed
        }
    });
}
