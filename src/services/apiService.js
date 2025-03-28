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
                regions: 'us', // Keep 'us' since curl request worked
                markets: 'h2h,spreads', // Fetch Head-to-head and Spread odds
            }
        });

        console.log("✅ API Response Received:", response.data.length, "events");

        // Transform API data to match MongoDB Event model
        return response.data.map(event => ({
            name: `${event.home_team} vs ${event.away_team}`,  // Constructing a meaningful name
            category: event.sport_title,  // Matching sport_title to category
            startTime: new Date(event.commence_time),  // Converting to Date object
            odds: event.bookmakers.reduce((acc, bm) => {
                acc[bm.title] = bm.markets;  // Converting array to object for better MongoDB structure
                return acc;
            }, {}),
            status: 'upcoming',  // Defaulting to upcoming (can be updated later)
            winningOutcome: null  // Will be updated after the event is completed
        }));
    } catch (error) {
        console.error(" Error fetching live data:", error.response ? error.response.data : error.message);
        return [];
    }
};
