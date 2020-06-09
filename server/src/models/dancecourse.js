const mongoose = require('mongoose');
const Event = require('./event')

// Define the DanceCourse schema
const DanceCourseSchema  = Event.discriminator('DanceCourse', new mongoose.Schema({
  endDate: { type: Date, required: true },
  interval: {
    type: String, 
    enum: ['once', 'daily', 'weekly', 'every two weeks', 'monthly'],
    default: 'once',
    required: true 
  },
  })
);

// Export the DanceCourse model
module.exports = mongoose.model('DanceCourse');
