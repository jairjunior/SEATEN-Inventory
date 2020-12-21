const mongoose = require('../../database/connection');


//Schema for Items
const StockItemSchema = new mongoose.Schema({
     inventoryNumber: {
          type: String,
          required: true,
          unique: true
     },
     type: {
          type: String,
          required: true
     },
     model: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Model',
          required: true
     },
     transferedFrom: {
          taskNumber: {
               type: String,
               required: true
          },
          department: {
               type: String,
               required: true
          },
          userName: {
               type: String,
               required: true
          },
          date: {
               type: Date,
               default: Date.now
          }
     },
     transferedTo: {
          taskNumber: String,
          department: String,
          userName: String,
          date: Date,
     },
     location: {
          type: String,
          default: 'SEATEN - Stockroom'
     },
     status: {
          type: String,
          default: 'Available'
     }
});



const StockItem = mongoose.model('StockItem', StockItemSchema);
module.exports = StockItem;