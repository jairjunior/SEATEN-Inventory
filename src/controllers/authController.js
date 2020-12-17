const express = require('express');
const User = require('../models/User');


const router = express.Router();

router.post('/register', async (req, res) => {
     try {
          const user = await User.create(req.body);
          console.log("Application Log: User created successfully.");
          return res.send({ user });
     }
     catch(err) {
          console.error('Application Error: Registration failed.');
          console.error(err);
          return res.status(400).send({ error: 'Registration failed' });
     }
});

module.exports = router;