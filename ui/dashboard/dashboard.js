const inventoryTable = document
  .getElementById("inventory-table")
  .getElementsByTagName("tbody")[0];

let inventoryItems = [];

const API_URI = "http://127.0.0.1:3001/items";

function renderTable() {
  inventoryTable.innerHTML = "";
  inventoryItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category.name}</td>
        <td>${item.quantity}</td>
        <td>${item.location}</td>
        <td>${item.description}</td>
        <td>${item.createdBy.userName}</td>
        <td>${item.updatedBy.userName}</td>
    `;

    inventoryTable.appendChild(row);
  });
}

async function fetchInventoryItems() {
  try {
    const response = await fetch(API_URI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    const data = await response.json();
    inventoryItems = data.items;
    renderTable();
  } catch (error) {
    console.error("Error fetching items", error);
  }
}

fetchInventoryItems();
