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
const Request = require("../models/partnerrequest"); //returning requests to profile
const Event = require("../models/event"); //returning events to profile
const ObjectId = require('mongoose').Types.ObjectId;
//Unsecured routes for anyone to access

//access the /profile of the user
router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    //console.log(req.user);
    try {
      let user = await User.findOne({ _id: req.user._id });
      //setting the response object
      let response = {};
      //if dancer, add events and requests to the response
      if (user.userType === "Dancer") {
        let events = await Event.find().where('_id').in(user.interestedInEvents).select('-organizer -_id').sort( {startDate: 1} ).limit(5);
        let requests = await Request.find({ 'dancerId': new ObjectId(user._id)}).select('-dancerId -_id').sort( {timestamp: 1} ).limit(5);
        response.requests = requests;
        response.events = events;
      }
      //if organizer, add events to the response
      else if (user.userType === "Organizer") {
        let events = await Event.find({ 'organizer': new ObjectId(user._id)}).select('-organizer -_id').sort( {startDate: 1} ).limit(5);
        response.events = events;
      }
      //Removing sensitive properties from user
      user.password = null;
      user._id = null;
      user.__v = null;
      //adding the user object to the response
      response.user = user;

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//List all dance request on Dance Partner Page
//TODO: sort is missing, events
router.get("/dancepartner", async (req, res, next) => {
  try {
    //search in database based on the url-request-parameter
    // filter dance styles in a listof dance styles selected in the filer
    let danceStyles = req.query.listOfDanceStyles;
    if (danceStyles) {
      req.query.listOfDanceStyles = {$in: danceStyles};
    }
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

//User Login Route
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
        const body = {
          _id: user._id,
          email: user.email
        };
        //Sign the JWT token and populate the payload with the user email and id
        const token = await jwt.sign({ user: body }, config.JwtSecret);
        //Send back the token to the user
        const response = {
          name: user.name,
          email: user.email,
          picture: user.picture,
          userType: user.userType,
          token: token
        }
        return res.json(response);
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
    //create a new organizer
    let organizer = await Organizer.create(req.body);
    //populate the body request for the JWT token issuing with the newly created organizer
    const body = {
      _id: organizer._id,
      email: organizer.email
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: organizer.name,
      email: organizer.email,
      picture: organizer.picture,
      userType: organizer.userType,
      token: token
    }
    return res.status(201).json(response);
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
  console.log(req.body);
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  try {
    //create a new dancer
    let dancer = await Dancer.create(req.body);
    //populate the body request for the JWT token issuing with the newly created dancer
    const body = {
      _id: dancer._id,
      email: dancer.email
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: dancer.name,
      email: dancer.email,
      picture: dancer.picture,
      userType: dancer.userType,
      token: token
    }
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Register as a Request
router.post("/createrequest", passport.authenticate("jwt", { session: false }), async (req, res) => {

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty ",
    });

  req.body.dancerId = req.user._id;

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


// Update user via POST request -> TODO: should be PUT
router.post(
  "/profile/update",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    //console.log(req.user);
    // Expect an array as the req.body such as [{"propName": "name", "value": "new name"}, {"propName": "city", "value": "new city"}], loop through this array and construct an updateOps object that is used to execute the update
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    // Update the user where the _id fits the one fetched from the token --> $set is a mongoose keywork
    User.update(
      { _id: req.user._id },
      {
        $set: updateOps,
      }
    )
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => next(err));
  }
);

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
