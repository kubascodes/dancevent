const mongoose = require('mongoose');
const Dancer = require('./dancer');


// Define the PartnerRequest schema
const PartnerRequestSchema  = new mongoose.Schema({
    dancerId: String, //reference dancer by his Id -≥ change to original schema
    description: String, //description of the partner request
    minAge: Number, //save age as a number
    maxAge: Number, //save age as a number
    listofGenders: [{ type: String }], //array of genders strings
    listOfProficiencyLevels: [{ type: String }], //array of proficiency levels strings
    timestamp: Date //save timestamp as date. Note: Timestamp is also recoverable from the object's id 
});



// Export the PartnerRequest model
module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);
