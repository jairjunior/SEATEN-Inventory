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
     transferLog: [{
               reqNumber: {
                    type: String,
                    required: true
               },
               fromDepartment: {
                    type: String,
                    required: true
               },
               fromUserName: {
                    type: String,
                    required: true
               },
               fromUserNumber: {
                    type: Number,
                    required: true
               },
               toDepartment: {
                    type: String,
                    required: true
               },
               toUserName: {
                    type: String,
                    required: true
               },
               toUserNumber: {
                    type: Number,
                    required: true
               },
               reason: {
                    type: String,
                    required: true
               },
               transferredBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
               },
               date: {
                    type: Date,
                    default: Date.now
               }
     }]
},
{
     timestamps: true
});



const StockItem = mongoose.model('StockItem', StockItemSchema);
module.exports = StockItem;