const Trade = require('../../src/models/Trade');
const Event = require('../../src/models/Event');
const User = require('../../src/models/User');
const { getWebSocketInstance } = require('../../src/config/socket');

exports.createTrade = async (req, res) => {
    try {
        const { user, event, amount, selection, odds, status } = req.body;

        if (!user || !event || !amount || !selection || !odds) {
            return res.status(400).json({ message: "user, event, amount, selection, and odds are required" });
        }

        if (!["teamA", "teamB"].includes(selection)) {
            return res.status(400).json({ message: "Invalid selection. Must be 'teamA' or 'teamB'." });
        }

        const eventData = await Event.findById(event);
        if (!eventData) {
            return res.status(404).json({ message: "Event not found" });
        }

        // ✅ Prevent trades on completed events
        if (eventData.status === "completed") {
            return res.status(400).json({ message: "Cannot place trades on completed events" });
        }

        if (eventData.odds[selection] !== odds) {
            return res.status(400).json({ message: `Invalid odds. Expected: ${eventData.odds[selection]}` });
        }

        const trade = new Trade({
            user,
            event,
            amount,
            selection,
            odds,
            status: status || "pending"
        });

        await trade.save();

        // ✅ Improved WebSocket Broadcasting
        const wss = getWebSocketInstance();
        if (wss && wss.clients && wss.clients.size > 0) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "Trade Created Successfully", trade }));
                }
            });
        }

        res.status(201).json({ message: "Trade created successfully", trade });
    } catch (error) {
        console.log("Error creating trade:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// exports.createTrade = async (req, res) => {
//     try {
//         const { user, event, amount, selection, odds, status } = req.body;

//         if (!user || !event || !amount || !selection || !odds) {
//             return res.status(400).json({ message: "user, event, amount, selection, and odds are required" });
//         }

//         if (!["teamA", "teamB"].includes(selection)) {
//             return res.status(400).json({ message: "Invalid selection. Must be 'teamA' or 'teamB'." });
//         }

//         const eventData = await Event.findById(event);
//         if (!eventData) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         if (eventData.odds[selection] !== odds) {
//             return res.status(400).json({ message: `Invalid odds. Expected: ${eventData.odds[selection]}` });
//         }

//         const trade = new Trade({
//             user,
//             event,
//             amount,
//             selection,
//             odds,
//             status: status || "pending"
//         });

//         await trade.save();

//         // Get WebSocket instance and broadcast event
//         const wss = getWebSocketInstance();
//         if (wss && wss.clients) {
//             wss.clients.forEach((client) => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(JSON.stringify({ event: "tradeCreated", trade }));
//                 }
//             });
//         }

//         res.status(201).json({ message: "Trade created successfully", trade });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getAllTrades = async (req, res) => {
    try {
        const { user, status } = req.query;
        let query = {};

        if (user) query.user = user; // Filter by user
        if (status) query.status = status; // Filter by trade status

        const trades = await Trade.find(query).lean().exec();
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTradeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'won', 'lost'].includes(status)) {
            return res.status(400).json({ message: "Invalid trade status" });
        }

        const trade = await Trade.findByIdAndUpdate(id, { status }, { new: true });

        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }

        // Get WebSocket instance and broadcast update
        const wss = getWebSocketInstance();
        if (wss && wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: "Trade Updated Successfully", trade }));
                }
            });
        }

        res.json({ message: "Trade status updated successfully", trade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
