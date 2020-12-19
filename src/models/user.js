const mongoose = require('../db/connection');
const bcrypt = require('bcryptjs');

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
          required: true,
          unique: true,
          lowercase: true
     },
     password: {
          type: String,
          required: true,
          select: false
     },
     permission: {
          type: String,
          default: 'general_user',
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});



// Middleware that will always execute before doing anything
// in the DataBase related to the User collection.
UserSchema.pre('save', async function(next){
     const hash = await bcrypt.hash(this.password, 15);
     this.password = hash;
     
     next();
});



const User = mongoose.model('User', UserSchema);
module.exports = User;