const WebSocket = require("ws");

let wss = null;

const initializeSocket = (server) => {
    if (!wss) {
        wss = new WebSocket.Server({ server });

        wss.on("connection", (ws) => {
            console.log("A user connected");

            ws.on("message", (message) => {
                console.log("Received:", message);
            });

            ws.on("close", () => {
                console.log("A user disconnected");
            });

            ws.on("error", (error) => {
                console.error("WebSocket Error:", error);
            });
        });
    }
};

const getWebSocketInstance = () => wss;

module.exports = { initializeSocket, getWebSocketInstance };
