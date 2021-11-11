import { useContext, useState } from 'react'
import { UserContext } from '../../App';
import NewForm from '../modals/NewForm';
import Note from './Note';
import { delete_note } from '../../services/user.service';

const Notes = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    const [source, setSource] = useState({
        status: 'new',
        data: undefined,
        id: 'note',
        ref: null
    })

    const clearSource = () => {
        setSource({
            status: 'new',
            data: undefined,
            id: 'note',
            ref: null
        })
    }

    const handleEdit = (e) => {
        //Grab the note in quest and set it as 'source' - This allows NewNote to access the notes data
        let planner = currentUser.planner;
        let index = planner.notes.findIndex(note => note._id === e.target.id)
        setSource({
            data: planner.notes[index],
            status: 'edit',
            id: 'note',
            ref: null
        })

        //setSource will cause modal to open in the note section
        toggleModal();
    }

    // Function to handle deleting a note
    const handleDelete = async(e) => {
        let res = await delete_note(e.target.id)
        if (res.message === 'Note deleted') {
            // Success! Now update planner by removing the note from state
            let planner = currentUser.planner;
            let index = planner.notes.findIndex(note => note._id === e.target.id)
            planner.notes.splice(index, 1)
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    //Function to display the modal to add a new note
    //Purpose of this function is to clear the source before opening the modal,
    //this prevents a bug if an 'edit note' button was pressed before
    const displayNoteModal = () => {
        clearSource();
        toggleModal();
    }

    return (
        <div className='notes-wrapper'>
            <div className='notes-header'>
                <h2>Notes</h2>
                <button onClick={displayNoteModal} className='new-item-button note-button'>+</button>
            </div>
            <div className='notes-container'>
                {console.log(currentUser)}
                {currentUser.planner.notes.length === 0 ? <p>Add New Notes Above!</p> : currentUser.planner.notes.map(note => <Note note={note} key={note._id} handleDelete={handleDelete} handleEdit={handleEdit} />)}
            </div>
            {modal ? <NewForm toggleModal={toggleModal} source={source} clearSource={clearSource}/> : null}
        </div>
    )
}

export default Notes