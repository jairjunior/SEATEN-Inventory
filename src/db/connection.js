const mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_SYSTEM_ADMIN_USERNAME;
const dbPassword = process.env.DB_SYSTEM_ADMIN_PASSWORD;

const mongoAtlasURI = `mongodb+srv://${dbUser}:${dbPassword}@database.rrtt9.mongodb.net/${dbName}?retryWrites=true&w=majority`;

(async () => {
     try {
          await mongoose.connect( mongoAtlasURI, 
               {    
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true
               });     
     } 
     catch (error) {
          console.error('Error: Could not connect to database!');
          console.error(error);
     }
})();

module.exports = mongoose;