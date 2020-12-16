const express = require('express');
const authController = require('./controllers/authController');

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(express.json());                               // for parsing application/json
app.use(express.urlencoded({ extended: true }));       // for parsing application/x-www-form-urlencoded
app.use('/auth', authController);                      // middleware for user authentication



app.get('/', (req, res) => {
     res.send('Welcome to the SEATEN Inventory web application!');
});



app.listen(SERVER_PORT, () => {
	console.log(`Server listening on port 3000...`);
});