const mongoose = require('mongoose');

// Define the PartnerRequest schema
const PartnerRequestSchema  = new mongoose.Schema({
    dancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dancer'}, //reference dancer by his Id -≥ change to original schema
    description: { type: String, required: true }, //description of the partner request
    ageOffset: { type: Number, required: true },
    listofGenders: [{ 
      type: String, 
      enum: ['female', 'male', 'unspecified'],
      required: true 
    }], //array of genders strings
    listOfProficiencyLevels: [{
      type: String,
      enum: ['beginner', 'bronze', 'silver', 'gold', 'pre-tournament 1', 'pre-tournament 2'],
      default: 'beginner',
      required: true
    }], //array of proficiency levels strings
    counterfeitEmail: { type: String, required: true },
    timestamp: {
      type: Date,
      default: Date.now 
    } //save timestamp as date. Note: Timestamp is also recoverable from the object's id
});

// Export the PartnerRequest model
module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);
