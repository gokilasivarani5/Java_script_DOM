document.addEventListener("DOMContentLoaded", () => {

  const inputs = document.querySelectorAll("input");
  const addBtn = document.getElementById("addItemBtn");
  const inventory = document.querySelector("[data-section='inventory']");

  let itemId = 0;

  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.backgroundColor = "#eaf4ff";
    });
    input.addEventListener("blur", () => {
      input.style.backgroundColor = "";
    });
  });

  inputs[1].addEventListener("input", () => {
    inputs[1].style.border = inputs[1].value < 0 ? "2px solid red" : "";
  });

  inputs[2].addEventListener("input", () => {
    inputs[2].style.border = inputs[2].value < 0 ? "2px solid red" : "";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  addBtn.addEventListener("click", () => {

    const name = inputs[0].value.trim();
    const price = parseFloat(inputs[1].value);
    const stock = parseInt(inputs[2].value);

    if (!name || isNaN(price) || isNaN(stock)) {
      alert("Enter valid item name, price and stock");
      return;
    }

    const card = document.createElement("div");
    card.className = "item-card";

    card.setAttribute("data-id", ++itemId);
    card.setAttribute("data-price", price);
    card.setAttribute("data-stock", stock);

    card.innerHTML = `
      <div class="item-name">${name}</div>
      <div class="item-price">Price: ₹${price}</div>
      <div class="item-stock">Stock: ${stock}</div>
      <div class="item-total">Total: ₹${price * stock}</div>
      <div class="actions">
        <button class="update">Update</button>
        <button class="highlight">Highlight</button>
        <button class="delete">Delete</button>
      </div>
    `;

    inventory.appendChild(card);
    inputs.forEach(i => i.value = "");
    updateUI(card, price, stock);
  });

  inventory.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".item-card");
    if (card) card.style.transform = "scale(1.02)";
  });

  inventory.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".item-card");
    if (card) card.style.transform = "scale(1)";
  });

  inventory.addEventListener("click", (event) => {

    const btn = event.target;
    const card = btn.closest(".item-card");
    if (!card) return;

    let price = parseFloat(card.getAttribute("data-price"));
    let stock = parseInt(card.getAttribute("data-stock"));

    if (btn.classList.contains("update")) {
      const newPrice = prompt("Enter new price:", price);
      const newStock = prompt("Enter new stock:", stock);
      const p = parseFloat(newPrice);
      const s = parseInt(newStock);
      if (!isNaN(p) && !isNaN(s)) {
        updateUI(card, p, s);
      }
    }

    if (btn.classList.contains("highlight")) {
      card.classList.toggle("highlighted");
      btn.textContent =
        card.classList.contains("highlighted") ? "Unhighlight" : "Highlight";
    }

    if (btn.classList.contains("delete")) {
      if (confirm("Delete this item?")) {
        card.remove();
      }
    }
  });

  function updateUI(card, price, stock) {
    card.setAttribute("data-price", price);
    card.setAttribute("data-stock", stock);
    card.querySelector(".item-price").textContent = "Price: ₹" + price;
    card.querySelector(".item-stock").textContent = "Stock: " + stock;
    card.querySelector(".item-total").textContent =
      "Total: ₹" + (price * stock);
    if (stock <= 5) {
      card.classList.add("low-stock");
    } else {
      card.classList.remove("low-stock");
    }
  }

});
