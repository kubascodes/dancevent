"use strict";

//dependencies
const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares");

//Unsecured routes for anyone to access

// Basic homepage route
router.get("/", (req, res) => {
  res.json({
    name: "Welcome to Dancevent Backend",
    instructions: "Check out other routes via Postman! Ex. /events or /users",
  });
});

module.exports = router;
