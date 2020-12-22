const mongoose = require('../../database/connection');


//Schema for Models
const ModelSchema = new mongoose.Schema({
     type: {
          type: String,
          required: true
     },
     brand: {
          type: String,
          required: true
     },
     name: {
          type: String,
          required: true
     },
     specs: {
          type: Map,
          required: true
     },
     contract: {
          type: String,
          required: true
     },
     warrantyExpirationDate: {
          type: Date,
          required: true
     }
});



const Model = mongoose.model('Model', ModelSchema);
module.exports = Model;