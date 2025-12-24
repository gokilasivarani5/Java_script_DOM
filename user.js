let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let cartItemsData = [];

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function hideAllPanels() {
  document.querySelectorAll(".side").forEach(p => p.classList.add("hidden"));
}

function goBack() {
  hideAllPanels();
}

function renderStore() {
  const store = document.getElementById("store");
  store.innerHTML = "";

  products.forEach(p => {
    store.innerHTML += `
      <div class="card">
        <b>${p.name}</b>
        <p>&#8377;${p.price}</p>
        ${p.stock === 0 ? `<span class="badge">Out of Stock</span>` : ""}
        <div class="qty">
          <button onclick="changeQty(${p.id}, -1)">−</button>
          <span id="qty-${p.id}">0</span>
          <button onclick="changeQty(${p.id}, 1)" ${p.stock === 0 ? "disabled" : ""}>+</button>
        </div>
        <button class="primary" onclick="addToCart(${p.id})" ${p.stock === 0 ? "disabled" : ""}>
          Add to Cart
        </button>
      </div>`;
  });
}

function changeQty(id, diff) {
  const span = document.getElementById(`qty-${id}`);
  const product = products.find(p => p.id === id);
  let qty = +span.textContent + diff;

  if (qty < 0) qty = 0;
  if (qty > product.stock) return toast("Stock limit exceeded");

  span.textContent = qty;
}

function addToCart(id) {
  const qty = +document.getElementById(`qty-${id}`).textContent;
  if (!qty) return toast("Select quantity");

  const product = products.find(p => p.id === id);
  const existing = cartItemsData.find(i => i.id === id);

  if (existing) existing.qty += qty;
  else cartItemsData.push({ id, name: product.name, price: product.price, qty });

  document.getElementById(`qty-${id}`).textContent = 0;
  toast("Added to cart");
}

function openCart() {
  hideAllPanels();
  document.getElementById("cartPanel").classList.remove("hidden");
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  box.innerHTML = "";

  let total = 0;
  cartItemsData.forEach(i => {
    total += i.qty * i.price;
    box.innerHTML += `<p>${i.name} → ${i.qty} × &#8377;${i.price}</p>`;
  });

  totalEl.textContent = "Total: ₹" + total;
}

function openAddress() {
  document.getElementById("cartPanel").classList.add("hidden");
  document.getElementById("addressPanel").classList.remove("hidden");
}

function confirmOrder() {
  if (!custName.value || !custAddress.value) return toast("Fill all details");

  let total = 0;
  cartItemsData.forEach(c => {
    total += c.qty * c.price;
    const p = products.find(p => p.id === c.id);
    p.stock -= c.qty;
  });

  orders.push({
    customer: custName.value,
    address: custAddress.value,
    items: cartItemsData,
    total,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("orders", JSON.stringify(orders));

  cartItemsData = [];
  custName.value = custAddress.value = "";
  hideAllPanels();
  renderStore();
  toast("Order placed successfully");
}

function openAdmin() {
  hideAllPanels();
  document.getElementById("adminLogin").classList.remove("hidden");
}

function loginAdmin() {
  if (adminUser.value === "admin" && adminPass.value === "admin123") {
    location.href = "admin.html";
  } else {
    toast("Invalid admin login");
  }
  adminUser.value = adminPass.value = "";
}

renderStore();
