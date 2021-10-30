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
const post_item = async (item) => {
    try {
        const config = authHeader();
        let res = await axios.post(`${API_URL}/item`, item, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

const put_item = async (item) => {
    try {
        const config = authHeader();
        let res = await axios.put(`${API_URL}/item/${item._id}`, item, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

const delete_item = async (id) => {
    try {
        const config = authHeader();
        let res = await axios.delete(`${API_URL}/item/${id}`, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

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

//Methods for notes
//----------------------------------------------------------------
const post_note = async (note) => {
    try {
        const config = authHeader();
        let res = await axios.post(`${API_URL}/note`, note, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

const put_note = async (note) => {
    try {
        const config = authHeader();
        let res = await axios.put(`${API_URL}/note/${note._id}`, note, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

const delete_note = async (id) => {
    try {
        const config = authHeader();
        let res = await axios.delete(`${API_URL}/note/${id}`, config);
        return res.data;
    }
    catch (err) {
        console.log('error')
        console.log(err)
        return err;
    }
}

export { getWeather, getToDo, updateLocation, 
    post_item, delete_item, put_item,
    post_project, del_project, put_project,
    post_note, delete_note, put_note, }