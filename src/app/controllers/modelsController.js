const express = require('express');
const Model = require('../models/Model');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
router.use(authMiddleware);



// Return a list containing all the models stored in the database
router.get('/models', async (req, res) => {
     try {
          const itemModels = await Model.find().populate('category');
          console.log('System Log: Sending the client the list with all models registered.');
          return res.send({ itemModels });
     }
     catch (error) {
          console.error('ERROR: Cannot list models.');
          console.error(error);
          return res.status(500).send({ ok: false, error: 'Cannot list models.' });
     }
});





// Return a specific model according to the id
router.get('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show a specific model.' });
});





// Register a new model in the inventory
router.post('/models', async (req, res) => {
     const { categoryId, brand, name } = req.body;
     
     try {
          if( await Model.findOne({ name }) )
               return res.status(400).send({ error: 'Model already registered.' });

          const cat = await Category.findById(categoryId);
          if(!cat) return res.status(400).send({ error: 'Category not registered in database.' });

          const newModel = await Model.create(req.body);
          console.log(`System Log: New Model (${cat.name}: ${brand} ${name}) registered successfully.`);
          return res.send({ ok: true, newModel });
     }
     catch(err) {
          console.error('ERROR: Failed to register new model.');
          console.error(err);
          return res.status(500).send({ ok: false, error: 'Failed to register new model.' });
     }
});





// Update a model already stored in the database
router.put('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Update a specific model.' });
});





// Delete a model from the database
router.delete('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Delete a specific model.' });
});



module.exports = app => app.use('/inventory', router);