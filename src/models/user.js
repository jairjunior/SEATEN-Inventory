const mongoose = require('../db/connection');
const bcrypt = require('bcryptjs');
const { runInNewContext } = require('vm');

//Schema for Users
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



// Execute this always before doing anything in DataBase
UserSchema.pre('save', async function(next){
     const hash = await bcrypt.hash(this.password, 15);
     this.password = hash;
     
     next();
});



const User = mongoose.model('User', UserSchema);
module.exports = User;