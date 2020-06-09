const mongoose = require('mongoose');
const User = require('./user'); //we require the user model to extend it

/*Note:
A nice read on discriminators used below: https://dev.to/helenasometimes/getting-started-with-mongoose-discriminators-in-expressjs--22m9
*/

// Define the Dancer schema that extends User
const DancerSchema = User.discriminator('Dancer', new mongoose.Schema({
    gender: { 
        type: String, 
        enum: ['female', 'male', 'unspecified'],
        required: true 
    },
    height: { type: Number, required: false },
    birthYear: { type: Number, required: true },
    listOfDanceStyles: [{
        type: String,
        enum: ['latin', 'cha-cha-cha', 'samba', 'jive', 'paso doble', 'boldero', 'rumba', 'mambo', 'east coast swing', 'standard', 'waltz', 'viennese waltz', 'tango', 'foxtrot', 'quickstep', 'hustle', 'west coast swing', 'salsa', 'bachata', 'various'],
        default: 'standard',
        required: true
      }],
    proficiencyLevel: { 
        type: String, 
        enum: ['beginner', 'bronze', 'silver', 'gold', 'pre-tournament 1', 'pre-tournament 2'],
        default: 'beginner',
        required: true 
    },
    prefAgeOffset: { type: Number, required: false },
    prefGender: { 
        type: String, 
        enum: ['female', 'male', 'unspecified'],
        required: true 
    },
    interestedInEvents: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'event' 
    }] //Array of Strings -> store events ids
})
);

// Export the Dancer model
//module.exports = mongoose.model('Dancer', DancerSchema); //do not register the schema again, it won't work
module.exports = mongoose.model('Dancer'); //save dancers to the user collection internally
