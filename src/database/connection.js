const mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_SYSTEM_ADMIN_USERNAME;
const dbPassword = process.env.DB_SYSTEM_ADMIN_PASSWORD;

const mongoAtlasURI = `mongodb+srv://${dbUser}:${dbPassword}@database.rrtt9.mongodb.net/${dbName}?retryWrites=true&w=majority`;

(async () => {
     await mongoose.connect( mongoAtlasURI, 
          {    
               useNewUrlParser: true,
               useUnifiedTopology: true,
               useFindAndModify: false,
               useCreateIndex: true
          }, 
          function(error){
               if(error){
                    console.error('ERROR: Could not connect to database.');
                    console.error(error);
               }
               else console.log('System Log: Connected to database successfully.\n');
          });
})();

module.exports = mongoose;