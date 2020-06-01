"use strict";

// Configuration variables
const port      = process.env.PORT        || '3000';
const mongoURI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/dancedb';
const JwtSecret = process.env.JWT_SECRET  || 'ourSecretDanceSauce2020';


module.exports = {
    port,
    mongoURI,
    JwtSecret,
};
