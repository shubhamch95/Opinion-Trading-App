const axios = require('axios');

const fetchLiveData = async () => {
    try {
        // Replace with actual API
        const response = await axios.get('https://api.example.com/live-events');
        return response.data;
    } catch (error) {
        console.error('Error fetching live data:', error);
        return [];
    }
};

module.exports = { fetchLiveData };
