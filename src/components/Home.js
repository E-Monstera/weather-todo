import { useState, useEffect, useContext } from 'react';
import { getWeather, getLocation, updateLocation, getToDo } from '../services/user.service';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Weather from './mini-components/Weather';

const Home = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    const [location, setLocation] = useState('');       //State to hold the user inputted location
    const [loading, setLoading] = useState(true);

    // Function to make user input for a location a controlled input
    const handleChange = (e) => {
        setLocation(e.target.value)
    }

    //Function to handle submitting a new location and grabbing the associated weather
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateLocation(location); //Start updating the location in the db
        userContext.userDispatch({ type: 'updateUserLocation', payload: { location: location } });    //Update location in App.js - Starts Loading animation
        grabWeather(location);
    }

    // Function to grab weather upon a user entering a new location
    const grabWeather = async (local) => {
        try {
            let data = await getWeather(local);  //Send the location to the backend API
            setLoading(false);
            setLocation('');
            userContext.userDispatch({ type: 'updateWeather', payload: { weather: data.data.weather } });    //Update location in App.js - Starts Loading animation
        } catch (err) {
            console.log('error')
            console.log(err)
        }
    }


    //useEffect to disable the loading animation when App.js is done grabbing currentUser weather
    useEffect(() => {
        if (currentUser.username === '') {
            //return, currentUser is still being set
            return;
        } else if (Object.keys(currentUser.primary_weather).length !== 0) {
            console.log('HIT USEEFFECT FOR LOADING')
            setLoading(false);      //Weather was grabbed in App.js, allow DOM to reflect this
        } else {
            return;
        }
    }, [currentUser])

    return (
        <div className='home'>
            {console.log(currentUser)}
            <div className='home-weather-wrapper'>
                {currentUser.location === '' ? <h3>Current Location: None on file</h3> :
                    <h2>{currentUser.location[0].toUpperCase()}{currentUser.location.slice(1)}</h2>}
                <div className='weather-form'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='location'>Search New Location: </label>
                        <input type='text' id='location' name='location' placeholder='Search New City/Zipcode' required initialvalue={location} value={location} onChange={handleChange}></input>
                    </form>
                </div>

                {loading ? <h3>Loading...</h3> : <Weather />}

            </div>
            <div className='home-planner-wrapper'>
                <h2>Planner</h2>
                <div className='home-planner-container'>
                    <div className='planner-holder'>
                        <Link to='/planner'>To Planner →</Link>
                        <div>
                            <h3>Due Today</h3>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home