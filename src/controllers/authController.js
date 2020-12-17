const express = require('express');
const { findOne } = require('../models/User');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


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


router.post('/authenticate', async (req, res) => {
     const { email, password} = req.body;
     const user = await User.findOne({ email }).select('+password');

     if(!user) 
          return res.status(400).send({ error: 'User not found.' });
     else if( !await bcrypt.compare(password, user.password) )
          return res.status(400).send({ error: 'Invalid password.' });
     else {
          user.password = undefined;
          res.send({ user });
     }
});


module.exports = router;