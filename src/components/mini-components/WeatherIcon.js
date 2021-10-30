import { formatUnits, dateFormat } from "../../services/formatting";
import { useContext } from 'react';
import { UserContext } from "../../App";

const WeatherIcon = (props) => {
    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //Destructure props
    const { day } = props;

    return (
        <div className='weather-icon'>
            <h5>{dateFormat(props.day.dt).slice(0, 3)}</h5>
            <p>{day.weather[0].description}</p>
            <div>
                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt='weather icon'></img>
                <div>
                    <p>{formatUnits(currentUser.units, day.temp.max)}</p>
                    <p>{formatUnits(currentUser.units, day.temp.min)}</p>
                </div>
            </div>
            <p className='prec'>Precipitation: {Math.round(day.pop * 100)}%</p>
        </div>
    )
}

export default WeatherIcon