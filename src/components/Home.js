import { useState, useEffect } from 'react';
import { getWeather, getLocation } from '../services/user.service';
import { formatState } from '../services/formatting';

const Home = () => {

    const [location, setLocation] = useState('');       //State to hold the user inputted location
    const [weather, setWeather] = useState()                  //State to hold the weather data

    const handleChange = (e) => {
        setLocation(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = await grabWeather();
        console.log('done')
        console.log(data)

    }

    const grabWeather = async () => {
        try {
            let results = await getWeather(location);  //Send the location to the backend API
            return results.data;
        } catch (err) {
            console.log('error')
            console.log(err)
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='location'>Enter City</label>
                <input type='text' id='location' name='location' required initialvalue={location} value={location} onChange={handleChange}></input>
            </form>
            <div>
                <div>
                    <h2>Today's weather</h2>

                </div>
            </div>
        </div>
    )
}


export default Home