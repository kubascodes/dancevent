"use strict";

const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares");
const passport = require("passport");
const User = require("../models/user");
const Organizer = require("../models/organizer");
const Event = require("../models/event");
const DanceCourse = require("../models/dancecourse");


//   ---------Public event routes for viewing events---------

//List all events
//parameters are optional e.g .de/events/?city=Munich will search for all events in munich
//List element shoulf be defined as followed to work automatically ...&list=a&list=b&...
router.get("/", async (req, res, next) => {
  //TODO based on the frontend a default startDate range should be defined to not send past event



  //Date parameters
  //if start Date is undefined the event must happen after current date
  //current implementation checks if the startDate is smaller/equal than the param endDate
  //(gte : >=; lte: <=)
  console.log(req.query)
  var start = new Date();
  if(req.query.startDate){

    start = new Date(req.query.startDate)
  }
  if(req.query.endDate){
    req.query["startDate"] = { $gte: start, $lte: req.query.endDate}   
    delete req.query["endDate"]
  }else{
    req.query["startDate"] = { $gte: start } 
  }

  //List Parameters
  //$in works like or so at least one element in params list must match one event list element
  if(req.query.listOfDanceStyles){
    req.query["listOfDanceStyles"] = {$in : req.query.listOfDanceStyles}
  }
  if(req.query.listOfProficiencyLevels){
    req.query["listOfProficiencyLevels"] = {$in : req.query.listOfProficiencyLevels}
  }
  console.log(req.query)

  try {
    //search in database based on the url-request-parameters
    //If the parameter access a list it looks if it contains the url-parameter
    //sort based on the startDate
    //limit the results to 50 (the user probably doesn't need more)
    let event = await Event.find(req.query)
      .populate("organizer", "-_id name email publicEmail")
      .sort({ startDate: "desc" })
      .limit(50)
      .exec();
    //send the found result back
    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
  //res.send("Hello event page");
});

// List a specific event
//id is number after .de/events/xxx
router.get("/:id", (req, res, next) => {
  //find event with id in database
  Event.findById(req.params.id)
    .populate("organizer", "-_id name email publicEmail")
    .exec((err, event) => {
      //error in step (will also be called if <id> has not correct the pattern)
      if (err) {
        return res.status(500).json({
          error: "Internal server error",
          message: err.message,
        });
      }
      //Query is empty (event does not exist)
      if (!event) {
        return res.status(404).json({
          error: "Event not found",
        });
      }
      //successful query -> send found event
      return res.status(200).json(event);
    });
});

//   --------- Secured event routes for manipulation which require authentication---------

//1. Create a new event
router.post(
  "/",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      //get user to check if it is an organizer (authentication)
      let user = await User.findById(req.user._id).exec();
      if (user && user.userType == "Organizer") {
        //add the user as foreign key to the event
        req.body["organizer"] = user._id;
        //Save the event to the database
        let newEvent = null;
        if (req.body["type"] === "course") {
          newEvent = await DanceCourse.create(req.body);
        } else {
          newEvent = await Event.create(req.body);
        }

        //return the new Event with status Code: 201 - Created
        return res.status(201).json(newEvent);
      } else {
        //403 -> Forbidden request  (user did not have the right to post events)
        res.status(403).json({
          error: "Current user is not an Oranizer",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//2. Update an event by Id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res, next) => {
    try {

      //get Event ID from URL Param
      const uid = req.params.id
      //get the event
      let event = await Event.findById(uid).exec();
      //Check if Event is owned by the Organizer (got from JWT Token)
      if(event && event.organizer == req.user._id){
        //update event with the body
        var updatedEvent = await Event.findByIdAndUpdate(uid, req.body);
        return res.status(201).json(updatedEvent);
      }else{
        return res.status(403).json({
          error: "User has no Authority to change the Event",
        })
      };
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//3. Delete an event by its id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res, next) => {
    // Check if the logged in user owns the event
    const uid = req.params.id;
    let event = await Event.findById(uid).exec();

    if(event && event.organizer == req.user._id){
      Event.findOneAndDelete({ _id: uid }, (err, event) => {
        //error in step (will also be called if <id> has not correct the pattern)
        if (err) {
          return res.status(500).json({
            error: "Internal server error",
            message: err.message,
          });
        }
        //Query is empty (event does not exist)
        if (!event) {
          return res.status(404).json({
            error: "Event not found",
          });
        }
        //successful query -> send deleted event
        res.send(`Event deleted: ${event._id}`);
      });
    }else{
      return res.status(403).json({
        error: "User has no Authority to change the Event",
      })
    };
  }
);

module.exports = router;
