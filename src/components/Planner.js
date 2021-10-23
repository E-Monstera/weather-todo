import { useState, useEffect } from 'react';
import { getToDo } from '../services/user.service';
import Item from './mini-components/Item';

const ToDo = () => {
    const [items, setItems] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getToDo()
            .then(response => {
                console.log('success')
                console.log(response.data)
                setItems(response.data.items)
                setProjects(response.data.projects)
            })
            .catch(err => {
                console.log('error')
                console.log(err.response)
            })
    }, [])
    /*
    In this component, we will grab the users items and projects, then display them to the page
    */
    return (
        <div className='planner-wrapper'>
            <div className='planner'>
                <h1>Planner</h1>
                <div className='planner-container'>
                    <div className='planner-sidebar'>
                        <button>Today</button>
                        <button>This Week</button>
                        <button>Urgent</button>
                        <h2>Projects</h2>
                        {projects.map(project => <button key={project.project._id}>{project.project.title}</button>)}
                    </div>
                    <div className='planner-content'>
                        {items.map(item => <Item item={item} key={item._id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ToDo