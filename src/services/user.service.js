import axios from 'axios';
import { authHeader } from './auth-header';
const API_URL = 'http://localhost:5000'

const getWeather = async (location) => {
    try {
        const resp = await axios.get(`${API_URL}/weather/${location}`);
        return resp;
    } catch (err) {
        return { status: err.response.status, data: err.response.data };
    }
}

const getToDo = () => {
    const config = authHeader();
    return axios.get(`${API_URL}/todos`, config);
}

const updateLocation = async (location) => {
    try {
        const config = authHeader();
        const resp = await axios.put(`${API_URL}/user/location`, {location}, config);
        return resp;
    } catch (err) {
        console.log('ERROR')
        return { status: err.response.status, data: err.response.data };
    }
}
//Methods for items
//----------------------------------------------------------------


//Methods for projects
//----------------------------------------------------------------

const post_project = async (project) => {
    try {
        const config = authHeader();
        let res = await axios.post(`${API_URL}/proj`, { title: project}, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

const put_project = async (title, id) => {
    try {
        const config = authHeader();
        let res = await axios.put(`${API_URL}/proj/${id}`, {title}, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}


const del_project = async (projectId) => {
    try {
        const config = authHeader();
        let res = await axios.delete(`${API_URL}/proj/${projectId}`, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

export { getWeather, getToDo, updateLocation, 
    post_project, del_project, put_project }