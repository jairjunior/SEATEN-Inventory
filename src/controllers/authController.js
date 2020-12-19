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
          console.log(`Application Log: New user (${email}) created successfully.`);
          newUser.password = undefined;
          return res.send({ 
               newUser, 
               token: generateToken({ id: newUser.id }) 
          });
     }
     catch(err) {
          console.error('Application Error: Registration failed.');
          console.error(err);
          return res.status(400).send({ error: 'Registration failed.' });
     }
});


router.post('/authenticate', async (req, res) => {
     const { email, password } = req.body;
     const user = await User.findOne({ email }).select('+password');

     if( !user ) 
          return res.status(400).send({ error: 'User not found.' });
     if( !await bcrypt.compare(password, user.password) )
          return res.status(400).send({ error: 'Invalid password.' });
     
     console.log('Application Log: User authentication is valid. Access Token will be provided.');
     user.password = undefined;
     return res.send({ 
          user, 
          token: generateToken({ id: user.id }) 
     });   
});


module.exports = router;


function generateToken(params = {}){
     return jwt.sign(params, process.env.APP_AUTH_HASH, { expiresIn: 24*60*60 }); 
}