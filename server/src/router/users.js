"use strict";

//dependencies
const express  = require('express');
const router   = express.Router();
const passport = require('passport'); //passport.js authentication
const jwt = require('jsonwebtoken'); //jwt to sign the password
const middlewares    = require('../middlewares');
const config = require('../config'); //to access our Jwt Secret
const User = require('../models/user'); //to access the user database
const Dancer = require('../models/dancer'); //to create new dancers
const Organizer = require('../models/organizer'); //to create new organizers
//Unsecured routes for anyone to access

//access the /users homepage
router.get('/user', function(req, res){
  res.send("Welcome to the user's homepage");
});

//access login form
router.get('/login', function(req, res){
  res.send("Welcome to the user's login page");
});

//access organizer registration form
router.get('/register/organizer', function(req, res){
  res.send("Welcome to the organizer registration page");
});

//access dancer registration form
router.get('/register/dancer', function(req, res){
  res.send("Welcome to the dancer registration page");
});

//User Login
router.post('/login', (req, res, next) => {
  passport.authenticate('login', async (error, user, info) => {
    try {
      if (error || !user) {
        const error = new Error('An Error occured')
        return next(error);
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id : user._id, email : user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user : body }, config.JwtSecret);
        //Send back the token to the user
        return res.json({ token: token, id: body._id });
      });
    } catch (error) {
      return next(error);
    }
  })
  (req,res,next);
});

//Register as an Organizer
router.post('/register/organizer', async (req, res) => {
    //Validate the request body
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    try {
      let organizer = await Organizer.create(req.body);
      return res.status(201).json(organizer);
    }
    catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
});

//Register as a Dancer
router.post('/register/dancer', async (req, res) => {
    //Validate the request body
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    try {
      let dancer = await Dancer.create(req.body);
      return res.status(201).json(dancer);
    }
    catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
});

module.exports = router;
