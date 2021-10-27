import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../App';
import WeatherIcon from './WeatherIcon';
import HourlyIcon from './HourlyIcon';

const Weather = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //Ref to control the scroll of the hourly weather
    const scrollRef = useRef();


    const [units, setUnits] = useState('c');
    const formatUnits = (temp) => {
        if (units === 'f') {
            return `${temp} °F`
        } else {
            return `${temp} °C`
        }
    }

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
        let inter = setInterval(() => {scroll(e.target.id)}, [25]);
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

    return (
        <div className='weather-wrapper'>
            <div className='current-weather'>
                <p>Current Weather:</p>
                <div>
                    {currentUser.primary_weather.current.weather[0].description}
                    <img src={`http://openweathermap.org/img/wn/${currentUser.primary_weather.current.weather[0].icon}@2x.png`} alt='weather icon'></img>
                </div>
            </div>
            <div className='todays-weather'>
                <div className='weather-left'>
                    <p>Current Temperature: {formatUnits(currentUser.primary_weather.current.temp)}</p>
                    <p>Humidity: {currentUser.primary_weather.current.humidity}%</p>
                    <p>Feels Like: {formatUnits(currentUser.primary_weather.current.feels_like)}</p>
                </div>
                <div className='weather-right'>
                    <p>Wind Speed: {currentUser.primary_weather.current.wind_speed} m/s</p>
                    <p>High: {formatUnits(currentUser.primary_weather.daily[0].temp.max)}</p>
                    <p>Low: {formatUnits(currentUser.primary_weather.daily[0].temp.min)}</p>
                </div>
                <div>
                    <p>Sunrise: {formatDate(currentUser.primary_weather.current.sunrise)}</p>
                    <p>Sunset: {formatDate(currentUser.primary_weather.current.sunset)}</p>
                </div>

            </div>
            <div className='daily weather-container'>
                <h2>Daily Forecast:</h2>
                <div>
                    {currentUser.primary_weather.daily.map(day => <WeatherIcon day={day} key={day.dt} formatUnits={formatUnits} />)}
                </div>
            </div>

            <div className='hourly weather-container'>
                <h2>Hourly Forecast:</h2>
                <div className='weather-scroll'>
                    <button className='scroll-button' id='left' onMouseDown={startScroll} onMouseUp={stopScroll}>&#10094;</button>
                    <div className='hourly-container' ref={scrollRef}>
                        {currentUser.primary_weather.hourly.map(hour => <HourlyIcon hour={hour} key={hour.dt} formatUnits={formatUnits} />)}
                    </div>
                    <button className='scroll-button' id='right' onMouseDown={startScroll} onMouseUp={stopScroll}>&#10095;</button>
                </div>
            </div>
        </div>
    )
}

export default Weather;