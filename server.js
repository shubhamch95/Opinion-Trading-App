const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/events', require('./src/routes/eventsRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));


// Connect Database
connectDB();

// WebSocket Integration
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('subscribe', (eventId) => {
        socket.join(eventId);
        console.log(`Client subscribed to event: ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Expose io instance globally (for event updates)
module.exports.io = io;

// Root Route
app.get('/', (req, res) => {
    res.send('Opinion Trading Backend Running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`));
