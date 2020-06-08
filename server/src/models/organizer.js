const mongoose = require('mongoose');
const User = require('./user');

// Define the Organizer schema
const OrganizerSchema  = new User({
    street: String,
    description: String,
    publicEmail: String,
    phone: Number,
    events: [{type: String}] //Array of Strings -> store events ids
});



// Export the Organizer model
module.exports = mongoose.model('Organizer', OrganizerSchema);
