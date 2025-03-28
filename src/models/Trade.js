const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
            required: true,
             index: true },

    event: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Event',
          required: true },

    amount: { type: Number,
         required: true },

    selection: { type: String,
         required: true }, // NEW FIELD: Stores "teamA" or "teamB"

    odds: { type: Number, required: true },
    
    status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }
}, { timestamps: true });

// Existing Index (if any)
TradeSchema.index({ user: 1 });  
TradeSchema.index({ event: 1 });
TradeSchema.index({ status: 1 });

TradeSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Trade', TradeSchema);
