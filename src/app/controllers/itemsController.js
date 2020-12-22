const express = require('express');
const stockItem = require('../models/StockItem');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
router.use(authMiddleware);


// Return a list containing all the items stored in the database
router.get('/items', async (req, res) => {
     res.send({ user: req.userId, msg: 'List all items' });
});

// Return a specific item according to the id
router.get('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show an item' });
});

// Register a new item in the inventory
router.post('/items', async (req, res) => {
     res.send({ user: req.userId, msg: 'Register new item' });
});

// Update an item already stored in the database
router.put('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Update an item' });
});

// Delete an item from the database
router.delete('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Delete an item' });
});



module.exports = app => app.use('/inventory', router);