"use strict";

const express  = require('express');
const router   = express.Router();
const middlewares = require('../middlewares');
const passport = require('passport');
const User = require('../models/user');
const Event = require('../models/event');

//Public Routes for viewing events
router.get('/', (req, res, next) => {
  res.send("Hello event page");
}); // List all events
router.get('/:id', (req, res, next) => {
  res.send("Hello specific event page");
}); // List all events

//Secured events routes which require authentication
//1. Create a new event
router.post('/', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), async (req, res, next) => {
    try {
      //authenticate user internally
      //TODO: the user must be an organizer
      let user = await User.findOne({_id: req.user._id});
      if (!user) { return; }
      //if user is found continue
      else {
        let newEvent = await Event.create(req.body); //event is a reserved keyword, using newEvent instead
        return res.status(201).json(newEvent);
      }
    }
    catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
});

//2. Update an event by Id
router.put('/:id', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), async (req,res,next) => {
  try {
    //here we want to update an existing event
    //TODO: check the user who must be an organizer and must own the event
  }
  catch (error) {
    next(error); //handle error by error handling middleware
  }
});

//3. Delete an event by its id
router.delete('/:id', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), async (req,res,next) => {
  try {
    //here we want to delete an existing event
    //TODO: check the user who must be an organizer and must own the event
  }
  catch (error) {
    next(error); //handle error by error handling middleware
  }
});

module.exports = router;
