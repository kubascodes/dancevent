const mongoose = require('mongoose');


// Define the Dancer schema
const DancerSchema  = new mongoose.Schema({
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
    gender: String,
    height: Number,
    birthYear: Number,
    postalCode: Number,
    city: String,
    picture: Buffer,
    listOfDanceStyles: [{ type: String }],
    proficiencyLevel: String,
    prefMinAge: Number,
    prefMaxAge: Number,
    prefGender: String,
    interestedInEvents: [{ type: String }]
});



// Export the Dancer model
module.exports = mongoose.model('Dancer', DancerSchema);
