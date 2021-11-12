import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { post_item, put_item } from '../../services/user.service';
import { htmlDecode } from '../../services/formatting';


const NewItem = (props) => {
    //Destructure props
    const { source } = props;

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
        if (source.status==='edit') {    //Editing an item
            updateEdit();
        } else {    //Adding a new item
            //Send data to database 
            let res = await post_item(item)
            //Following success, update the project in state and close the modal
            let planner = currentUser.planner;
            let resultingItem = res.item;
            //If the item is associated with a project, fill in that data
            if (res.item.project !== null) {
                let index = currentUser.planner.projects.findIndex(proj => {
                    if (res.item.project === proj._id) return true;
                    else return false;
                })
                resultingItem.project = currentUser.planner.projects[index];
            }

            planner.items.push(resultingItem);       //Update the general list of items
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
        props.toggleModal();
    }

    const updateEdit = async () => {
        if (typeof item.project === 'object' && item.project !== null) {
            // Database populates project with data when leaving the database,
            // Before submitting an item to the db we need to make sure it only contains the id
            let project = item.project._id;
            setItem(prevState => ({
                ...prevState,
                project: project,
            }))
        }
        let res = await put_item(item)
        if (res.message === 'item updated') {
            //success, now update item in state
            //First, update item in the planner.items list
            const planner = currentUser.planner;
            let index = planner.items.findIndex(item => item._id === res.item._id)
            planner.items.splice(index, 1, res.item);
            //Then update userContext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }
    //useEffect to check if the modal was opened to edit an item
    //If it was, update state
    useEffect(() => {
        if (source.status === 'edit') {
            //User is editing an existing item
            setItem(source.data)
        } else if (source.status === 'new' && source.ref !== null) {
            //User is adding an item to a specific project
            setItem(prevState => ({
                ...prevState,
                project: source.ref
            }))
        } else {
            return;
        }

    }, [source])

    return (
        <form onSubmit={handleSubmit} >

            <div className='form-element'>
                <label htmlFor='title'>Title:</label>
                <input type='text' id='title' name='title' autoFocus required initialvalue={htmlDecode(item.title)} value={htmlDecode(item.title)} onChange={handleChange} ></input>
            </div>
            <div className='form-element'>
                <label htmlFor='desc'>Description:</label>
                <textarea id='desc' name='desc' initialvalue={htmlDecode(item.desc)} value={htmlDecode(item.desc)} onChange={handleChange} ></textarea>
            </div>
            <div className='form-element'>
                <label htmlFor='priority'>Priority:</label>
                <select id='priority' name='priority' defaultValue={typeof source.data === 'object' ? source.data.priority : ''} onChange={handleChange}>
                    <option id='1' name='1' value='1'>High</option>
                    <option id='2' name='2' value='2' >Medium</option>
                    <option id='3' name='3' value='3'>Low</option>
                </select>
            </div>

            <div className='form-element'>
                <label htmlFor='project'>Project:</label>
                <select id='project' name='project' defaultValue={source.data === undefined ? 'none' : source.data.project === null ? 'none' : source.data.project._id} onChange={handleChange}>
                    <option value='none'>No Project</option>
                    {currentUser.planner.projects.map(project => <option id={project._id} name={project._id} value={project._id} key={project._id}>{htmlDecode(project.title)}</option>)}
                </select>
            </div>
            <div className='form-element'>
                <label htmlFor='due_date'>Due By Date:</label>
                <input type='date' id='due_date' name='due_date' defaultValue={item.due_date.toString().substr(0, 10)} required onChange={handleChange}></input>
            </div>
            <button type='submit'>{typeof source.data === 'object' ? 'Edit Item' : 'Add New Item'}</button>
        </form>
    )
}

export default NewItem;