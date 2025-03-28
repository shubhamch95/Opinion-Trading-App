const Trade = require("../models/Trade");
const Event = require("../models/Event");
const { getWebSocketInstance } = require('../config/socket'); // Correct import
const { executeTrades } = require('../utils/tradeUtils');

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

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
};

exports.deleteEventByID = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        await Trade.deleteMany({ event: id });

        res.status(200).json({ message: "Event and related trades deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, winningOutcome } = req.body;

        if (!['scheduled', 'live', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update event status and winning outcome
        event.status = status;
        if (status === "completed" && winningOutcome) {
            event.winningOutcome = winningOutcome;
        }
        await event.save();

        // Get WebSocket instance and broadcast event update
        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "eventUpdated", event }));
                }
            });
        }

        // If event is completed, execute trades
        if (status === "completed" && winningOutcome) {
            await executeTrades(id, winningOutcome);
        }

        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.updateEventStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status, winningOutcome } = req.body;

//         if (!['upcoming', 'live', 'completed'].includes(status)) {
//             return res.status(400).json({ message: "Invalid status update" });
//         }

//         const event = await Event.findByIdAndUpdate(id, { status, winningOutcome }, { new: true });

//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         // Emit real-time event update
//         io.to(id).emit('eventUpdated', event);

//         // If event is completed, update related trades
//         if (status === 'completed') {
//             await executeTrades(id, winningOutcome, io);
//         }

//         res.json({ message: "Event updated successfully", event });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



