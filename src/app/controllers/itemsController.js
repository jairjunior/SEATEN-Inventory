const express = require('express');
const StockItem = require('../models/StockItem');
const Model = require('../models/Model');
const path = require('path');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
router.use(authMiddleware);



//----------------------------------------------------------------------------------------
// Return a list containing all the items stored in the database
// As all the items (in stockitem collection) have a reference field to the model colletction,
// The app returns both collections in separeted objects.
// This is done to reduce the size of the response. So, the front-end needs to associate
// each id in the "itemModelId" field (stockItems object) to a respective model in the itemModels object.
//----------------------------------------------------------------------------------------
router.get('/items', async (req, res) => {
     try {
          const stockItems = await StockItem.find();
          const itemModels = await Model.find();
          console.log('System Log: Sending to the client the whole Inventory List with the registered Models.');
          return res.send({ ok: true, stockItems, itemModels });
     }
     catch (error) {
          console.error('ERROR: Cannot list items.');
          console.error(error);
          return res.status(500).send({ ok: false, error: 'Cannot list items.' });
     }
});


//----------------------------------------------------------------------------------------
// Return a specific item according to the id
// It returns all the information populating the "itemModelId" field as well the "categoryId"
// inside the model collection.
//----------------------------------------------------------------------------------------
router.get('/items/:itemId', async (req, res) => {
     try {
          const stockItem = await StockItem.findById(req.params.itemId).populate({
               path: 'itemModelId',
               populate: { path: 'categoryId' }
          }).populate('transferHistory.transferredBy');
          console.log(`System Log: Sending to the client the item document (id = ${req.params.itemId}).`);
          return res.send({ ok: true, stockItem });
     }
     catch (error) {
          console.error('ERROR: Cannot retrieve item from database.');
          console.error(error);
          return res.status(400).send({ ok: false, error: 'Cannot retrieve item.' });
     }
});


//----------------------------------------------------------------------------------------
// Register a new item in the inventory.
// Cannot register a new item with repeated inventory number.
// This route tests if the field "category" matches the one referenced by the "itemModelId" field.
// For this, the model is fetched populating the field "categoryId" with the information from
// the category collection.
//----------------------------------------------------------------------------------------
router.post('/items', async (req, res) => {
     
     req.body.transferHistory.transferredBy = req.userId;
     const { category, itemModelId, inventoryNumber } = req.body;
     
     try {
          if( await StockItem.findOne({ inventoryNumber }) )
               return res.status(400).send({ error: 'Item already registered.' });

          const model = await Model.findById(itemModelId).populate('categoryId');
          if( !model ) 
               return res.status(400).send({ error: 'Item Model not registered in database.' });
          if( category !== model.categoryId.name )
               return res.status(400).send({ error: "The 'category' value needs to be the same as the chosen model." });

          const newItem = await StockItem.create( req.body );

          console.log(`System Log: New item (${category} - ${inventoryNumber}) registered successfully.`);
          return res.send({ ok: true, newItem });
     }
     catch(err) {
          console.error('ERROR: Failed to register new item.');
          console.error(err);
          return res.status(400).send({ ok: false, error: 'Failed to register new item.' });
     }
});


//----------------------------------------------------------------------------------------
// Record information about transfering an item to another person.
// After success, it will return the item updated.
// It also update automatically the date at the "updatedAt" field.
//----------------------------------------------------------------------------------------
router.put('/items/transfer/:itemId', async (req, res) => {
     
     req.body.transferredBy = req.userId;
     console.log('Transfer requisition: ', req.body);

     try {
          const stockItemUpdated = await StockItem.findByIdAndUpdate( { _id: req.params.itemId }, {
               location: req.body.toDepartment,
               status: (req.body.status) ? req.body.status : 'TAKEN',
               $push: { transferHistory: req.body }
          },
          { new: true }
          );

          console.log(`System Log: Stock Item (id: ${req.params.itemId}) transferred successfully.`);
          return res.send({ ok: true, stockItemUpdated });
     }
     catch(err) {
          console.error('ERROR: Failed to transfer item.');
          console.error(err);
          return res.status(400).send({ ok: false, error: 'Failed to transfer new item.' });
     }
});


//----------------------------------------------------------------------------------------
// Delete an item from the database
//----------------------------------------------------------------------------------------
router.delete('/items/:itemId', async (req, res) => {
     try {
          const stockItem = await StockItem.findByIdAndDelete(req.params.itemId);
          console.log(`System Log: Item deleted from database (id = ${req.params.itemId}).`);
          return res.send({ ok: true, msg: 'Item successfully deleted.', stockItem });
     }
     catch (error) {
          console.error('ERROR: Cannot delete item from database.');
          console.error(error);
          return res.status(400).send({ ok: false, error: 'Cannot delete item from database.' });
     }
});





module.exports = app => app.use('/inventory', router);