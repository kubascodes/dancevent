const mongoose = require('mongoose');

// Define the PartnerRequest schema
const PartnerRequestSchema  = new mongoose.Schema({
    dancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dancer'}, //reference dancer by his Id -≥ change to original schema
    description: { type: String, required: true }, //description of the partner request
    //ageOffset: { type: Number, required: true },
    prefAgeMin: { type: Number, required: false },
    prefAgeMax: { type: Number, required: false },
    listofGenders: [{
      type: String,
      enum: ['female', 'male', 'other'],
      required: true
    }], //array of genders strings
    listOfProficiencyLevels: [{
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: 'beginner',
      required: true
    }], //array of proficiency levels strings
    listOfDanceStyles: [{
        type: String,
        enum: [
            "latin",
            "cha-cha-cha",
            "samba",
            "jive",
            "paso doble",
            "boldero",
            "rumba",
            "mambo",
            "east coast swing",
            "standard",
            "waltz",
            "viennese waltz",
            "tango",
            "foxtrot",
            "quickstep",
            "hustle",
            "west coast swing",
            "salsa",
            "bachata",
            "various",
        ],
        default: 'standard',
        required: false
    }],
    counterfeitEmail: { type: String, required: true },
    timestamp: {
      type: Date,
      default: Date.now
    } //save timestamp as date. Note: Timestamp is also recoverable from the object's id
});

// Export the PartnerRequest model
module.exports = mongoose.model('PartnerRequest', PartnerRequestSchema);


