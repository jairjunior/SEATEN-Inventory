const mongoose = require('../../database/connection');


//Schema for Item Models
const ModelSchema = new mongoose.Schema({
     categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
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
     contractNumber: {
          type: String,
          required: true
     },
     processNumber: {
          type: String,
          required: true
     },
     warrantyExpirationDate: {
          type: Date,
          required: true
     }
},
{
     timestamps: true
});



const Model = mongoose.model('Model', ModelSchema);
module.exports = Model;