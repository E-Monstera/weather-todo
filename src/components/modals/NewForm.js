import { useState } from 'react';
import NewItem from '../mini-components/NewItem'
import NewNote from '../mini-components/NewNote'
import NewProject from '../mini-components/NewProject'

const NewForm = (props) => {
    const [active, setActive] = useState(props.source.object);
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
                        <button className={active==='item'? 'active-tab': null} id='item'  onClick={toggleActive}>To Do</button>
                        <button className={active==='note'? 'active-tab': null} id='note' onClick={toggleActive}>Note</button>
                    </div>
                    <div className='newForm-content'>
                        {console.log(props.source)}
                        {active === 'project'? <NewProject source={props.source} toggleModal={props.toggleModal}/> : active === 'item'? <NewItem source={props.source} toggleModal={props.toggleModal}/> : <NewNote source={props.source} toggleModal={props.toggleModal}/>}
                    {/* Depending on what is active, display the correct form */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewForm