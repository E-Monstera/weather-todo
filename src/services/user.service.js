import axios from 'axios';
import { authHeader } from './auth-header';
const API_URL = 'http://localhost:5000'

const getWeather = async (location) => {
    try {
        const resp = await axios.get(`${API_URL}/weather/${location}`);
        return resp;
    } catch (err) {
        console.log('ERROR')
        return { status: err.response.status, data: err.response.data };
    }
}

const getToDo = () => {
    const config = authHeader();
    return axios.get(`${API_URL}/todos`, config);
}
//Methods for items
//----------------------------------------------------------------


//Methods for projects
//----------------------------------------------------------------
export { getWeather, getToDo }