const mongoose = require('mongoose');

// Define the PartnerRequest schema
const PartnerRequestSchema  = new mongoose.Schema({
    dancerId: {
      type: Schema.Types.ObjectId,
      ref: "Dancer"}, //reference dancer by his Id -≥ change to original schema
    description: String, //description of the partner request
    minAge: Number, //save age as a number
    maxAge: Number, //save age as a number
    listofGenders: [{ type: String }], //array of genders strings
    listOfProficiencyLevels: [{ type: String }], //array of proficiency levels strings
    timestamp: {
      type: Date,
      default: Date.now } //save timestamp as date. Note: Timestamp is also recoverable from the object's id
});

// Export the PartnerRequest model
module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);
