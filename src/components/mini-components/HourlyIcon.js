import { formatUnits } from "../../services/formatting";
import { useContext } from 'react';
import { UserContext } from "../../App";
const HourlyIcon = (props) => {
    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //Destructure props
    const { hour } = props;

    //Format the date
    const dateFormat = (date) => {
        let newDate = new Date(date * 1000);
        let time = newDate.toString().slice(16, 21);
        if (time.slice(0, 2) > 12) {
            return `${time.slice(0, 2) - 12}${time.slice(2, 5)}`
        } else {
            return time;
        }
    }

    return (
        <div className='weather-icon'>
            <h5>{dateFormat(hour.dt)}</h5>

            <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt='weather icon'></img>

            <p>{hour.weather[0].description}</p>
            <p>{formatUnits(currentUser.units, hour.temp)}</p>
            <p className='prec'>Precipitation: {Math.round(hour.pop * 100)}%</p>
        </div>
    )
}

export default HourlyIcon