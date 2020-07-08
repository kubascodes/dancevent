const mongoose = require("mongoose");
const User = require("./user"); //we require the user model to extend it
const options = { discriminatorKey: "eventType", collection: "events" };

// Define the Organizer schema that extends User
const OrganizerSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    description: { type: String, required: false },
    publicEmail: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  options
);

// Export the Organizer model
module.exports = User.discriminator("Organizer", OrganizerSchema); //save organizers to the user collection internally
