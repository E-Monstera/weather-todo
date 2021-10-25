import { useState } from 'react';

const NewProject = () => {
    const [project, setProject] = useState('')

    const handleChange = (e) => {
        setProject(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('would submit new project to database')
        console.log(project)
    }
    
    return (
        <form onSubmit={handleSubmit} >
            <label htmlFor='newProject'>Add New Project:</label>
            <input type='text' id='newProject' name='newProject' initialvalue={project} value={project} onChange={handleChange} ></input>
            <button type='submit'>Add New Project</button>
        </form>
    )
}

export default NewProject;