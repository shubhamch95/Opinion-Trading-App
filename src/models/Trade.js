const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId,
         ref: 'User', required: true },

    event: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Event', required: true },

    amount: { type: Number,
         required: true },

    odds: { type: Number,
         required: true },

    status: { type: String,
         enum: ['pending', 'won', 'lost'],
          default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Trade', TradeSchema);
