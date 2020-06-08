const mongoose = require('mongoose');
const User = require('./user');

// Define the Dancer schema
const DancerSchema  = new User({
    gender: String,
    height: Number,
    birthYear: Number,
    listOfDanceStyles: [{ type: String }],
    proficiencyLevel: String,
    prefMinAge: Number,
    prefMaxAge: Number,
    prefGender: String,
    interestedInEvents: [{ type: String }] //Array of Strings -> store events ids
});



// Export the Dancer model
module.exports = mongoose.model('Dancer', DancerSchema);
