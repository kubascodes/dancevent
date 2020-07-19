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
const ObjectId = require("mongoose").Types.ObjectId;
const mail = require("../services/mail")
//Unsecured routes for anyone to access

//access the /profile of the user
router.get(
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
        let events = await Event.find()
          .where("_id")
          .in(user.interestedInEvents)
          .select("-organizer")
          .sort({ startDate: 1 })
          .limit(5);
          let requests =  await Request.find({ dancer: new ObjectId(user._id) })
            .populate("dancer", "-_id ")
            .populate("event", null, {'startDate': { $gte: new Date() }})
          .sort({ timestamp: 1 });
          let requestsEvent = requests.filter(request =>  request.event != null);
        response.requests = requestsEvent;
        response.events = events;
      }
      //if organizer, add events to the response
      else if (user.userType === "Organizer") {
        let events = await Event.find({ organizer: new ObjectId(user._id) })
          .select("-organizer")
          .sort({ startDate: 1 })
          .limit(5);
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

router.post(
  "/password",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    //console.log(req.user);
    try {
      //setting the response object
      let pwdChange = await User.findOneAndUpdate({ _id: req.user._id },{ password: req.password});
      return res.status(200).json("Success!");
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);



//access just the user information with /user
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    try {
      let user = await User.findOne({ _id: req.user._id });

      //Removing sensitive properties from user
      user.password = null;
      user._id = null;
      user.__v = null;
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//access the events the user is interested in and (in case the user is an organizer) organizes
router.get(
  "/profile/events",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    /*AFTER AUTHORIZATION OF THE JWT TOKEN, USER ID IS ACCESSIBLE IN REQ.USER*/
    //console.log(req.user);
    try {
      let user = await User.findOne({ _id: req.user._id });
      //setting the response object
      let response = {};
      //if dancer, add events the user is interested in to the response
      if (user.userType === "Dancer") {
        let interestedInEvents = await Event.find()
          .where("_id")
          .in(user.interestedInEvents)
          .select("-organizer")
          .sort({ startDate: 1 });
        response.interestedInEvents = interestedInEvents;
      }
      //if organizer, add organized events as well as those the organizer is interested in to the response
      else if (user.userType === "Organizer") {
        let interestedInEvents = await Event.find()
          .where("_id")
          .in(user.interestedInEvents)
          .select("-organizer")
          .sort({ startDate: 1 });
        let organizedEvents = await Event.find({
          organizer: new ObjectId(user._id),
        })
          .select("-organizer")
          .sort({ startDate: 1 });
        response.interestedInEvents = interestedInEvents;
        response.organizedEvents = organizedEvents;
        response.userType = user.userType;
      }
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
//TODO: Sort missing
router.get(
    "/dancepartner",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
        try {

            // do not send back my own created requests
            let userId = req.user._id;
            req.query.dancer = {$ne: userId};
            var myAge = null;

            // match request and user information
            //TODO: Checkbox - Check if still right or needs if needs to check of the opposite
            // BUG at the moment: Somhow there is a bug. it should normaly be the orther way around
            if(req.query.allRequests == "viewAllRequests"){
                let user = await User.findOne({ _id: userId });
                if(user){
                    req.query.listofGenders = user.gender;
                    req.query.listOfProficiencyLevels = user.proficiencyLevel;
                    myAge = new Date().getFullYear() - user.yearOfBirth
                }
            };
            delete req.query.allRequests;



            // Dancer Data Filter
            var dancerValues = [];

            if(req.query.prefAgeMinDancer) {
                let minAge = req.query.prefAgeMinDancer;
                let minYearOfBirth = new Date().getFullYear() - minAge;
                dancerValues.push({'yearOfBirth': {$lte: minYearOfBirth}});
                delete req.query.prefAgeMinDancer;
            }

            if(req.query.prefAgeMaxDancer){
                let maxAge = req.query.prefAgeMaxDancer;
                let maxYearOfBirth = new Date().getFullYear() - maxAge;
                dancerValues.push({'yearOfBirth': {$gte: maxYearOfBirth}});
                delete req.query.prefAgeMaxDancer;
            }

            if(req.query.listofGendersDancer){
                let gender = req.query.listofGendersDancer;
                dancerValues.push({'gender': gender});
                delete req.query.listofGendersDancer;
            }
            if(req.query.listOfProficiencyLevelsDancer){
                let proficiencyLevel = req.query.listOfProficiencyLevelsDancer;
                dancerValues.push({'proficiencyLevel': proficiencyLevel});
                delete req.query.listOfProficiencyLevelsDancer;
            }
            console.log(dancerValues);

            // filter dance styles request
            let danceStyles = req.query.listOfDanceStyles;
            if (danceStyles) {
                req.query.listOfDanceStyles = { $in: danceStyles };
            }

            //Event


            console.log(req.query);
            var eventValue = [];
            var start = new Date();
            if (req.query.startDate) {
                start = new Date(req.query.startDate);
                console.log("START"+start);
            }
            if (req.query.endDate) {
                eventValue.push({'startDate': { $gte: start, $lte: req.query.endDate }});
                delete req.query["startDate"];
                delete req.query["endDate"];
            } else {
                eventValue.push({'startDate': { $gte: start }});
                delete req.query["startDate"];
            };
            if(req.query.city){
                let city = req.query.city;
                eventValue.push({'city': city});
                delete req.query.city;
            }
            if(req.query.type){
                let type = req.query.type;
                eventValue.push({'type': type});
                delete req.query.type;
            }

            console.log(eventValue);

            // check, if we just need to filter the request information or also the dancer information and return the result of that fetch
            if(dancerValues.length == 0 && eventValue.length == 0){
                await Request.find(req.query).populate("dancer event", "-_id").exec(function(err, docs){
                    if(myAge){
                        docs = docs.filter(function(doc){
                            return myAge >= doc.prefAgeMin && myAge <= doc.prefAgeMax;
                        })
                    }
                    return res.status(200).json(docs);
                });
            };
            if(dancerValues.length && eventValue.length){
                let dancerCheck = { $and: dancerValues};
                let eventCheck = {$and: eventValue};
                await Request.find(req.query
                ).populate( "dancer", null , dancerCheck
                ).populate("event", null, eventCheck).exec(function(err, docs){
                    docs = docs.filter(function(doc){
                        if(myAge){
                            if( myAge >= doc.prefAgeMin && myAge <= doc.prefAgeMax && doc.dancer != null && doc.event != null){
                                doc.dancer._id = null;
                                return doc;
                            };
                        }
                        else {
                            if( doc.dancer != null && doc.event != null){
                                doc.dancer._id = null;
                                return doc;
                            };
                        }
                    })
                    return res.status(200).json(docs);
                });
            };
            if(dancerValues.length==0 && eventValue.length){
                let eventCheck = {$and: eventValue};
                await Request.find(req.query
                ).populate( "event", null, eventCheck
                ).populate("dancer", "-_id").exec(function(err, docs){
                    docs = docs.filter(function(doc){
                        if(myAge){
                            return myAge >= doc.prefAgeMin && myAge <= doc.prefAgeMax && doc.event != null;
                        }
                        else {
                            return doc.event != null;
                        }
                    })
                    return res.status(200).json(docs);
                });
            };
            if(dancerValues.length && eventValue.length==0){
                let dancerCheck = { $and: dancerValues};
                await Request.find(req.query
                ).populate( "dancer", null , dancerCheck
                ).populate("event", "-_id").exec(function(err, docs){
                    docs = docs.filter(function(doc){
                        if(myAge){
                            if( myAge >= doc.prefAgeMin && myAge <= doc.prefAgeMax && doc.dancer != null ){
                                doc.dancer._id = null;
                                return doc;
                            }
                        }
                        else {
                            if (doc.dancer != null){
                                doc.dancer._id = null;
                                return doc;
                            };
                        }
                    })
                    return res.status(200).json(docs);
                });
            };

        } catch (err) {
            return res.status(500).json({
                error: "Internal server error",
                message: err.message,
            });
        }

    });


//List all dance request on Dance Partner Page
router.get( "/loggedout/requests", async (req, res, next)  => {
        try {

            await Request.find(req.query).populate("event", null, {'startDate': { $gte: new Date() }}).exec(function(err, docs){
                docs = docs.filter(function(doc){
                    if(doc.event != null){
                        doc.event._id = null;
                        return doc;
                    }
                })
                return res.status(200).json(docs);
            });

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
          email: user.email,
        };
        //Sign the JWT token and populate the payload with the user email and id
        const token = await jwt.sign({ user: body }, config.JwtSecret);
        //Send back the token to the user
        const response = {
          name: user.name,
          email: user.email,
          picture: user.picture,
          userType: user.userType,
          token: token,
        };
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
      email: organizer.email,
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: organizer.name,
      email: organizer.email,
      picture: organizer.picture,
      userType: organizer.userType,
      token: token,
    };
    //Send Welcome Mail
    await mail.sendCreateMail(organizer.name, organizer.email, 
      //Mail is not crucial for user does only log it interbaly
      (err, data)=> {if(err){console.log("Mailclient error at organizercreation" + err)} });
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
      email: dancer.email,
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: dancer.name,
      email: dancer.email,
      picture: dancer.picture,
      userType: dancer.userType,
      token: token,
    };
    //Send Welcome Mail
    await mail.sendCreateMail(dancer.name, dancer.email, 
      //Mail is not crucial for user does only log it interbaly
      (err, data)=> {if(err){console.log("Mailclient error at dancercreation" + err)} });
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//updating users
//Register as an Organizer
router.post("/update/organizer", passport.authenticate("jwt", { session: false }), async (req, res) => {
  //Validate the request body
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body is empty",
    });

  try {
    //create a new organizer
    let organizer = await Organizer.findOneAndUpdate(req.body);
    //populate the body request for the JWT token issuing with the newly created organizer
    const body = {
      _id: organizer._id,
      email: organizer.email,
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: organizer.name,
      email: organizer.email,
      picture: organizer.picture,
      userType: organizer.userType,
      token: token,
    };
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Register as a Dancer
router.post("/update/dancer", passport.authenticate("jwt", { session: false }), async (req, res) => {
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
      email: dancer.email,
    };
    //sign the JWT token and populate the payload with the user email and id
    const token = await jwt.sign({ user: body }, config.JwtSecret);
    //return the token to the user (redirect to homepage will happen on the client);
    const response = {
      name: dancer.name,
      email: dancer.email,
      picture: dancer.picture,
      userType: dancer.userType,
      token: token,
    };
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

//Register as a Request
router.post(
  "/createrequest",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({
        error: "Bad Request",
        message: "The request body is empty ",
      });

    req.body.dancer = req.user._id;
    console.log(req.body.dancer);
    console.log(req.body);

    try {
      let request = await Request.create(req.body);
      return res.status(201).json(request);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
);

//send Mail to the partnerrquest owner
router.post(
  "/request/contact",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    try{
      let user = await User.findById(req.user._id).exec(); 
      if (user && user.userType == "Dancer") {


        const request = await Request.findById(req.body.id).populate("dancer", "email name").populate("event", "title")
        return await mail.sendRequestMail(request, req.body.text, user, function(err, data){
          if(err){
            res.status(500).json({
              error: "Internal server error",
              message: "Problem with mailclient. Please try again later." + error.message,
            });
          } else {
            res.status(200).json({name: 'Email sent'})
          }
        });
      } else {
        //403 -> Forbidden request  (user did not have the right to post events)
        res.status(403).json({
          error: "Current user is not an Dancer",
        });
      }
    }catch (error) {
      //if an error be caught here it is most likely due to an DB error
      return res.status(500).json({
        error: "Internal server error",
        message: "Error with database. Please try again later." + error.message,
      });
    }
  }  
  
);

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
router.delete(
  "/profile/request/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);

    if (Object.keys(req.body).length === 0)
      return res.status(400).json({
        error: "Bad Request",
        message: "The request body is empty ",
      });
    let reqId = req.body.id;
    let request = await Request.findById(reqId).exec();

    if (request && req.user._id == request.dancer._id) {
      if (!request)
        return res.status(404).json({
          error: "Request not found",
          message: "The request the request is not found",
        });

      try {
        await Request.findByIdAndRemove(req.body.id).exec();
        return res
          .status(201)
          .json({ message: "Request with id${req.body.id} was deleted" });
      } catch (error) {
        return res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    } else {
      return res.status(403).json({
        error: "Unouthoriesed to delete this request",
      });
    }
  }
);

module.exports = router;
