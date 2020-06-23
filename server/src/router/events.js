"use strict";

const express  = require('express');
const router   = express.Router();
const middlewares = require('../middlewares');
const passport = require('passport');
const User = require('../models/user');
const Organizer = require('../models/organizer');
const multer = require('multer')
const Event = require('../models/event');


// ------------- Define Parameters to save images -------------
//define where to Storage
const storage = multer.diskStorage({
  //define the relative folder
  destination: function(req, file, cb){
    //null is the catch
    cb(null, './pictures/events/');

  },
  //define the filename
  filename: function(req, file, cb){
    //filename is the userID + EventTitle
    cb(null, req.user._id + "_" + req.body.title);
  }
})


const fileFilter = (req, file, cb) => {
  //files can only be pictures with extensions .jpg and .png
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //file will be stored on disk
    cb(null, true)
  }else{
    //file will not be stored but also no catching
    cb(null, false)
  }
  
}

//define all previously set parameters to the multer
const upload = multer({
  storage: storage,
  //max filesize
  limits: {filesize: 1024*1024*5},
  fileFilter : fileFilter


})

//   ---------Public event routes for viewing events---------

//List all events 
//parameters are optional e.g .de/events/?city=Munich will search for all events in munich
router.get('/', async (req, res, next) => {
  
  //TODO based on the frontend a default startDate range should be defined to not send past event

   try {
        //search in database based on the url-request-parameters
        //If the parameter access a list it looks if it contains the url-parameter
        //sort based on the startDate
        //limit the results to 50 (the user probably doesn't need more)
         let event = await Event.find(req.query).sort({'startDate': 'desc'}).limit(50).exec();
         //send the found result back
        return res.status(200).json(event);
  } catch(err) {
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
  //res.send("Hello event page");
}); 

// List a specific event 
//id is number after .de/events/xxx
router.get('/:id', (req, res, next) => {
    //find event with id in database
    var event = Event.findById(req.params.id, (err, event) =>{
      //error in step (will also be called if <id> has not correct the pattern)
      if(err){
        return res.status(500).json({
          error: 'Internal server error',
          message: err.message
        })
      ;}
      //Querry is empty (event does not exist)
      if(!event){return res.status(404).json({
        error: 'Event not found',  
      });}
      //successfull querry -> send found event
      return res.status(200).json(event);
    })
}); 


//   --------- Secured event routes for manipulation which require authentication---------

//1. Create a new event
router.post('/', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), async (req, res, next) => {
    try {

      //get user to check if it is an organizer (authentication)
      let user = await User.findById(req.user._id).exec();
      if(user && user.userType == "Organizer"){
        //add the user as foreign key to the event
        req.body["organizer"] = user._id
        //Save the event to the databas
        let newEvent = await Event.create(req.body);

        //old---add the event to the user (Organizer)
        //old  await Organizer.updateOne( { _id: req.user._id}, { $push: { events: newEvent._id } } );
        
        //return the new Event with status Code: 201 - Created
        return res.status(201).json(newEvent);
      }else{
        //403 -> Forbidden request  (user did not have the right to post events)
        res.status(403).json({
          error: 'Current user is not an Oranizer'
        });
      }

    }
    catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
});

//1. Create a new event with picture
//after authenticatin the multer middleware is called which save the picture to the filesystem
router.post('/pic', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), upload.single('picture'), async (req, res, next) => {
    try {
      console.log(req.file)

      //get user to check if it is an organizer (authentication)
      let user = await User.findById(req.user._id).exec();
      if(user && user.userType == "Organizer"){
        //add the user as foreign key to the event
        req.body["organizer"] = user._id
        //add picture path to the event
        req.body["picture"] = req.file.path

        //Save the event to the databas 
        let newEvent = await Event.create(req.body);

        //old---add the event to the user (Organizer)
        //old  await Organizer.updateOne( { _id: req.user._id}, { $push: { events: newEvent._id } } );
        
        //return the new Event with status Code: 201 - Created
        return res.status(201).json(newEvent);
      }else{
        //403 -> Forbidden request  (user did not have the right to post events)
        res.status(403).json({
          error: 'Current user is not an Oranizer'
        });
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
