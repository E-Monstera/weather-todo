const axios = require('axios');

const API_URL = 'http://localhost:5000'

const getWeather = async (location) => {
    try {
        const resp = await axios.get(`${API_URL}/weather/${location}`);
        return resp;
    } catch (err) {
        console.log('ERROR')
        return {status: err.response.status, data: err.response.data};
    }
}

export { getWeather }