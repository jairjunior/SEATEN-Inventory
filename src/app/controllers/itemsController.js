const express = require('express');
const StockItem = require('../models/StockItem');
const authMiddleware = require('../middleware/auth');
const path = require('path');


const router = express.Router();
//router.use(authMiddleware);



// Send to the client the HTML file inventory.html
router.get('/', async (req, res) => {
     console.log('Application Log: Sending the client the Inventory HTML page.');
     res.sendFile( path.join(__dirname + '../../../../public/views/inventory.html') );
});



// Return a list containing all the items stored in the database
router.get('/items', async (req, res) => {
     console.log('Application Log: Sending the client the whole Inventory List.');

     try {
          const stockItems = await StockItem.find().populate('model');
          return res.send({ stockItems });
     } catch (error) {
          console.error('Application Error: Cannot list items.');
          console.error(error);
          return res.status(400).send({ user: req.userId, error: 'Cannot list items!' });
     }
});



// Return a specific item according to the id
router.get('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show an item' });
});



// Register a new item in the inventory
router.post('/items', async (req, res) => {
     const { type, inventoryNumber } = req.body;
     
     try {
          if( await StockItem.findOne({ inventoryNumber }) )
               return res.status(400).send({ error: 'Item already registered.' });

          const newItem = await StockItem.create(req.body);
          console.log(`Application Log: New item (${type} - ${inventoryNumber}) registered successfully.`);
          return res.send({ ok: true, newItem });
     }
     catch(err) {
          console.error('Application Error: Failed to register new item.');
          console.error(err);
          return res.status(400).send({ user: req.userId, error: 'Failed to register new item!' });
     }
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