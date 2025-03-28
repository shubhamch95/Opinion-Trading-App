const axios = require('axios');
require('dotenv').config();
const API_URL = process.env.API_URL;

const SPORTS_API_KEY = process.env.SPORTS_API_KEY;

console.log("Loaded API Key:", SPORTS_API_KEY);

if (!SPORTS_API_KEY) {
    console.error("🚨 ERROR: SPORTS_API_KEY is missing or not loaded correctly!");
    process.exit(1); 
}

exports.fetchLiveData = async () => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                apiKey: SPORTS_API_KEY,
                regions: 'us', 
                markets: 'h2h,spreads',
            }
        });

        console.log("API Response Received:", response.data.length, "events");

        return response.data.map(event => ({
            name: `${event.home_team} vs ${event.away_team}`,
            category: event.sport_title, 
            startTime: new Date(event.commence_time), 
            odds: event.bookmakers.reduce((acc, bm) => {
                acc[bm.title] = bm.markets; 
                return acc;
            }, {}),
            status: 'upcoming', 
            winningOutcome: null
        }));
    } catch (error) {
        console.error(" Error fetching live data:", error.response ? error.response.data : error.message);
        return [];
    }
};
