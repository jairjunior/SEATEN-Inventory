const express = require('express');
const StockItem = require('../models/StockItem');
const Model = require('../models/Model');
const path = require('path');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
//router.use(authMiddleware);



// Send to the client the HTML file inventory.html
router.get('/', async (req, res) => {
     console.log('System Log: Sending to the client the Inventory HTML page.');
     res.sendFile( path.join(__dirname + '../../../../public/views/inventory.html') );
});





// Return a list containing all the items stored in the database
router.get('/items', async (req, res) => {
     try {
          const stockItems = await StockItem.find();
          const itemModels = await Model.find();
          console.log('System Log: Sending to the client the whole Inventory List with the Models registered.');
          return res.send({ stockItems, itemModels });
     }
     catch (error) {
          console.error('ERROR: Cannot list items.');
          console.error(error);
          return res.status(500).send({ ok: false, error: 'Cannot list items.' });
     }
});





// Return a specific item according to the id
router.get('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show a specific item.' });
});





// Register a new item in the inventory
router.post('/items', async (req, res) => {
     const { category, itemModelId, inventoryNumber } = req.body;
     
     try {
          if( await StockItem.findOne({ inventoryNumber }) )
               return res.status(400).send({ error: 'Item already registered.' });

          const model = await Model.findById(itemModelId).populate('category');
          if(!model) 
               return res.status(400).send({ error: 'Item Model not registered in database.' });
          if( category !== model.category.name )
               return res.status(400).send({ error: 'The category field in your requisition needs to be the same as the chosen model.' });

          const newItem = await StockItem.create(req.body);
          console.log(`System Log: New item (${category} - ${inventoryNumber}) registered successfully.`);
          return res.send({ ok: true, newItem });
     }
     catch(err) {
          console.error('ERROR: Failed to register new item.');
          console.error(err);
          return res.status(500).send({ ok: false, error: 'Failed to register new item.' });
     }
});





// Update an item already stored in the database
router.put('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Update a specific item.' });
});





// Delete an item from the database
router.delete('/items/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Delete a specific item.' });
});



module.exports = app => app.use('/inventory', router);