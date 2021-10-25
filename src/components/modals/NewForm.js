import { useState } from 'react';
import NewItem from '../mini-components/NewItem'
import NewNote from '../mini-components/NewNote'
import NewProject from '../mini-components/NewProject'

const NewForm = (props) => {
    const [active, setActive] = useState('note');
    const toggleActive = (e) => {
        setActive(e.target.id);
    }

    return (
        <div className='modal'>
            <div className='modal-main newForm-main'>
                <div>
                    <h2>Create a New...</h2>
                    <button className='x-button' onClick={props.toggleModal}>X</button>
                </div>
                <div className='newForm-data'>
                    <div className='newForm-aside'>
                        <button className={active==='project'? 'active-tab': null} id='project' onClick={toggleActive}>Project</button>
                        <button className={active==='todo'? 'active-tab': null} id='todo' onClick={toggleActive}>To Do</button>
                        <button className={active==='note'? 'active-tab': null} id='note' onClick={toggleActive}>Note</button>
                    </div>
                    <div className='newForm-content'>
                        {active === 'project'? <NewProject /> : active === 'todo'? <NewItem /> : <NewNote />}
                    {/* Depending on what is active, display the correct form */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewForm