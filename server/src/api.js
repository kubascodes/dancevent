"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const passport = require("passport");
const passportStrategy = require("./controllers/passport"); //import our passport strategies
const middlewares = require("./middlewares");
const cors = require("cors");

//router import
const main = require("./router/main");
const events = require("./router/events");
const users = require("./router/users");

const app = express();

// Dev Middlewares
const morgan = require("morgan"); //for logging
app.use(morgan("combined"));

// Adding Basic Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
//app.use(middlewares.allowCrossDomain);

//router use
app.use("/", main); // homepage router
app.use("/events", events); // event-related router
app.use("/", users); // users router -> access by /login or /register/dancer

// Error handling in case none of the routes matches the request
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

// This will be triggered by all errors (e.g. 500 server errors), not just by the 404 above
app.use(middlewares.errorHandler);

module.exports = app;
