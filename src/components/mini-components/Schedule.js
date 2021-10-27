import { useState, useEffect, useContext } from 'react';
import { del_project } from '../../services/user.service';
import Item from './Item';
import NewForm from '../modals/NewForm';
import { UserContext } from '../../App';


const Schedule = () => {

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
                name: e.target.id,
                id: 0
            })
            assignActiveItems({name: e.target.id, id: 0})
            //User wanted to view items for a specific project
        } else {
            setActive({
                name: e.target.className,
                id: e.target.id
            })
            assignActiveItems({name: e.target.className, id: e.target.id})
        }


    }

    // Function to determine which items are displayed in the planner container
    const assignActiveItems = (title) => {
        // Sort by time
        if (title.id === 0) {
            setActiveItems(currentUser.planner.items)
        } else {
            //Active tab belongs to a project, find out which project and display items
            let index = currentUser.planner.projects.findIndex(proj => {
                return proj.project._id === title.id
            })
            setActiveItems(currentUser.planner.projects[index].items)
        }
    }

    // useEffect to display only items that are due today - only engaged in page load
    useEffect(() => {
        //If this is true, the useeffect has NOT been called after an edit
        if (source.data === undefined) {
            assignActiveItems(active);
        } else if (source.object === 'project') {
            //useeffect was called after a project was editted. 
            //active needs to be updated in order to reflex the name change
            let update = currentUser.planner.projects.filter(proj => proj.project._id === source.data._id)
            setActive({
                name: update[0].project.title,
                id: update[0].project._id
            })
            assignActiveItems({name: update[0].project.title, id: update[0].project._id})
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
            name: 'today',
            id: 0
        })

        // //Now, add the project to currentUser.planner. This ensures a live update to the users planner
        let planner = currentUser.planner;
        let index = planner.projects.findIndex(proj => proj.project._id === active.id)
        planner.projects.splice(index, 1);
        userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })   
    }

    // State and function to handle editting a post
    // State must be sent to the NewForm modal and NewProject modal
    // in order to allow user to update item.
    const [source, setSource] = useState({
        data: undefined,
        object: 'project'
    })
    const handle_edit_proj = (e) => {
        //First, find the project to send to the NewProject form
        let index = currentUser.planner.projects.findIndex(proj => {
            return proj.project._id === e.target.id
        })

        setSource({
            data: currentUser.planner.projects[index].project,
            object: 'project'
        })

        toggleModal();  //Display the edit modal
    }

    //Function to add a new item
    const addItem = () => {
        console.log(active)
        if(active.id === 0) {
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

    //Function to sort items that are due today, tomorrow, this week, etc.
    const sortItems = (e) => {
        toggleActive(e);        //Used to set the section as the active section
        //Prepare variables for use - a empty array to hold the JSX and a date to be mutated
        let items = currentUser.planner.items;
        let date = new Date();
        let filter = ''
        let arr = [];
        
        if (e.target.id === 'All') {
            arr = [...currentUser.planner.items];
        } else if (e.target.id === 'Today' || e.target.id === 'Tomorrow'){ //Filter by date
            if (e.target.id === 'Tomorrow') {
                date.setDate(date.getDate() + 1);
            }
            filter = date.toISOString().slice(0, 10);

            items.forEach(item => {
                if (item.due_date.slice(0, 10) === filter) {
                    arr.push(item)
                }})

        } else {    //By default, filter by urgent group
            items.forEach(item => {
                if (item.priority === 1) {
                    arr.push(item)
                }
            })
        }

        setActiveItems(arr);

    }

    return (
        <>
            <div className='planner-sidebar'>
            
                <button className={active.name === 'All' ? 'active-tab' : null} id='All' onClick={sortItems}>All</button>
                <button className={active.name === 'Today' ? 'active-tab' : null} id='Today' onClick={sortItems}>Today</button>
                <button className={active.name === 'Tomorrow' ? 'active-tab' : null} id='Tomorrow' onClick={sortItems}>Tomorrow</button>
                {/* <button className={active.name === 'This Week' ? 'active-tab' : null} id='This Week' onClick={sortItems}>This Week</button> */}
                <button className={active.name === 'Urgent' ? 'active-tab' : null} id='Urgent' onClick={sortItems}>Urgent</button>
                <h2>Projects</h2>
                {currentUser.planner.projects ? currentUser.planner.projects.map(project => <button className={active.id === project.project._id ? 'active-tab' : `${project.project.title}`} id={project.project._id} onClick={toggleActive} key={project.project._id}>{project.project.title}</button>) : null}
                <button onClick={toggleModal}>+</button>
            </div>
            <div className='planner-content'>
                {active.id === 0 ? <h2>{active.name}</h2> :
                    <div>
                        <h2>{active.name}</h2>
                        <div>
                            <button alt='edit project' className='item-button edit-button' onClick={handle_edit_proj}><i id={active.id} className="far fa-edit" alt='edit project'></i></button>
                            {activeItems.length === 0? <button id={active.id} alt='delete project' className='item-button delete-button' onClick={handle_del_proj}><i className="far fa-trash-alt" alt='delete project'></i></button> : null}
                        </div>
                    </div>}
                    {console.log('activeitems')}
                    {console.log(activeItems)}
                {activeItems ? activeItems.map(item => <Item item={item} key={item._id} />) : null}
                <button onClick={addItem}>+</button>
            </div>
            {modal ? <NewForm toggleModal={toggleModal} source={source} /> : null}
        </>
    )
}

export default Schedule