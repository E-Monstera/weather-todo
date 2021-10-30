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
        data: undefined,
        object: 'note'
    })

    const clearSource = () => {
        setSource({
            data: undefined,
            object: 'note'
        })
    }

    const handleEdit = (e) => {
        //Grab the note in quest and set it as 'source' - This allows NewNote to access the notes data
        let planner = currentUser.planner;
        let index = planner.notes.findIndex(note => note._id === e.target.id)
        setSource({
            data: planner.notes[index],
            object: 'note'
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

    return (
        <div className='notes-wrapper'>
            <div className='notes-header'>
                <h2>Notes</h2>
                <button onClick={toggleModal}>+</button>
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