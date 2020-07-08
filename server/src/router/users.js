"use strict";

//dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport"); //passport.js authentication
const jwt = require("jsonwebtoken"); //jwt to sign the password
const middlewares = require("../middlewares");
const config = require("../config"); //to access our Jwt Secret
const User = require("../models/user"); //to access the user database
const Dancer = require("../models/dancer"); //to create new dancers
const Organizer = require("../models/organizer"); //to create new organizers
const Request = require("../models/partnerrequest"); // to access the partner requests
//Unsecured routes for anyone to access

//access the /users homepage
router.get("/user", function (req, res) {
  res.send("Welcome to the user's homepage");
});

//access login form
router.get("/login", function (req, res) {
  res.send("Welcome to the user's login page");
});

//access organizer registration form
router.get("/register/organizer", function (req, res) {
  res.send("Welcome to the organizer registration page");
});

//access dancer registration form
router.get("/register/dancer", function (req, res) {
  res.send("Welcome to the dancer registration page");
});

//List all dancer on Dance Partner Page
/*router.get("/dancepartner", async (req, res, next) => {
  try {
    //search in database based on the url-request-parameters
    let dancer = await Dancer.find(req.query).exec();
    //send the found result back
    return res.status(200).json(dancer);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});*/

//List all dance request on Dance Partner Page
//TODO: sort is missing, events
//router.get("/dancepartner", async (req, res, next) => {
router.get("/dancepartner", async (req, res, next) => {
  try {
    //search in database based on the url-request-parameter
    let request = await Request.find(req.query).populate("dancerId").exec();
    //send the found result back
    return res.status(200).json(request);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

// List a specific request
//id is number after .de/dancepartner/xxx
/*router.get("/:id", (req, res, next) => {
  //find request with id in database
  var request = Request.findById(req.params.id, (err, request) => {
    //error in step (will also be called if <id> has not correct the pattern)
    if (err) {
      return res.status(500).json({
        error: "Internal server error",
        message: err.message,
      });
    }
    //Query is empty (event does not exist)
    if (!request) {
      return res.status(404).json({
        error: "Request not found",
      });
    }
    //successful query -> send found event
    return res.status(200).json(request);
  });
});*/

//User Login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (error, user, info) => {
    try {
      if (error || !user) {
        const error = new Error("An Error occured");
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, config.JwtSecret);
        //Send back the token to the user
        return res.json({ token: token, id: body._id });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//Register as an Organizer
router.post("/register/organizer", async (req, res) => {
  //Validate the request body
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  try {
    let organizer = await Organizer.create(req.body);
    return res.status(201).json(organizer);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Register as a Dancer
router.post("/register/dancer", async (req, res) => {
  //Validate the request body
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  try {
    let dancer = await Dancer.create(req.body);
    return res.status(201).json(dancer);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Register as a Request
router.post("/createrequest", passport.authenticate("jwt", { session: false }), async (req, res) => {

  //USER ID AVAILABLE HERE
  let userId = req.user._id;

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty ",
    });

  try {
    let request = await Request.create(req.body);
    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// delete Request
router.delete("/dancepartner/request/delete", async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty ",
    });

  try {
    await Request.findByIdAndRemove(req.body.id).exec();
    return res.status(201).json({message: 'Request with id${req.body.id} was deleted'});
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});



module.exports = router;
