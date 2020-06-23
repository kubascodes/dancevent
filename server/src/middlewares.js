"use strict";

const jwt = require("jsonwebtoken");
const config = require("./config");

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.status(200).send(200);
  } else {
    next();
  }
};

const checkAuthentication = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = "";
  if (req.headers.authorization) {
    token = req.headers.authorization.substring(4);
  }

  if (!token)
    return res.status(401).send({
      error: "Unauthorized",
      message: "No token provided in the request",
    });

  // verifies secret and checks exp
  jwt.verify(token, config.JwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).send({
        error: "Unauthorized",
        message: "Failed to authenticate token.",
      });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

const errorHandler = (error, req, res, next) => {
  // If you call next() with an error after you have started writing the response (for example, if you encounter an error while streaming the response to the client) the Express default error handler closes the connection and fails the request.
  // So in a custom error handler like this one, you must delegate to the default Express error handler, when the headers have already been sent to the client. (see http://expressjs.com/en/guide/error-handling.html)
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
  res.render("error", { error: err });
};

module.exports = {
  allowCrossDomain,
  checkAuthentication,
  errorHandler,
};
