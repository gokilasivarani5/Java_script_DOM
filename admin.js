let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {
  if (!name.value || price.value <= 0 || stock.value < 0) return;

  products.push({
    id: Date.now(),
    name: name.value,
    price: +price.value,
    stock: +stock.value,
    highlight: false
  });

  name.value = "";
  price.value = "";
  stock.value = "";

  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    box.innerHTML += `
      <div class="card ${p.stock === 0 ? "empty" : ""} ${p.highlight ? "highlight" : ""}">
        <b>${p.name}</b>
        <p>&#8377;${p.price}</p>
        <p>Stock: ${p.stock}</p>

        <div class="actions">
          <button class="primary" onclick="updateProduct(${p.id})">Update</button>
          <button class="warn" onclick="toggleHighlight(${p.id})">Highlight</button>
          <button class="danger" onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </div>
    `;
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
  const ordersBox = document.getElementById("orders");
  ordersBox.classList.toggle("hidden");

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
    let itemsHTML = "";
    order.items.forEach(item => {
      itemsHTML += `
        <p>${item.name} → ${item.qty} × &#8377;${item.price}</p>
      `;
    });

    box.innerHTML += `
      <div class="card">
        <b>Customer:</b> ${order.customer}<br>
        <b>Address:</b> ${order.address}<br><br>
        ${itemsHTML}
        <hr>
        <b>Total:</b> &#8377;${order.total}<br>
        <small>${order.date}</small>
      </div>
    `;
  });
}

renderProducts();
