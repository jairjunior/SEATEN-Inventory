const express = require('express');
const path = require('path');
const authMiddleware = require('../middleware/auth');


const router = express.Router();
router.use(authMiddleware);


//----------------------------------------------------------------------------------------
// Send to the client the HTML file inventory.html
//----------------------------------------------------------------------------------------
router.get('/', (req, res) => {
     console.log('System Log: Sending to the client the App HTML structure (navbar and footer mainly).');
     res.sendFile( path.join(__dirname + '../../../../public/views/app.html') );
});


//----------------------------------------------------------------------------------------
// Send to the client the HTML file inventory.html
//----------------------------------------------------------------------------------------
router.get('/inventory', (req, res) => {
     console.log('System Log: Sending to the client the Inventory HTML page.');
     res.sendFile( path.join(__dirname + '../../../../public/views/inventory.html') );
});


//----------------------------------------------------------------------------------------
// Send to the client the HTML file register.html
//----------------------------------------------------------------------------------------
router.get('/register', (req, res) => {
     console.log('System Log: Sending to the client the Register HTML page.');
     res.sendFile( path.join(__dirname + '../../../../public/views/register.html') );
});


module.exports = app => app.use('/app', router);