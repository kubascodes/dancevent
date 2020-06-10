const mongoose = require('mongoose');
const User = require('./user'); //we require the user model to extend it

// Define the Organizer schema that extends User
const OrganizerSchema  = User.discriminator('Organizer', new mongoose.Schema({
    street: { type: String, required: true },
    description: { type: String, required: false },
    publicEmail: { type: String, required: true },
    phone: { type: Number, required: true },
})
);

// Export the Organizer model
module.exports = mongoose.model('Organizer'); //save organizers to the user collection internally
