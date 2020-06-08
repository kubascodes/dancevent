const mongoose = require('mongoose');
const Event = require('./event')

// Define the DanceCourse schema
const DanceCourseSchema  = Event.discriminator('DanceCourse', new mongoose.Schema({
  endDate: Date,
  interval: Mixed //what's meant by this? Is it a calculation of start date and end date?
})
);

// Export the DanceCourse model
module.exports = mongoose.model('DanceCourse');
