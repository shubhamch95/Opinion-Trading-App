const Trade = require('../models/Trade');
const { getWebSocketInstance } = require('../config/socket');

// Function to update trade status and emit real-time updates
const executeTrades = async (eventId, winningOutcome) => {
    try {
        const trades = await Trade.find({ event: eventId }).lean();

        if (!trades.length) return;

        const bulkUpdates = trades.map(trade => ({
            updateOne: {
                filter: { _id: trade._id },
                update: { $set: { status: trade.selection === winningOutcome ? "won" : "lost" } }
            }
        }));

        await Trade.bulkWrite(bulkUpdates);

        // Get WebSocket instance
        const wss = getWebSocketInstance();

        // Notify clients about trade updates
        trades.forEach(trade => {
            const newStatus = trade.selection === winningOutcome ? "won" : "lost";
            
            if (wss && wss.clients) {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ event: "tradeUpdated", tradeId: trade._id, status: newStatus }));
                    }
                });
            }
        });

    } catch (error) {
        console.error("Error executing trades:", error);
    }
};

module.exports = { executeTrades };
