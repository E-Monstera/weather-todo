import { useState } from 'react';
import NewItem from '../mini-components/NewItem'
import NewNote from '../mini-components/NewNote'
import NewProject from '../mini-components/NewProject'

const NewForm = (props) => {
    //Destructure props
    const { source, toggleModal } = props;

    //Create a state item to hold which tab is currently active
    const [active, setActive] = useState(source.id);
    const toggleActive = (e) => {
        setActive(e.target.id);
    }

    //Function to display the form for the active tab (whether for an item, note, or project)
    //This function is important as it fixes a bug caused by opening a form to edit something, then clicking on
    //a different tab
    const DisplayForm = (props) => {
        console.log(source)
        if (active === source.id) {
            //The user is opening a specific form, straightforward
            if (active === 'project' || active === undefined) {
                return <NewProject source={source} toggleModal={toggleModal}/>
            } else if (active === 'item') {
                return <NewItem source={source} toggleModal={toggleModal} updateItems={props.updateItems}/>
            } else { //User is adding a note
                return <NewNote source={source} toggleModal={toggleModal} clearSource={props.clearSource}/>
            }
        } else {
            //User originally opened NewForm to edit/add a specific item but have now changed their mind
            //Open the appropriate modal with cleansed data
            let newSource = {
                status: 'new',
                id: 'project',
                data: undefined,
                ref: null
            }
            if (active === 'project' || active === undefined) {
                return <NewProject source={newSource} toggleModal={toggleModal}/>
            } else if (active === 'item') {
                newSource.id = 'item';
                return <NewItem source={newSource} toggleModal={toggleModal} updateItems={props.updateItems}/>
            } else { //User is adding a note
                newSource.id = 'note';
                return <NewNote source={newSource} toggleModal={toggleModal}/>
            }
        }
    }


    return (
        <div className='modal'>
            <div className='modal-main newForm-main'>
                <div className='modal-title'>
                    <h2>Create a New...</h2>
                    <button className='x-button' onClick={props.toggleModal}>X</button>
                </div>
                <div className='newForm-data'>
                    <div className='newForm-aside'>
                        <button className={active===undefined || active==='project'? 'active-tab': null} id='project' onClick={toggleActive}>{active==='project'? '//' : null} Project</button>
                        <button className={active==='item'? 'active-tab': null} id='item'  onClick={toggleActive}>{active==='item'? '//' : null} Item</button>
                        <button className={active==='note'? 'active-tab': null} id='note' onClick={toggleActive}>{active==='note'? '//' : null} Note</button>
                    </div>
                    <div className='newForm-content'>
                        {/* {active === 'project' || active === undefined? <NewProject source={props.source} toggleModal={props.toggleModal}/> : active === 'item'? <NewItem source={props.source} toggleModal={props.toggleModal}/> : <NewNote source={props.source} toggleModal={props.toggleModal} clearSource={props.clearSource}/>} */}
                    {/* Depending on what is active, display the correct form */}
                        <DisplayForm updateItems={props.updateItems}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewForm