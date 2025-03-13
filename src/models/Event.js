const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String,
         required: true },

    category: { type: String,
         required: true }, // e.g., Football, Cricket

    startTime: { type: Date,
         required: true },
         
    odds: { type: Object,
         required: true }, // Store market odds (e.g., {teamA: 1.5, teamB: 2.3})
         
    status: { type: String,
         enum: ['upcoming', 'live', 'completed'],
          default: 'upcoming' },
          
          winningOutcome: { type: String }  // Store event result (e.g., 'Team A')

}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);

