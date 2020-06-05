const mongoose = require('mongoose');
const Event = require('./event')

// Define the DanceCourse schema
const DanceCourseSchema  = new Event({
  endDate: Date,
  interval: Mixed
});


// Export the DanceCourse model
module.exports = mongoose.model('DanceCourse', DanceCourseSchema);
