const mongoose = require('mongoose');
const options = { discriminatorKey: 'eventType', collection: 'events' }; //to allow inheritance of data models, i.e. we want to store the dance course in the events collection

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
    }], //Array of dance styles
    listOfProficiencyLevels: [{
      type: String
    }], //Array of dance styles
    price: Number,
    affiliateLink: String
}, options); //pass the options variable to allow for inheritance

// Export the Event model
module.exports = mongoose.model('Event', EventSchema);
