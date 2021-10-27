import { useState } from 'react';
import Schedule from './mini-components/Schedule'
import Calendar from './mini-components/Calendar'
import Notes from './mini-components/Notes'

const Planner = () => {
    const [active, setActive] = useState('schedule');

    const handleActive = (e) => {
        setActive(e.target.id)
    }

    //Function to update planner from API 
    const updatePlanner = () => {

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
        </div>
    )
}

export default Planner