const mongoose = require('mongoose');
const User = require('./user'); //we require the user model to extend it

// Define the Organizer schema that extends User
const OrganizerSchema  = User.discriminator('Organizer', new mongoose.Schema({
    street: String,
    description: String,
    publicEmail: String,
    phone: Number,
    events: [{type: String}] //Array of Strings -> store events ids
})
);

// Export the Organizer model
module.exports = mongoose.model('Organizer'); //save organizers to the user collection internally
