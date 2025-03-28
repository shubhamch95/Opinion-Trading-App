const Event = require('../models/Event');
const Trade = require('../models/Trade');
const { fetchLiveData } = require('../services/apiService');

exports.fetchLiveData = async (req, res) => {
    try {
        const liveData = await fetchLiveData();

        const events = await Promise.all(
            liveData.map(async event => {
                return Event.findOneAndUpdate({ name: event.name }, event, { upsert: true, new: true });
            })
        );        

        res.status(200).json({ message: "Live data fetched successfully", events });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch live data", details: error.message });
    }
};

