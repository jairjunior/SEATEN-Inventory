const express = require('express');
const app = express();
const path = require('path');


app.use(express.json());                               // for parsing application/json
app.use(express.urlencoded({ extended: true }));       // for parsing application/x-www-form-urlencoded
app.use( express.static('public') );                   // folder for static files (html, css, js)
require('./app/controllers/index')(app);               // import all controllers and set them to the "app"




app.get('/', (req, res) => {
     res.send({ 
          ok: true,
          message: 'Welcome to the SEATEN Inventory web application!'
      });
});




const SERVER_PORT = process.env.SERVER_PORT || 3080;

app.listen(SERVER_PORT, (error) => {
     if(error){
          console.error('Application Error: Cannot create node.js server.');
          console.error(error);
     }
	else console.log(`Application Log: Server listening on port ${SERVER_PORT}...`);
});