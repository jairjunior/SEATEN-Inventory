const express = require('express');
const mongoose = require('mongoose');

const app = express();
const MY_PORT = process.env.MY_PORT || 8080;
const DB_USER = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_NAME = process.env.DATABASE_NAME;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@database.rrtt9.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', (req, res) => {
     res.send('Success!');
});


mongoose.connect( uri, 
     {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true
     }, 
     () => {
     console.log('Connected to DataBase!')
});


app.listen(MY_PORT, () => {
	console.log(`Server listening on port 3000...`);
});