const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const eventController = require('../controllers/eventsController');

router.post('/events', authAdmin, eventController.createEvent);
router.get('/events', authAdmin, eventController.getAllEvents);
router.delete('/events/:id', authAdmin, eventController.deleteEventByID);
router.put('/events/:id', authAdmin, eventController.updateEventStatus);

module.exports = router;




