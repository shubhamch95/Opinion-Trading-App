// controllers/adminController.js
const Event = require('../models/Event');
const Trade = require('../models/Trade');

exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTrade = async (req, res) => {
    try {
        const { user, event, amount, odds, status } = req.body;

        // Validate required fields
        if (!user || !event || !amount || !odds) {
            return res.status(400).json({ message: "user, event, amount, and odds are required" });
        }

        // Create and save the trade
        const trade = new Trade({
            user,
            event,
            amount,
            odds,
            status: status || "pending"  // Ensuring lowercase
        });

        await trade.save();

        res.status(201).json({ message: "Trade created successfully", trade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTrades = async (req, res) => {
    try {
        const trades = await Trade.find();
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status, winningOutcome } = req.body;

        // Validate status update
        if (!['upcoming', 'ongoing', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        // Update event status
        const event = await Event.findByIdAndUpdate(eventId, { status, winningOutcome }, { new: true });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // If event is completed, update related trades
        if (status === 'completed') {
            await executeTrades(eventId, winningOutcome);
        }

        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to update trade status based on event result
const executeTrades = async (eventId, winningOutcome) => {
    try {
        const trades = await Trade.find({ event: eventId });

        for (let trade of trades) {
            trade.status = trade.odds === winningOutcome ? "won" : "lost";
            await trade.save();
        }
    } catch (error) {
        console.error("Error executing trades:", error);
    }
};
