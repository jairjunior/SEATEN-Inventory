const mongoose = require('../../database/connection');


//Schema for Stock Items
const StockItemSchema = new mongoose.Schema({
     category: {
          type: String,
          required: true
     },
     itemModelId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Model',
          required: true
     },
     inventoryNumber: {
          type: String,
          required: true,
          unique: true
     },
     location: {
          type: String,
          default: 'STI | SUTEC | SEATEN'
     },
     status: {
          type: String,
          lowercase: true,
          default: 'available'
     },
     transferredFrom: {
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
          userNumber: {
               type: Number,
               required: true
          },
          date: {
               type: Date,
               default: Date.now
          }
     },
     transferredTo: {
          taskNumber: String,
          userName: String,
          userNumber: Number,
          date: Date,
          transferredBy: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User'
          }
     }
},
{
     timestamps: true
});



const StockItem = mongoose.model('StockItem', StockItemSchema);
module.exports = StockItem;