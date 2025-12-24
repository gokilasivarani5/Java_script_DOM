const name = document.getElementById("name");
const price = document.getElementById("price");
const stock = document.getElementById("stock");

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

let products = getProducts();

function addProduct() {
  if (!name.value || price.value <= 0 || stock.value < 0) return;

  products.push({
    id: Date.now(),
    name: name.value,
    price: +price.value,
    stock: +stock.value,
    highlight: false
  });

  localStorage.setItem("products", JSON.stringify(products));
  name.value = price.value = stock.value = "";
  renderProducts();
}

function renderProducts() {
  products = getProducts();
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    box.innerHTML += `
      <div class="card ${p.stock === 0 ? "empty" : ""} ${p.highlight ? "highlight" : ""}">
        <b>${p.name}</b>
        <p>₹${p.price}</p>
        <p>Stock: ${p.stock}</p>

        <div class="actions">
          <button class="primary" onclick="updateProduct(${p.id})">Update</button>
          <button class="warn" onclick="toggleHighlight(${p.id})">Highlight</button>
          <button class="danger" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </div>`;
  });
}

function updateProduct(id) {
  const p = products.find(x => x.id === id);
  const newPrice = prompt("New Price", p.price);
  const newStock = prompt("New Stock", p.stock);

  if (newPrice !== null && newStock !== null) {
    p.price = +newPrice;
    p.stock = +newStock;
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }
}

function toggleHighlight(id) {
  const p = products.find(x => x.id === id);
  p.highlight = !p.highlight;
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function toggleOrders() {
  const section = document.getElementById("ordersSection");
  section.classList.toggle("hidden");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  renderOrders(orders);
}

function renderOrders(orders) {
  const box = document.getElementById("orders");
  box.innerHTML = "";

  if (orders.length === 0) {
    box.innerHTML = "<p>No customer orders found</p>";
    return;
  }

  orders.forEach(order => {
    let items = "";
    order.items.forEach(i => {
      items += `<p>${i.name} → ${i.qty} × ₹${i.price}</p>`;
    });

    box.innerHTML += `
      <div class="card highlight">
        <b>Customer:</b> ${order.customer}<br>
        <b>Address:</b> ${order.address}<br><br>
        ${items}
        <hr>
        <b>Total:</b> ₹${order.total}<br>
        <small>${order.date}</small>
      </div>`;
  });
}

renderProducts();
