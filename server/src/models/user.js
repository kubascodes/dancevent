const mongoose = require('mongoose');


// Define the User schema with common attributes between organizer and dancer
const UserSchema  = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    city: String,
    postalCode: Number,
    picture: Buffer
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
