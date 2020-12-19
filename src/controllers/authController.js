const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router();

router.post('/register', async (req, res) => {
     const { email } = req.body;
     
     try {
          if( await User.findOne({ email }) )
               return res.status(400).send({ error: 'Email already registered.' });

          req.body.permission = 'general_user';
          const newUser = await User.create(req.body);
          console.log("Application Log: User created successfully.");
          newUser.password = undefined;
          const token = jwt.sign({ id: newUser.id  }, process.env.APP_AUTH_HASH, { expiresIn: 86400 });
          return res.send({ newUser, token });
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
          const token = jwt.sign({ id: user.id  }, process.env.APP_AUTH_HASH, { expiresIn: 86400 });
          return res.send({ user, token });
     }
});


module.exports = router;