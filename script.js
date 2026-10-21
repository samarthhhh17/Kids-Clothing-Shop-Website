const products = [
  { id: 1, name: "Boys T-Shirt", category: "Boys", price: 299, image: "https://placehold.co/600x450/fde2e4/553344?text=Boys+T-Shirt" },
  { id: 2, name: "Girls Frock", category: "Girls", price: 499, image: "https://placehold.co/600x450/fadadd/553344?text=Girls+Frock" },
  { id: 3, name: "Baby Romper", category: "Baby", price: 349, image: "https://placehold.co/600x450/dbeafe/253858?text=Baby+Romper" },
  { id: 4, name: "Boys Jeans", category: "Boys", price: 599, image: "https://placehold.co/600x450/d1fae5/234b3b?text=Boys+Jeans" },
  { id: 5, name: "Girls Top", category: "Girls", price: 249, image: "https://placehold.co/600x450/fef3c7/6b4c16?text=Girls+Top" },
  { id: 6, name: "Baby Dress", category: "Baby", price: 399, image: "https://placehold.co/600x450/e9d5ff/49356c?text=Baby+Dress" }
];

let cart = [];
let selectedCategory = "All";

function displayProducts() {
  const searchTerm = document.getElementById("search").value.trim().toLowerCase();
  const filtered = products.filter(product =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm)
  );

  const container = document.getElementById("products");
  if (!filtered.length) {
    container.innerHTML = '<p class="empty">No products found. Try another search.</p>';
    return;
  }

  container.innerHTML = filtered.map(product => `
    <article class="product">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p class="category">${product.category} · Ages 1–6</p>
      <div class="product-bottom">
        <span class="price">₹${product.price}</span>
        <button class="add-button" onclick="addToCart(${product.id})">+ Add</button>
      </div>
    </article>
  `).join("");
}

function filterProducts(category, button) {
  selectedCategory = category;
  document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  displayProducts();
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  updateCart();
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== id);
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(product => product.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("count").textContent = count;
  document.getElementById("total").textContent = total;

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-row">
        <span><strong>${item.name}</strong><br>₹${item.price} each</span>
        <div class="quantity-controls">
          <button aria-label="Decrease ${item.name}" onclick="changeQuantity(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button aria-label="Increase ${item.name}" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <strong>₹${item.price * item.quantity}</strong>
        <button class="remove-button" onclick="removeItem(${item.id})">Remove</button>
      </div>
    `).join("")
    : '<p class="empty">Your cart is empty. Add something cute!</p>';
}

function showCart() {
  const cartSection = document.getElementById("cart");
  cartSection.hidden = false;
  cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideCart() {
  document.getElementById("cart").hidden = true;
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty. Please add a product first.");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Demo order placed! Total: ₹${total}\nThis website does not process real payments.`);
  cart = [];
  updateCart();
  hideCart();
}

document.getElementById("search").addEventListener("input", displayProducts);
displayProducts();
updateCart();
