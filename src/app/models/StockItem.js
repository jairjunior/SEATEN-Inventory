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
          default: 'STI | SEATEN'
     },
     status: {
          type: String,
          lowercase: true,
          default: 'available'
     },
     transferHistory: [{
               ticketNumber: {
                    type: String,
                    required: true
               },
               providerUserName: {
                    type: String,
                    required: true
               },
               providerRegistrationNumber: {
                    type: Number,
                    required: true
               },
               providerDepartment: {
                    type: String,
                    required: true
               },
               recipientUserName: {
                    type: String,
                    required: true
               },
               recipientRegistrationNumber: {
                    type: Number,
                    required: true
               },
               recipientDepartment: {
                    type: String,
                    required: true
               },
               reason: {
                    type: String,
                    required: true
               },
               oldItem: {
                    type: String,
               },
               remarks: {
                    type: String,
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