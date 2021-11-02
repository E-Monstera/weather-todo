import { useState, useEffect, useContext } from 'react';
import { del_project } from '../../services/user.service';
import Item from './Item';
import NewForm from '../modals/NewForm';
import { UserContext } from '../../App';


const Schedule = () => {

    /*
    Quick overview:
    active state - Holds which tab is currently active, setting this triggers the next state variable
    activeItems/setActiveItems - This state holds the items that are actively being displayed in the planner
    Process: Each category/project buttons has an event listener toggleActive()
    This function: sets the active state to indicate which button is active and then triggers sortItems() to
    filter the items that fit the project, then assigns the new array of items to the activeItems() state to be displayed
    */


    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State to hold the currently active section
    const [active, setActive] = useState({
        name: 'All',
        id: 0
    });

    const [activeItems, setActiveItems] = useState([]); //State to hold the items that are actively being displayed

    //Function to toggle which tab is active (out of the projects and other groups such as 'today')
    const toggleActive = (e) => {
        //Button was one of the hard-programmed buttons
        if (e.target.id === 'Today' || e.target.id === 'Tomorrow' || e.target.id === 'This Week' || e.target.id === 'All' || e.target.id === 'Urgent') {
            setActive({
                name: e.target.id,      //holds the name of the button
                id: 0                   //id is set to 0 for ease of filtering by project
            })
        } else {
            setActive({
                name: e.target.className,   //Holds the name of the project
                id: e.target.id             //Holds the id of the project
            })
        }
        sortItems(e.target.id)    //Call function to sort which items appear in the DOM
    }

    //Function to sort items that are due today, tomorrow, this week, etc.
    const sortItems = (id) => {
        //Prepare variables for use - a empty array to hold the JSX and a date to be mutated
        let items = currentUser.planner.items;
        let date = new Date();
        let filter = ''
        let arr = [];

        if (id === 'All') {
            arr = [...currentUser.planner.items];
        } else if (id === 'Today' || id === 'Tomorrow') { //Filter by date
            if (id === 'Tomorrow') {
                date.setDate(date.getDate() + 1);
            }
            filter = date.toISOString().slice(0, 10);

            items.forEach(item => {
                if (item.due_date.slice(0, 10) === filter) {
                    arr.push(item)
                }
            })

        } else if (id === 'Urgent') {    // filter by urgent group
            items.forEach(item => {
                if (item.priority === 1) {
                    arr.push(item)
                }
            })
        } else {
            // Sort by category
            arr = items.filter(item => {
                if (item.project === null) {
                    return false;
                } else if (item.project._id === id) {
                    return true;
                } return false;
            })
        }

        setActiveItems(arr);

    }

    // State and function to handle editting a post
    // State must be sent to the NewForm modal and NewProject modal
    // in order to allow user to update item.
    /*
        State variable to handle edits and new items
        Key purpose: When a user opens the NewForm modal, the active tab and data change dynamically
        based on where the button was pressed. This state controls how data is sent to the modal
        Additionally, it's used in the below useEffect for active loading
        Summary:
        Page load: data: undefined, object: ''
        New item (general item): data: undefined, object: ''
        New item (for a specific project): data: projectid, object: 'item',
        Delete Project: data:projectObject, Object: 'Project' - Following deleting, active is set to 'All' so it defaults to that tab
        Edit Project: Data:projectObject, Object: 'Project'
    */
    const [source, setSource] = useState({
        data: undefined,
        object: ''
    })

    // useEffect to display only items that are due today - only engaged in page load and following edits
    useEffect(() => {
        if (Object.keys(currentUser.planner).length === 0) {  //currentUser still hasn't been set in App.js - Wait for it to be set
            return;
        } else if ((source.data === undefined && source.object === '') || source.object === 'item') {
            //If this is true, the useeffect has NOT been called after an edit
            //Set the activeItems (to be displayed in DOM) to show all items
            if (active.id === 0) {
                sortItems(active.name)
            } else {
                sortItems(active.id)
            }
            // sortItems(active.id)
        } else if (source.object === 'project') {
            //useeffect was called after a project was editted. 
            //active needs to be updated in order to reflect the name change
            let update = currentUser.planner.projects.filter(proj => proj._id === source.data._id)
            setActive({
                name: update[0].title,
                id: update[0]._id
            })
            // assignActiveItems({name: update[0].title, id: update[0]._id})
        } else {
            return;
        }
    }, [currentUser])

    //State and function to toggle the modal to add a new project, note, or item
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    //Function to handle deleting a project
    const handle_del_proj = async (e) => {
        //Delete the project in state
        await del_project(active.id);
        
        //Update the active project to avoid errors
        setActive({
            name: 'All',
            id: 0
        })

        // //Now, remove the project to currentUser.planner. This ensures a live update to the users planner
        let planner = currentUser.planner;
        let index = planner.projects.findIndex(proj => proj._id === active.id)
        planner.projects.splice(index, 1);
        userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })

    }


    const handle_edit_proj = (e) => {
        //First, find the project to send to the NewProject form
        let index = currentUser.planner.projects.findIndex(proj => {
            return proj._id === e.target.id
        })

        setSource({
            data: currentUser.planner.projects[index],
            object: 'project'
        })

        toggleModal();  //Display the edit modal
    }

    //Function to add a new item - Determines whether the user is adding an item in general or to a specific project
    const addItem = () => {
        console.log(active)
        if (active.id === 0) {
            // User is adding an item to a general pool
            // Set object to item so the modal opens up the NewItem component
            // but let data be undefined to indicate that it's not associated with a project
            setSource({
                data: undefined,
                object: 'item'
            })
        } else {
            //User wants to add the item to a project, edit source state to 
            //indicated which project the item wants to be saved to.
            setSource({
                data: active.id,
                object: 'item'
            })
        }
        toggleModal();
    }



    return (
        <div className='schedule-wrapper'>
            <div className='planner-sidebar'>

                <button className={active.name === 'All' ? 'active-tab' : null} id='All' onClick={toggleActive}>All</button>
                <button className={active.name === 'Today' ? 'active-tab' : null} id='Today' onClick={toggleActive}>Today</button>
                <button className={active.name === 'Tomorrow' ? 'active-tab' : null} id='Tomorrow' onClick={toggleActive}>Tomorrow</button>
                <button className={active.name === 'Urgent' ? 'active-tab' : null} id='Urgent' onClick={toggleActive}>Urgent</button>
                <h2>Projects</h2>
            {/* {console.log(currentUser)}
                {console.log(currentUser.planner.projects)} */}
                {currentUser.id===''? null :
                currentUser.planner.projects.length === 0? <p>No Projects On Record</p>:null}
                {currentUser.planner.projects && currentUser.planner.projects !== undefined? currentUser.planner.projects.map(project => <button className={active.id === project._id ? 'active-tab' : `${project.title}`} id={project._id} onClick={toggleActive} key={project._id}>{project.title}</button>) : null}
                <button onClick={toggleModal}>+</button>
            </div>
            <div className='planner-content'>
                {active.id === 0 ? <h2>{active.name}</h2> :
                    <div>
                        <h2>{active.name === 'Today' || active.name==='Tomorrow'? `${active.name}'s Items'` : `${active.name} Items`}</h2>
                        <div>
                            <button alt='edit project' className='item-button edit-button' onClick={handle_edit_proj}><i id={active.id} className="far fa-edit" alt='edit project'></i></button>
                            {activeItems.length === 0 ? <button id={active.id} alt='delete project' className='item-button delete-button' onClick={handle_del_proj}><i className="far fa-trash-alt" alt='delete project'></i></button> : null}
                        </div>
                    </div>}
                {activeItems.length === 0? <p>Add Items Below!</p>:null}
                {activeItems ? activeItems.map(item => <Item item={item} key={item._id} />) : null}
                <button onClick={addItem}>+</button>
            </div>
            {modal ? <NewForm toggleModal={toggleModal} source={source} /> : null}
        </div>
    )
}

export default Schedule