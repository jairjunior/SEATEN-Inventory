const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();


//MIDDLEWARES
app.use( favicon( path.join(__dirname, '../public/img/favicon.ico') ) ); // serve the favicon
app.use( express.json());                              // parse application/json
app.use( express.urlencoded({ extended: true }));      // parse application/x-www-form-urlencoded
app.use( express.static('public') );                   // folder for static files (html, css, js)
require('./app/controllers/index')(app);               // import all controllers and set them to the "app"


// INDEX
app.get('/', (req, res) => {
     console.log('System Log: Sending to the client the HTML Login page.');
     res.sendFile( path.join(__dirname + '../../public/views/login.html') );
});


//DATABASE CONNECTION
const SERVER_PORT = process.env.SERVER_PORT || 3080;

app.listen(SERVER_PORT, (error) => {
     if(error){
          console.error('ERROR: Cannot create node.js server.');
          console.error(error);
     }
	else console.log(`System Log: Server listening on port ${SERVER_PORT}...`);
});