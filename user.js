let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let cart = [];

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
  products = JSON.parse(localStorage.getItem("products")) || [];
  const store = document.getElementById("store");
  store.innerHTML = "";

  products.forEach(p => {
    store.innerHTML += `
      <div class="card">
        <b>${p.name}</b>
        <p>₹${p.price}</p>
        ${p.stock === 0 ? `<span class="badge">Out of Stock</span>` : ""}
        <div class="qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span id="qty-${p.id}">0</span>
          <button onclick="changeQty(${p.id},1)" ${p.stock === 0 ? "disabled" : ""}>+</button>
        </div>
        <button class="primary" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>`;
  });
}

function changeQty(id, d) {
  const el = document.getElementById(`qty-${id}`);
  const p = products.find(x => x.id === id);
  let q = +el.textContent + d;
  if (q < 0) q = 0;
  if (q > p.stock) return toast("Stock limit");
  el.textContent = q;
}

function addToCart(id) {
  const qty = +document.getElementById(`qty-${id}`).textContent;
  if (!qty) return toast("Select quantity");

  const p = products.find(x => x.id === id);
  cart.push({ id, name: p.name, price: p.price, qty });
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
  let total = 0;
  box.innerHTML = "";
  cart.forEach(i => {
    total += i.qty * i.price;
    box.innerHTML += `<p>${i.name} → ${i.qty} × ₹${i.price}</p>`;
  });
  document.getElementById("cartTotal").textContent = "Total: ₹" + total;
}

function openAddress() {
  document.getElementById("cartPanel").classList.add("hidden");
  document.getElementById("addressPanel").classList.remove("hidden");
}

function confirmOrder() {
  if (!custName.value || !custAddress.value) return toast("Fill details");

  let total = 0;
  cart.forEach(c => {
    total += c.qty * c.price;
    const p = products.find(p => p.id === c.id);
    p.stock -= c.qty;
  });

  orders.push({
    customer: custName.value,
    address: custAddress.value,
    items: cart,
    total,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  custName.value = custAddress.value = "";
  hideAllPanels();
  renderStore();
  toast("Order placed");
}

function openAdmin() {
  hideAllPanels();
  document.getElementById("adminLogin").classList.remove("hidden");
}

function loginAdmin() {
  if (adminUser.value === "admin" && adminPass.value === "admin123")
    location.href = "admin.html";
  else toast("Invalid login");
}

renderStore();
