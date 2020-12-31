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

          req.body.permission = undefined;
          const newUser = await User.create(req.body);
          console.log(`System Log: New user (${email}) created successfully.`);
          newUser.password = undefined;
          return res.send({ 
               newUser, 
               token: generateToken({ id: newUser.id }) 
          });
     }
     catch(err) {
          console.error('ERROR: Registration failed.');
          console.error(err);
          return res.status(400).send({ error: 'Registration failed.' });
     }
});


router.post('/authenticate', async (req, res) => {
     const { email, password } = req.body;
     
     try{
          const user = await User.findOne({ email }).select('+password');
          console.log(user);
          if( !user ) 
               return res.status(400).send({ error: 'User not found.' });
          if( !await bcrypt.compare(password, user.password) )
               return res.status(400).send({ error: 'Invalid password.' });
          
          console.log('System Log: User authentication is valid. Access Token will be provided.');
          
          user.password = undefined;
          return res.send({ user, token: generateToken({ id: user.id }) });
     }
     catch(error) {
          console.error('ERROR: Failed to authenticate user.');
          console.error(err);
          return res.status(400).send({ ok: false, error: 'Failed to authenticate user.' });
     }
});


function generateToken(params = {}){
     return jwt.sign(params, process.env.APP_AUTH_HASH, { expiresIn: 24*60*60 }); 
}


module.exports = app => app.use('/auth', router);