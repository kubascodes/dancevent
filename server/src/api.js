"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const passportStrategy = require('./controllers/passport'); //import our passport strategies
const middlewares = require('./middlewares');

//router import
const main = require('./router/main');
const events = require('./router/events');
const users = require('./router/users');

const app = express();

// Adding Basic Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(middlewares.allowCrossDomain);

//router use
app.use('/', main); // homepage router
app.use('/events', events); // event-related router
app.use('/', users); // users router -> access by /login or /register/dancer


module.exports = app;
