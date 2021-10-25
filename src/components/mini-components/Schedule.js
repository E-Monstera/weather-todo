import { useState, useEffect, useContext } from 'react';
import { getToDo } from '../../services/user.service';
import Item from './Item';
import NewForm from '../modals/NewForm';
import { UserContext } from '../../App';


const Schedule = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State to hold the currently active section
    const [active, setActive] = useState('today');
    const [activeItems, setActiveItems] = useState();

    const toggleActive = (e) => {
        setActive(e.target.id);
        assignActiveItems(e.target.id)
    }

    // Function to determine which items are displayed in the planner container
    const assignActiveItems = (title) => {
        if (title === 'today' || title==='tomorrow' || title==='thisWeek' || title==='all' || title==='urgent') {
            setActiveItems(currentUser.planner.items)
        } else {
            //Active tab belongs to a project, find out which project and display items
            let index = currentUser.planner.projects.findIndex(proj => {
                return proj.project._id === title
            })
            setActiveItems(currentUser.planner.projects[index].items)
        }
    }

    // useEffect to display only items that are due today - only engaged in page load
    useEffect(() => {
        assignActiveItems('today');
    }, [currentUser])

    //State and function to toggle the modal to add a new project, note, or item
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    return (
        <>
            <div className='planner-sidebar'>
                <button className={active==='today'? 'active-tab': null} id='today' onClick={toggleActive}>Today</button>
                <button className={active==='tomorrow'? 'active-tab': null} id='tomorrow' onClick={toggleActive}>Tomorrow</button>
                <button className={active==='thisWeek'? 'active-tab': null} id='thisWeek' onClick={toggleActive}>This Week</button>
                <button className={active==='all'? 'active-tab': null} id='all' onClick={toggleActive}>All</button>
                <button className={active==='urgent'? 'active-tab': null} id='urgent' onClick={toggleActive}>Urgent</button>
                <h2>Projects</h2>
                {currentUser.planner.projects? currentUser.planner.projects.map(project => <button className={active===project.project._id? 'active-tab': null} id={project.project._id} onClick={toggleActive} key={project.project._id}>{project.project.title}</button>): null}
                <button onClick={toggleModal}>+</button>
            </div>
            <div className='planner-content'>
                {activeItems? activeItems.map(item => <Item item={item} key={item._id} />): null}
            </div>
            {modal? <NewForm toggleModal={toggleModal}/>: null}
        </>
    )
}

export default Schedule