const mongoose = require('mongoose');


// Define the Organizer schema
const OrganizerSchema  = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    city: String,
    street: String,
    postalCode: Number,
    picture: Buffer,
    description: String,
    publicEmail: String,
    phone: Number,
    events: [{type: String}]
});



// Export the Organizer model
module.exports = mongoose.model('Organizer', OrganizerSchema);
