const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://srinithi:reshma@foodmenu.jd8id.mongodb.net/?retryWrites=true&w=majority&appName=foodmenu', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// CRUD Operations

// Create
app.post('/api/menu', async (req, res) => {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).send(menuItem);
});

// Read
app.get('/api/menu', async (req, res) => {
    const menuItems = await MenuItem.find();
    res.status(200).send(menuItems);
});

// Update
// Update a menu item
app.put('/api/menu/:id', async (req, res) => {
    const { name, description, price } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
    if (!updatedItem) {
        return res.status(404).send('Menu item not found');
    }
    res.status(200).send(updatedItem);
});


// Delete
app.delete('/api/menu/:id', async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
