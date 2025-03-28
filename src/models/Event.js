const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String,
         required: true },

    category: { type: String,
         required: true }, 

    startTime: { type: Date,
         required: true },
         
    odds: { type: Object,
         required: true },
         
    status: { type: String,
         enum: ['upcoming', 'live', 'completed'],
          default: 'upcoming' },

          winningOutcome: { type: String } 

}, { timestamps: true });

EventSchema.index({ status: 1 }); // Index on status for quick filtering
EventSchema.index({ name: 1 }); // Index on event name for searches

module.exports = mongoose.model('Event', EventSchema);



