const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const EventController = require('../controllers/event');


router.get('/', EventController.list); // List all events
router.post('/', middlewares.checkAuthentication, EventController.create); // Create a new event
router.get('/:id', EventController.read); // Read an event by Id
router.put('/:id', middlewares.checkAuthentication, EventController.update); // Update an event by Id
router.delete('/:id', middlewares.checkAuthentication, EventController.remove); // Delete an event by Id


module.exports = router;
