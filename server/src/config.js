"use strict";

//In a normal case this file must not be public available (also it would be excluded in gitignore)

// Configuration variables
const port      = process.env.PORT        || '3000';
const mongoURI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/dancedb';
const JwtSecret = process.env.JWT_SECRET  || 'ourSecretDanceSauce2020';

//Configuration for mailclient
//Currently test account at ethereal.email
//for testing purposes just create an account (one click)
const mail = {
    host: process.env.MAILHOST  || "smtp.ethereal.email",
    port: process.env.MAILPORT  || 587,
    secure: process.env.MAILSECURITY  || false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILUSER  || "peggie.kemmer30@ethereal.email", // generated ethereal user
      pass: process.env.MAILPASS  || '8V69F4gU47dDpvzT9Z', // generated ethereal password
    },
};


module.exports = {
    port,
    mongoURI,
    JwtSecret,
    mail,

};
