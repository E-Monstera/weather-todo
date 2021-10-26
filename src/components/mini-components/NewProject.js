import { useState, useContext, useEffect } from 'react';
import { post_project, put_project } from '../../services/user.service';
import { UserContext } from '../../App';

const NewProject = (props) => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State to hold the project title as a controlled input
    const [project, setProject] = useState('')

    //Function to handle the title changing
    const handleChange = (e) => {
        setProject(e.target.value)
    }

    //Function to handle submitting a project
    //First, checks if the project in question is one that is being editted or not
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let planner = currentUser.planner;
        if(props.source.data === undefined) {
            //The project is a new project
            console.log('would submit new project to database ' + project)
            let res = await post_project(project);
            //Now, add the project to currentUser.planner. This ensures a live update to the users planner
            planner.projects.push({project: res.project, items: []})
        } else {
            console.log('editting a rpoject')
            //The project is an existing one that is being editted
            let res = await put_project(project, props.source.data._id)
            let index = planner.projects.findIndex(proj => proj.project._id === props.source.data._id);
            let items = planner.projects[index]
            console.log('items')
            console.log(items)
            planner.projects.splice(index, 1, {project: res.project, items: items.items})
            console.log(`eddited post at: ${index}`)
            console.log(currentUser.planner)
        }
        console.log('updated planner')
        console.log(planner)
        userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })   
        props.toggleModal();    //Close the modal
    }

    //useEffect to check if the user is editting a post. if props.source.data === ''
    //Then, the post is new. Otherwise, it is an edit
    //Only runs on mounting
    useEffect(() => {
        if (props.source.data === undefined) {
            return;
        } else {
            setProject(props.source.data.title)
        }
    }, [props.source.data])

    return (
        <form onSubmit={handleSubmit} >
            <label htmlFor='newProject'>{props.source.data===undefined? 'Add New Project': 'Edit Project'}</label>
            <input type='text' id='newProject' name='newProject' initialvalue={project} value={project} onChange={handleChange} ></input>
            <button type='submit'>{props.source.data===undefined? 'Add New Project': 'Edit Project'}</button>
        </form>
    )
}

export default NewProject;