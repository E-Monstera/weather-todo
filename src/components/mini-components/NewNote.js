import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { post_note, put_note } from '../../services/user.service'
import { htmlDecode } from '../../services/formatting';

const NewNote = (props) => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    //Destructure props
    const { source } = props;

    //State to hold the new note
    const [newNote, setNewNote] = useState({
        title: '',
        content: ''
    })

    //Function to handle state change due to user input
    const handleChange = (e) => {
        setNewNote(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    // Function to handle submitting the form, a user may edit or create a new note in this function
    const handleSubmit = async (e) => {
        e.preventDefault();
        let planner = currentUser.planner;

        if (source.status === 'new') {
            //Submit the new note to the database
            let res = await post_note(newNote);
            if (res.message === 'Note created') {
                //success! Now update state/context
                planner.notes.push(res.note)
            }
        } else {
            //User is editting an existing note
            let res = await put_note(newNote);
            if (res.message === 'Note updated') {
                // Successfully editted note! Now update state
                let index = planner.notes.findIndex(note => note._id === e.target.id)
                planner.notes.splice(index, 1, res.note)
            }
            //Reset the state of source so that the NewNote modal won't display outdated data
            props.clearSource();
        }
        
        
        userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        props.toggleModal();
    }

    //useEffect triggered on modal load. Used to grab the item data if the user is editting a note
    useEffect(() => {
        if (typeof props.source.data === 'object') {
            // User is editting an existing project, update newNote
            setNewNote(props.source.data)
        }
    }, [props.source])

    return (
        <form onSubmit={handleSubmit} >
            <div className='form-element'>
                <label htmlFor='title'>Add Title:</label>
                <input type='text' id='title' name='title' required initialvalue={htmlDecode(newNote.title)} value={htmlDecode(newNote.title)} onChange={handleChange} ></input>
            </div>
            <div className='form-element new-note-textarea'>
                <label htmlFor='content'>Add New Note:</label>
                <textarea id='content' name='content' required initialvalue={htmlDecode(newNote.content)} value={htmlDecode(newNote.content)} onChange={handleChange} ></textarea>
            </div>
                <button type='submit'>{typeof props.source.data === 'object' ? 'Edit Note' : 'Add New Note'}</button>
        </form>
    )
}

export default NewNote;