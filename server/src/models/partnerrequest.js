const mongoose = require('mongoose');
const Dancer = require('./dancer');


// Define the PartnerRequest schema
const PartnerRequestSchema  = new mongoose.Schema({
    dancer: {
        Dancer
    },
    description: String,
    minAge: String,
    maxAge: String,
    listofGenders: [{ type: String }],
    listOfProficiencyLevels: [{ type: String }],
    timestamp: Date
});



// Export the PartnerRequest model
module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);
