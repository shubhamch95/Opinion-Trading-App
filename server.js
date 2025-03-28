const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./src/config/db");
const { initializeSocket } = require("./src/config/socket"); 
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

(async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        initializeSocket(server);
    });
})().catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

    app.use("/api/auth", require("./src/routes/authRoutes"));
    app.use("/api/events", require("./src/routes/eventsRoutes"));
    app.use("/api/admin", require("./src/routes/adminRoutes"));
    app.use("/api/trades", require("./src/routes/tradeRoutes"));

app.get("/", (req, res) => {
    res.send("Opinion Trading Backend Running...");
});

module.exports = server;
