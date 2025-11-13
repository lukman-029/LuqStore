
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));

const cartCount = document.getElementById('cart-count');

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartCount.textContent = total;
}
updateCartCount();


async function fetchProducts() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=200');
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

async function loadHomeProducts() {
  const container = document.getElementById('home-products');
  if (!container) return;

  const products = await fetchProducts();
  const featured = products.slice(0, 4);

  container.innerHTML = featured.map(product => `
    <div class="product-card">
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      ${product.discountPercentage ? `<p>Discount: ${product.discountPercentage}%</p>` : ''}
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <a href="product-details.html?id=${product.id}" class="btn-details">View Details</a>
    </div>
  `).join('');
}
loadHomeProducts();
async function loadAllProducts() {
  const container = document.getElementById('product-container');
  if (!container) return;

  const products = await fetchProducts();

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      ${product.discountPercentage ? `<p>Discount: ${product.discountPercentage}%</p>` : ''}
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <a href="product-details.html?id=${product.id}" class="btn-details">View Details</a>
    </div>
  `).join('');
}
loadAllProducts();

async function loadProductDetails() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const product = await res.json();

  container.innerHTML = `
    <div class="product-card detail">
      <img src="${product.thumbnail}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      ${product.discountPercentage ? `<p>Discount: ${product.discountPercentage}%</p>` : ''}
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;
}
loadProductDetails();

async function addToCart(productId) {
  const res = await fetch(`https://dummyjson.com/products/${productId}`);
  const product = await res.json();

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity = existing.quantity ? existing.quantity + 1 : 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}


function loadCart() {
  const container = document.getElementById('cart-container');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.thumbnail}" alt="${item.title}">
      <div class="cart-info">
        <h3>${item.title}</h3>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  totalEl.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}
loadCart();

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

const scrollUpBtn = document.getElementById('scrollUpBtn');
window.onscroll = function() {
  scrollUpBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
};

scrollUpBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;
let index = 0;

function nextSlide() {
  index++;
  if (index >= totalSlides) index = 0;
  slides.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
}
setInterval(nextSlide, 4000); 

