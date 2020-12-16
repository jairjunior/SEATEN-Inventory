const express = require('express');

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
require('./controllers/authController')(app);

const MY_PORT = process.env.MY_PORT || 8080;



app.get('/', (req, res) => {
     res.send('Welcome to the SEATEN Inventory web application!');
});



app.listen(MY_PORT, () => {
	console.log(`Server listening on port 3000...`);
});