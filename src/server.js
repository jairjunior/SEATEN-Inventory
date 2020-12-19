const express = require('express');
const authController = require('./controllers/authController');
const appController = require('./controllers/appController');


const app = express();

app.use(express.json());                               // for parsing application/json
app.use(express.urlencoded({ extended: true }));       // for parsing application/x-www-form-urlencoded
app.use('/auth', authController);                      // middleware for user authentication
app.use(appController);                                // main routes of the application


app.get('/', (req, res) => {
     res.send({ 
          ok: true,
          message: 'Welcome to the SEATEN Inventory web application!'
      });
});


const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.listen(SERVER_PORT, (error) => {
     if(error){
          console.error('Application Error: Cannot create node.js server.');
          console.error(error);
     }
	else console.log(`Application Log: Server listening on port ${SERVER_PORT}...`);
});