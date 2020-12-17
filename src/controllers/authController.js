const express = require('express');
const { findOne } = require('../models/User');
const User = require('../models/User');


const router = express.Router();

router.post('/register', async (req, res) => {
     const { email } = req.body;
     
     try {
          if( await User.findOne({ email }) ){
               return res.status(400).send({ error: 'Email already registered.' });
          }

          const user = await User.create(req.body);
          user.password = undefined;
          console.log("Application Log: User created successfully.");
          return res.send({ user });
     }
     catch(err) {
          console.error('Application Error: Registration failed.');
          console.error(err);
          return res.status(400).send({ error: 'Registration failed.' });
     }
});

module.exports = router;