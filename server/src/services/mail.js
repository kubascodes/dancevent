"use strict";
const nodemailer = require("nodemailer");
const config = require('../config')

//This Service handles mailsending

let transporter = nodemailer.createTransport(config.mail)

const sendRequestMail = async (request, text, user, cb) => {
    //pronomen for mail
    let pro1 = user.gender === 'male' ? 'he' : user.gender === 'female' ? 'she' : 'he/she'
    let pro2 = user.gender === 'male' ? 'him' : user.gender === 'female' ? 'her' : 'him/her'

    //The Message
    let message =
`Hey ${request.dancer.name},

the user ${user.name} at dancevent has responded to your partnerrequest. This request was posted for the event ${request.event.title}.

You can conntact ${pro2} by writing to this email address: ${user.email}.

${pro1.charAt(0).toUpperCase() + pro1.slice(1)} wrote a Message for you: 


${text}


If you are not registered at dancevent please ignore this message.

Sincerly,
Your dancevent team
`

    //The Mail
    let mailoptions = {
        from: '"Dancevent" <Partnerrequest@dancevent.de>', // sender address
        to: request.dancer.email, // list of receivers
        subject: "New partnerrequest at dancevent from " + user.name, // Subject line
        text: message, // plain text bodyq
    }

    await sendmail(mailoptions, cb)
};

const sendCreateMail = async (name, email ,cb) => {

    //The Message
    let message =
`Hey ${name},

Welcome to dancevent. Your account is now registered.

Sincerly,
Your dancevent team
`

    //The Mail
    let mailoptions = {
        from: '"Dancevent" <register@dancevent.de>', // sender address
        to: email, // list of receivers
        subject: "Account created",  // Subject line
        text: message, // plain text body
    }


    // send mail with defined transport object
    await sendmail(mailoptions, cb)
}

const sendmail = async (mailoptions, cb) => {
    await transporter.sendMail(mailoptions
        , (err, data) => {
            if (err) {
                cb(err, null);
            } else {
                cb(null, err)
            }
        }
    );

}

module.exports = {sendRequestMail, sendCreateMail}



