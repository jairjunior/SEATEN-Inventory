const mongoose = require('../db/connection');

const UserSchema = new mongoose.Schema({
     firstName: {
          type: String,
          required: true
     },
     lastName: {
          type: String,
          required: true
     },
     email: {
          type: String,
          unique: true,
          required: true,
          lowercase: true
     },
     password: {
          type: String,
          required: true,
          select: false
     },
     permission: {
          type: String,
          required: true,
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;