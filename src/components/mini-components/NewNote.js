import { useState } from 'react';

const NewNote = () => {
    const [newNote, setNewNote] = useState('')

    const handleChange = (e) => {
        setNewNote(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('would submit new note to database')
        console.log(newNote)
    }
    
    return (
        <form onSubmit={handleSubmit} >
            <label htmlFor='newNote'>Add New Note:</label>
            <textarea id='newNote' name='newNote' initialvalue={newNote} value={newNote} onChange={handleChange} ></textarea>
            <button type='submit'>Add New Note</button>
        </form>
    )
}

export default NewNote;