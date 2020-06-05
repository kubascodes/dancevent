const mongoose = require('mongoose');


// Define the Event schema
const EventSchema  = new mongoose.Schema({
    title: String,
    type: String,
    description: String,
    startDate: Date,
    duration: Number,
    city: String,
    location: String,
    picture: Buffer,
    listOfDanceStyles: [{
      type: String
    }],
    listOfProficiencyLevels: [{
      type: String
    }],
    price: Number,
    affiliateLink: String
});



// Export the Event model
module.exports = mongoose.model('Event', EventSchema);
