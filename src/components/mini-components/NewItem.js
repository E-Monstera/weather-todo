import { useState, useContext } from 'react';
import { UserContext } from '../../App';


const NewItem = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State to hold the new item data
    const [item, setItem] = useState({
        title: '',
        desc: '',
        priority: '',
        project: '',
        due_date: ''
    })

    const handleChange = (e) => {
        setItem(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('would submit new note to database')
        console.log(item)
    }

    return (
        <form onSubmit={handleSubmit} >

            <label htmlFor='title'>Title:</label>
            <input type='text' id='title' name='title' initialvalue={item.title} value={item.title} onChange={handleChange} ></input>

            <label htmlFor='desc'>Description:</label>
            <textarea id='desc' name='desx' initialvalue={item.desc} value={item.desc} onChange={handleChange} ></textarea>

            <label htmlFor='priority'>Priority:</label>
            <select id='priority' name='priority' onChange={handleChange}>
                <option value='1'>High</option>
                <option value='2'>Medium</option>
                <option value='3'>Low</option>
            </select>

            <label htmlFor='project'>Project:</label>
            <select id='project' name='project' onChange={handleChange}>
                <option value='none'>No Project</option>
                {currentUser.planner.projects.map(project => <option id={project.project._id} name={project.project._id} key={project.project._id}>{project.project.title}</option>)}
            </select>

            <label htmlFor='due_date'>Due By Date:</label>
            <input type='date' id='due_date' name='due_date' onChange={handleChange}></input>
            <button type='submit'>Add New Item</button>
        </form>
    )
}

export default NewItem;