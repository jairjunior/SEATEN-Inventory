const mongoose = require('mongoose');

const DB_USER = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_NAME = process.env.DATABASE_NAME;
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@database.rrtt9.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

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

module.exports = mongoose;