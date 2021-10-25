import { useState, useEffect } from 'react';
import { getWeather, getLocation } from '../services/user.service';
import { Link } from 'react-router-dom';

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
        <div className='home'>
            <div className='home-weather-wrapper'>
                <div className='weather-form'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='location'>Enter City</label>
                        <input type='text' id='location' name='location' placeholder='Enter City or Zipcode' required initialvalue={location} value={location} onChange={handleChange}></input>
                    </form>
                </div>
                <div className='todays-weather'>

                </div>
                <div className='daily-weather-container'>

                </div>

                <div className='hourly-weather-container'>
                    
                </div>

            </div>
            <div className='home-planner-wrapper'>
                <h2>Planner</h2>
                <div className='home-planner-container'>
                    <div className='planner-holder'>
                        <Link to='/planner'>To Planner →</Link>

                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home