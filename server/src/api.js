"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const middlewares = require('./middlewares');

const auth  = require('./routes/auth');
const events = require('./routes/events');


const app = express();

// Adding Basic Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewares.allowCrossDomain);


// Basic route
app.get('/', (req, res) => {
    res.json({
        name: 'Dancevent Backend'
    });
});

// app routes
app.use('/auth'  , auth);
app.use('/events', events);


module.exports = app;
