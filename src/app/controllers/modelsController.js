const express = require('express');
const model = require('../models/Model');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
router.use(authMiddleware);


// Return a list containing all the models stored in the database
router.get('/models', async (req, res) => {
     res.send({ user: req.userId, msg: 'List all models' });
});

// Return a specific model according to the id
router.get('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Show a model' });
});

// Register a new model in the inventory
router.post('/models', async (req, res) => {
     res.send({ user: req.userId, msg: 'Register new model' });
});

// Update a model already stored in the database
router.put('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Update a model' });
});

// Delete a model from the database
router.delete('/models/:id', async (req, res) => {
     res.send({ user: req.userId, msg: 'Delete a model' });
});



module.exports = app => app.use('/inventory', router);