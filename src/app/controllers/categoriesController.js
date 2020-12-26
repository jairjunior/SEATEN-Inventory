const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
//router.use(authMiddleware);



// Return a list containing all the models stored in the database
router.get('/categories', async (req, res) => {
     try {
          const categories = await Category.find();
          console.log('System Log: Sending the client the list with all categories registered.');
          return res.send({ categories });
     }
     catch (error) {
          console.error('ERROR: Cannot list categories.');
          console.error(error);
          return res.status(500).send({ ok: false, error: 'Cannot list categories.' });
     }
});



// Return a specific model according to the id
router.get('/categories/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show a category' });
});



// Register a new model in the inventory
router.post('/categories', async (req, res) => {
     const { name } = req.body;

     try {
          if( await Category.findOne({ name }) )
               return res.status(400).send({ error: 'Category already registered.' });

          const newCategory = await Category.create(req.body);
          console.log(`System Log: New category (${name}) registered successfully.`);
          return res.send({ ok: true, newCategory });
     }
     catch(err) {
          console.error('ERROR: Failed to register new category.');
          console.error(err);
          return res.status(400).send({ ok: false, error: 'Failed to register new category.' });
     }



     res.send({ user: req.userId, msg: 'Register a category' });
});



// Update a model already stored in the database
router.put('/categories/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Update a category' });
});



// Delete a model from the database
router.delete('/categories/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Delete a category' });
});



module.exports = app => app.use('/inventory', router);