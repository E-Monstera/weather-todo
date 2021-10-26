import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { post_item, put_item } from '../../services/user.service';


const NewItem = (props) => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State to hold the new item data
    const [item, setItem] = useState({
        title: '',
        desc: '',
        priority: '1',
        project: 'none',
        due_date: ''
    })

    //Function to handle the controlled inputs
    const handleChange = (e) => {
        setItem(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (typeof props.source.data === 'object') {
            updateEdit();
        } else {    //Adding a new item
            //Send data to database 
            let res = await post_item(item)
            //Following success, update the project in state and close the modal
            let planner = currentUser.planner;
            planner.items.push(res.item);       //Update the general list of items

            //Update the project that the item is associated with
            // if res.item.project is null, then the item isn't associated with a project
            if (res.item.project !== null) {
                let index = planner.projects.findIndex(proj => proj.project._id === res.item.project)
                planner.projects[index].items.push(res.item);
            }
        }
        props.toggleModal();
    }

    const updateEdit = async () => {
        let res = await put_item(item)
        if (res.message === 'item updated') {
            //success, now update item in state
            //First, update item in the planner.items list
            const planner = currentUser.planner;
            let index = planner.items.findIndex(item => item._id === res.item._id)
            planner.items.splice(index, 1, res.item);

            //Then, update item in the project, if it is part of the project
            if (res.item.project !== null) {
                let index2 = planner.projects.findIndex(proj => res.item.project === proj.project._id)
                let index3 = planner.projects[index2].items.findIndex(item => item._id === res.item._id)
                planner.projects[index2].items.splice(index3, 1, res.item)
            }

            //Then update userContext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }
    //useEffect to check if the modal was opened to edit an item
    //If it was, update state
    useEffect(() => {
        if (typeof props.source.data === 'object') {
            setItem(props.source.data)
        } else if (typeof props.source.data === 'string' && props.source.data.length > 0) {
            setItem(prevState => ({
                ...prevState,
                project: props.source.data
            }))
        } else {
            return;
        }

    }, [])

    return (
        <form onSubmit={handleSubmit} >

            <label htmlFor='title'>Title:</label>
            <input type='text' id='title' name='title' required initialvalue={item.title} value={item.title} onChange={handleChange} ></input>

            <label htmlFor='desc'>Description:</label>
            <textarea id='desc' name='desc' initialvalue={item.desc} value={item.desc} onChange={handleChange} ></textarea>

            <label htmlFor='priority'>Priority:</label>
            <select id='priority' name='priority' defaultValue={typeof props.source.data === 'object' ? props.source.data.priority : ''} onChange={handleChange}>
                <option id='1' name='1' value='1'>High</option>
                <option id='2' name='2' value='2' >Medium</option>
                <option id='3' name='3' value='3'>Low</option>
            </select>



            <label htmlFor='project'>Project:</label>

            <select id='project' name='project' defaultValue={props.source.data === undefined ? '' : typeof props.source.data === 'object' ? `${props.source.data.project}` : `${props.source.data}`} onChange={handleChange}>
                <option value='none'>No Project</option>
                {currentUser.planner.projects.map(project => <option id={project.project._id} name={project.project._id} value={project.project._id} key={project.project._id}>{project.project.title}</option>)}
            </select>

            <label htmlFor='due_date'>Due By Date:</label>
            <input type='date' id='due_date' name='due_date' defaultValue={item.due_date.toString().substr(0, 10)} required onChange={handleChange}></input>
            <button type='submit'>{typeof props.source.data === 'object' ? 'Edit Item' : 'Add New Item'}</button>
        </form>
    )
}

export default NewItem;