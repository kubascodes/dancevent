const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //require bcrypt for hashing and validating passwords. Bcrypt and not BcryptJS because Bcrypt is much faster!
const options = { discriminatorKey: 'userType', collection: 'users' }; //to allow inheritance of data models, i.e. we want to store both dancers and organizers in the same database collection called users

// Define the User schema with common attributes between organizer and dancer
const UserSchema  = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'You forgot your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'You forgot your password']
    },
    name: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: false }, //is it actually necessary? You can easily find out the postal code based on the city.
    picture: { type: Buffer, required: false }
}, options); //pass the options variable to allow for inheritance

//Before you save the user to the database, hash his password
UserSchema.pre('save', async function(next){
  //'this' refers to the current document about to be saved
  const user = this;
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  const hash = await bcrypt.hash(this.password, 10);
  //Replace the plain text password with the hash and then store it
  this.password = hash;
  //Indicates we're done and can move on to the next middleware
  next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function(password){
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare; //true or false
}

// Export the User model
module.exports = mongoose.model('User', UserSchema);
