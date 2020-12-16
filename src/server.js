const express = require('express');
const authController = require('./controllers/authController');

const MY_PORT = process.env.MY_PORT || 8080;

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/auth', authController);



app.get('/', (req, res) => {
     res.send('Welcome to the SEATEN Inventory web application!');
});



app.listen(MY_PORT, () => {
	console.log(`Server listening on port 3000...`);
});