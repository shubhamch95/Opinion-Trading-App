const express = require('express');
const Event = require('../models/Event');
const { fetchLiveData } = require('../services/apiService');
const { io } = require('../../server');  // Correct relative path

const router = express.Router();

router.get('/fetch', async (req, res) => {
    const liveData = await fetchLiveData();
    const events = await Event.insertMany(liveData);
    res.json(events);
});

router.post('/update/:id', async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.to(event._id.toString()).emit('eventUpdate', event);
    res.json(event);
});

module.exports = router;





