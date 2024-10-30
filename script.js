// Initialiser l'inventaire de pizzas
let pizzaInventory = [];
let deliveryStaff = [];

// Ajouter une pizza à l'inventaire
function addPizza() {
  const pizzaName = prompt("Nom de la pizza:");
  const price = prompt("Prix:");
  const quantity = parseInt(prompt("Quantité initiale:", "0")) || 0;

  if (pizzaName && price) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${pizzaName}</td>
      <td class="pizza-quantity">${quantity}</td>
      <td>${price} FCFA</td>
      <td><button onclick="deletePizza(this)">Supprimer</button></td>
    `;
    document.getElementById('pizza-inventory').appendChild(newRow);

    pizzaInventory.push({ name: pizzaName, price: parseFloat(price), quantity });
    updatePizzaSelection();
  }
}

// Mettre à jour la liste de pizzas disponibles dans le formulaire de commande
function updatePizzaSelection() {
  const pizzaSelect = document.getElementById("pizza-type");
  pizzaSelect.innerHTML = "";
  pizzaInventory.forEach(pizza => {
    const option = document.createElement("option");
    option.value = pizza.name;
    option.textContent = `${pizza.name} - ${pizza.quantity} en stock`;
    pizzaSelect.appendChild(option);
  });
}

// Supprimer une pizza de l'inventaire
function deletePizza(button) {
  const row = button.parentNode.parentNode;
  const pizzaName = row.children[0].textContent;

  pizzaInventory = pizzaInventory.filter(pizza => pizza.name !== pizzaName);
  row.parentNode.removeChild(row);
  updatePizzaSelection();
}

// Ajouter une commande
function addOrder() {
  const customerName = document.getElementById('customer-name').value;
  const customerPhone = document.getElementById('customer-phone').value;
  const pizzaType = document.getElementById('pizza-type').value;
  const orderType = document.getElementById('order-type').value;
  const address = document.getElementById('delivery-address').value;
  const deliveryTime = document.getElementById('delivery-time').value;

  const pizza = pizzaInventory.find(p => p.name === pizzaType);
  if (!pizza || pizza.quantity <= 0) {
    alert("Cette pizza est en rupture de stock !");
    return;
  }

  pizza.quantity -= 1;
  updateInventoryDisplay();

  if (customerName && customerPhone) {
    const table = document.getElementById('order-list');
    const row = table.insertRow();
    row.insertCell(0).textContent = customerName;
    row.insertCell(1).textContent = orderType === 'pickup' ? 'À emporter' : 'Livraison';
    row.insertCell(2).textContent = 'En cours';
    row.insertCell(3).textContent = `${pizza.price} FCFA`;
    row.insertCell(4).textContent = orderType === 'delivery' ? address : '';
    row.insertCell(5).textContent = orderType === 'delivery' ? deliveryTime : '';

    const statusCell = row.insertCell(6);
    const statusButton = document.createElement('button');
    statusButton.textContent = "Changer Statut";
    statusButton.onclick = () => changeOrderStatus(row, statusCell);
    statusCell.appendChild(statusButton);

    document.getElementById('order-form').reset();
  } else {
    alert("Veuillez remplir tous les champs du client.");
  }
}

// Changer le statut de la commande
function changeOrderStatus(row, statusCell) {
  const currentStatus = row.cells[2].textContent;
  let newStatus;

  switch (currentStatus) {
    case 'En cours':
      newStatus = 'Livrée';
      break;
    case 'Livrée':
      newStatus = 'Annulée';
      break;
    case 'Annulée':
      newStatus = 'En cours';
      break;
    default:
      newStatus = 'En cours';
  }

  row.cells[2].textContent = newStatus;

  if (newStatus === 'Livrée') {
    statusCell.querySelector('button').textContent = "Marquer Annulée";
  } else if (newStatus === 'Annulée') {
    statusCell.querySelector('button').textContent = "Marquer En Cours";
  } else {
    statusCell.querySelector('button').textContent = "Changer Statut";
  }

  updateRevenue();
}

// Mettre à jour l'affichage du stock
function updateInventoryDisplay() {
  const rows = document.querySelectorAll('#pizza-inventory tr');
  pizzaInventory.forEach((pizza, index) => {
    if (rows[index + 1]) {
      rows[index + 1].querySelector(".pizza-quantity").textContent = pizza.quantity;
    }
  });
  updatePizzaSelection();
}

// Mettre à jour les revenus
function updateRevenue() {
  const rows = document.getElementById('order-list').rows;
  let totalRevenue = 0;

  for (let i = 1; i < rows.length; i++) {
    const status = rows[i].cells[2].textContent;
    const amount = parseFloat(rows[i].cells[3].textContent.replace(' FCFA', ''));
    if (status === 'Livrée') {
      totalRevenue += amount;
    }
  }

  document.getElementById('revenue').textContent = `${totalRevenue} FCFA`;
}

// Afficher ou masquer les champs de livraison
function toggleDeliveryFields() {
  const orderType = document.getElementById("order-type").value;
  const deliveryDetails = document.getElementById("delivery-details");
  deliveryDetails.style.display = orderType === "delivery" ? "block" : "none";
}

// Ajouter un livreur
function addDeliveryPerson() {
  const deliveryName = document.getElementById("delivery-name").value;
  if (deliveryName) {
    const newDelivery = document.createElement("li");
    newDelivery.textContent = deliveryName;
    document.getElementById("delivery-list").appendChild(newDelivery);

    const option = document.createElement("option");
    option.value = deliveryName;
    option.textContent = deliveryName;
    document.getElementById("delivery-person").appendChild(option);
    document.getElementById("delivery-form").reset();
  }
}
// Fonction pour programmer un rappel
function scheduleDeliveryReminder(deliveryTime, customerName) {
    // Convertir l'heure de livraison en objet Date
    const deliveryDate = new Date(deliveryTime);
    
    // Calculer le délai pour 30 minutes avant l'heure de livraison
    const reminderTime = deliveryDate.getTime() - 30 * 60 * 1000; // 30 minutes en millisecondes

    const now = new Date().getTime();
    
    // Vérifier si le rappel doit être programmé pour le futur
    if (reminderTime > now) {
        const timeoutDuration = reminderTime - now;

        // Programmer le rappel
        setTimeout(() => {
            alert(`Rappel: Votre livraison pour ${customerName} est dans 30 minutes!`);
            // Vous pouvez également envoyer un email ou une notification ici
        }, timeoutDuration);
    } else {
        console.log("L'heure de livraison est déjà passée ou dans moins de 30 minutes.");
    }
}
async function addOrder() {
    const customerName = document.getElementById("customer-name").value;
    const customerPhone = document.getElementById("customer-phone").value;
    const pizzaId = document.getElementById("pizza-type").value; // Assurez-vous que cette valeur est l'ID de la pizza
    const orderType = document.getElementById("order-type").value;
    const deliveryAddress = orderType === "delivery" ? document.getElementById("delivery-address").value : null;
    const deliveryTime = orderType === "delivery" ? document.getElementById("delivery-time").value : null;

    const { data, error } = await supabase
        .from('orders')
        .insert([{ customer_name: customerName, customer_phone: customerPhone, pizza_id: pizzaId, order_type: orderType, delivery_address: deliveryAddress, delivery_time: deliveryTime }]);

    if (error) console.error(error);
    else {
        console.log('Commande ajoutée:', data);
        if (orderType === "delivery" && deliveryTime) {
            scheduleDeliveryReminder(deliveryTime, customerName); // Planifier le rappel
        }
    }
}
