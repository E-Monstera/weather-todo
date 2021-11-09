import { formatUnits, dateFormat } from "../../services/formatting";
import { useContext } from 'react';
import { UserContext } from "../../App";


const ListView = (props) => {
    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //Format the date
    const timeFormat = (date) => {
        let newDate = new Date(date * 1000);
        let time = newDate.toString().slice(16, 21);
        if (time.slice(0, 2) > 12) {
            return `${time.slice(0, 2) - 12}${time.slice(2, 5)} PM`
        } else {
            return `${time} AM`;
        }
    }

    return (
        <div className='list-container'>
            {props.interval === 'hourly' ?
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Weather</th>
                        <th>Temperature</th>
                        <th>Precipitation</th>
                    </tr>
                    {props.data.map(hour => {
                        return (
                            <tr>
                                <td>{timeFormat(hour.dt)}</td>
                                <td className='weather-list'><img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt='weather icon'></img> {hour.weather[0].description}</td>
                                <td>{formatUnits(currentUser.units, hour.temp)}</td>
                                <td>{Math.round(hour.pop * 100)}%</td>
                            </tr>
                        )
                    })}
                </table>
                :
                <table>
                    <tr>
                        <th>Day</th>
                        <th>Weather</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Precipitation</th>
                    </tr>
                    {props.data.map(day => {
                        return (
                            <tr>
                                {/* {console.log(day)} */}
                                <td>{dateFormat(day.dt).slice(0, 3)}</td>
                                <td className='weather-list'><img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt='weather icon'></img> {day.weather[0].description}</td>
                                <td>{formatUnits(currentUser.units, day.temp.max)}</td>
                                <td>{formatUnits(currentUser.units, day.temp.min)}</td>
                                <td>{Math.round(day.pop * 100)}%</td>
                            </tr>
                        )
                    })}
                </table>
            }
        </div>
    )
}

export default ListView