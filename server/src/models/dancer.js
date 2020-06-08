const mongoose = require('mongoose');
const User = require('./user'); //we require the user model to extend it

/*Note:
A nice read on discriminators used below: https://dev.to/helenasometimes/getting-started-with-mongoose-discriminators-in-expressjs--22m9
*/

// Define the Dancer schema that extends User
const DancerSchema = User.discriminator('Dancer', new mongoose.Schema({
    gender: String,
    height: Number,
    birthYear: Number,
    listOfDanceStyles: [{ type: String }],
    proficiencyLevel: String,
    prefMinAge: Number,
    prefMaxAge: Number,
    prefGender: String,
    interestedInEvents: [{ type: String }] //Array of Strings -> store events ids
})
);

// Export the Dancer model
//module.exports = mongoose.model('Dancer', DancerSchema); //do not register the schema again, it won't work
module.exports = mongoose.model('Dancer'); //save dancers to the user collection internally
