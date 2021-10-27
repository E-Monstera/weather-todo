import { useState, useContext } from 'react';
import Schedule from './mini-components/Schedule'
import Calendar from './mini-components/Calendar'
import Notes from './mini-components/Notes'
import { UserContext } from '../App';
import WeatherIcon from './mini-components/WeatherIcon';

const Planner = () => {
    const [active, setActive] = useState('schedule');

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    const handleActive = (e) => {
        setActive(e.target.id)
    }

    const [units, setUnits] = useState('c');
    const formatUnits = (temp) => {
        if (units === 'f') {
            return `${temp} °F`
        } else {
            return `${temp} °C`
        }
    }


    return (
        <div className='planner-wrapper'>
            <div className='planner'>
                <div className='planner-buttons'>
                    <button id='schedule' onClick={handleActive}>Planner</button>
                    <button id='calendar' onClick={handleActive}>Calendar</button>
                    <button id='notes' onClick={handleActive}>Notes</button>
                </div>
                <div className='planner-container'>
                    {active === 'schedule' ? <Schedule /> : active === 'calendar' ? <Calendar /> : <Notes />}
                </div>
            </div>
            <div className='planner-weather'>
                <h2>{currentUser.location.toUpperCase()}</h2>
                {Object.keys(currentUser.primary_weather).length === 0 ? null :
                    currentUser.primary_weather.daily.map(day => <WeatherIcon day={day} key={day.dt} formatUnits={formatUnits} />)}
            </div>
        </div>
    )
}

export default Planner