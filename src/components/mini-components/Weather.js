import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import WeatherIcon from './WeatherIcon';
import HourlyIcon from './HourlyIcon';
import { formatUnits } from '../../services/formatting';
import { updateUnits } from '../../services/user.service';
import ListView from './ListView';

const Weather = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //Ref to control the scroll of the hourly weather
    const scrollRef = useRef();

    const formatDate = (date) => {
        let newDate = new Date(date * 1000);
        return (newDate.toString().slice(15, 21));
    }

    //State to hold the interval id
    const [scrollInterval, setScrollInterval] = useState('');

    //Function to start the page scroll. 
    //This function starts a timer that scrolls through the hourly weather
    //Once the 'onMousedown' event fires, the interval is cleared
    const startScroll = async (e) => {
        scroll(e.target.id)
        let inter = setInterval(() => { scroll(e.target.id) }, [25]);
        setScrollInterval(inter);
    }

    //Function to scroll the page
    const scroll = (direction) => {
        if (direction === 'right') {
            scrollRef.current.scrollLeft += 75;
        } else {
            scrollRef.current.scrollLeft -= 75;
        }
    }
    const stopScroll = (e) => {
        clearInterval(scrollInterval);
    }

    // Function to update the users preferred units
    const handleUnits = async (e) => {
        let res = await updateUnits();      //Update in db
        if (res.status === 200) {
            //Updated state for live updates
            userContext.userDispatch({ type: 'updateUnits', payload: { units: res.data.user.units } })
        } else {
            console.log('error')
            console.log(res)
        }

    }

    //Function and state to toggle between list and grid/icon view
    const [view, setView] = useState(true);
    const toggleView = () => {
        setView(!view);
    }

    return (
        <div className='weather-wrapper'>
            <div className='todays-weather'>
                <div className='current-weather'>
                    {currentUser.location === '' ? <h2 className='title-color'>No Location on File</h2> :
                        !isNaN(currentUser.location) ? <h2 className='title-color'>Zipcode: {currentUser.location}</h2> :
                            <h2 className='title-color'>{currentUser.location[0].toUpperCase()}{currentUser.location.slice(1)}</h2>}
                    <div>
                        <p>{currentUser.primary_weather.current.weather[0].description} and {formatUnits(currentUser.units, currentUser.primary_weather.current.temp)}</p>
                        <img src={`http://openweathermap.org/img/wn/${currentUser.primary_weather.current.weather[0].icon}@2x.png`} alt='weather icon'></img>
                    </div>
                </div>
                <div className='weather-data'>
                    <div className='weather-left'>
                        <p>Current Temperature: {formatUnits(currentUser.units, currentUser.primary_weather.current.temp)}</p>
                        <p>Humidity: {currentUser.primary_weather.current.humidity}%</p>
                        <p>Feels Like: {formatUnits(currentUser.units, currentUser.primary_weather.current.feels_like)}</p>
                    </div>
                    <div className='weather-right'>
                        <p>Wind Speed: {currentUser.primary_weather.current.wind_speed} m/s</p>
                        <p>High: {formatUnits(currentUser.units, currentUser.primary_weather.daily[0].temp.max)}</p>
                        <p>Low: {formatUnits(currentUser.units, currentUser.primary_weather.daily[0].temp.min)}</p>
                    </div>
                    <div>
                        <p>Sunrise: {formatDate(currentUser.primary_weather.current.sunrise)}</p>
                        <p>Sunset: {formatDate(currentUser.primary_weather.current.sunset)}</p>
                    </div>
                </div>

            </div>
            <div className='preference-container'>
                <h3>Preferences</h3>
                <div className='preference-wrapper'>
                    <div className="toggle-switch">
                        <h4>Units</h4>
                        <label className="checkbox toggle switch" onChange={handleUnits}>
                            <input id="view" type="checkbox" defaultChecked={currentUser.units === 'imperial' ? false : true} />
                            <p>
                                <span>Metric</span>
                                <span>Imperial</span>
                            </p>
                            <div className="slide-button"></div>
                        </label>
                    </div>

                    <div className="toggle-switch">
                        <h4>View</h4>
                        <label className="checkbox toggle switch" onChange={toggleView}>
                            <input id="view" type="checkbox" defaultChecked={view} />
                            <p>
                                <span>Icon</span>
                                <span>List</span>
                            </p>
                            <div className="slide-button"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className='daily weather-container'>
                <h2 className='title-color'>Daily Forecast</h2>
                {view ?
                    <div>
                        {currentUser.primary_weather.daily.map(day => <WeatherIcon day={day} key={day.dt} />)}
                    </div> :
                    <ListView interval='daily' data={currentUser.primary_weather.daily} />}
            </div>

            <div className='hourly weather-container'>
                <h2 className='title-color'>Hourly Forecast</h2>
                {view ?
                    <div className='weather-scroll'>
                        <button className='scroll-button' id='left' onMouseDown={startScroll} onMouseUp={stopScroll}>&#10094;</button>
                        <div className='hourly-container' ref={scrollRef}>
                            {currentUser.primary_weather.hourly.map(hour => <HourlyIcon hour={hour} key={hour.dt} />)}
                        </div>
                        <button className='scroll-button' id='right' onMouseDown={startScroll} onMouseUp={stopScroll}>&#10095;</button>
                    </div>
                    : <ListView interval='hourly' data={currentUser.primary_weather.hourly.slice(0, 24)} />}
            </div>
        </div>
    )
}

export default Weather;