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

EventSchema.index({ status: 1 });
EventSchema.index({ name: 1 });

module.exports = mongoose.model('Event', EventSchema);



