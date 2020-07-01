const mongoose = require("mongoose");
const options = { discriminatorKey: "eventType", collection: "events" }; //to allow inheritance of data models, i.e. we want to store the dance course in the events collection

// Define the Event schema
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["ball", "competition", "course", "party"],
      default: "course",
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizer",
    },
    description: { type: String, required: false },
    startDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    picture: { type: String, required: false }, //relative filepath. Possible to fetch picture with path
    listOfDanceStyles: [
      {
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
        default: "standard",
        required: true,
      },
    ], //Array of dance styles
    listOfProficiencyLevels: [
      {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        // enum: ["beginner", "bronze", "silver", "gold", "pre-tournament 1", "pre-tournament 2"],
        default: "beginner",
        required: true,
      },
    ], //Array of proficiency levels
    price: { type: Number, required: true },
    promoCode: { type: String, required: false },
  },
  options
); //pass the options variable to allow for inheritance

// Export the Event model
module.exports = mongoose.model("Event", EventSchema);
