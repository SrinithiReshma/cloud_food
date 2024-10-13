const form = document.getElementById('menuForm');
const menuList = document.getElementById('menuList');
let editingItemId = null; // Store the ID of the item being edited

// Fetch menu items
async function fetchMenuItems() {
    const response = await fetch('/api/menu');
    const data = await response.json();
    menuList.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong>: ${item.description} - $${item.price}
            <button onclick="editMenuItem('${item._id}')">Edit</button>
            <button onclick="deleteMenuItem('${item._id}')">Delete</button>
        `;
        menuList.appendChild(li);
    });
}

// Add new menu item
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newItem = {
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value)
    };

    if (editingItemId) {
        // Update existing menu item
        const updateResponse = await fetch(`/api/menu/${editingItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (updateResponse.ok) {
            console.log('Item updated successfully.');
        } else {
            console.error('Failed to update item:', updateResponse.statusText);
        }
    } else {
        // Add new menu item
        await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });
        console.log('New item added successfully.');
    }

    // Reset the form and fetch the updated menu items
    form.reset();
    editingItemId = null; // Reset editing item ID
    fetchMenuItems();
});

// Edit menu item
async function editMenuItem(id) {
    // Fetch all menu items
    const response = await fetch('/api/menu');
    const data = await response.json();

    // Find the item by ID
    const menuItem = data.find(item => item._id === id);
    if (!menuItem) {
        console.error('Menu item not found');
        return; // Exit if the item doesn't exist
    }

    // Populate form with existing data
    form.name.value = menuItem.name;
    form.description.value = menuItem.description;
    form.price.value = menuItem.price;

    // Set the editingItemId to the ID of the item being edited
    editingItemId = menuItem._id;
}

// Delete menu item
async function deleteMenuItem(id) {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    fetchMenuItems();
}

// Initial fetch
fetchMenuItems();
