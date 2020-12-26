const mongoose = require('../../database/connection');
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
     }
},
{
     timestamps: true
});



// Middleware that will always execute before doing anything
// in the DataBase related to the User collection.
UserSchema.pre('save', async function(next){
     try{
          const hash = await bcrypt.hash(this.password, 15);
          this.password = hash;
     }
     catch(err){
          console.error('ERROR trying to encrypt password before saving in database.');
          console.error(err);
     }
     next();
});



const User = mongoose.model('User', UserSchema);
module.exports = User;