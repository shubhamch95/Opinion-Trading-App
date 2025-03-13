const Event = require("../models/Event");

// Create an event
exports.createEvent = async (req, res) => {
    try {
        const { name, category, odds, startTime, status } = req.body;
        const event = new Event({ name, category, odds, startTime, status });
        await event.save();
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ error: "Error creating event" });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting event" });
    }
};
