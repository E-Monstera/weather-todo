import { htmlDecode } from "../../services/formatting";

const Note = (props) => {
    //Destructure note
    const {note, handleEdit, handleDelete} = props;


    return (
        <div className='note-container'>
            <div className='note-container-title'>
                <h3>{htmlDecode(note.title)}</h3>
                <button alt='edit item' className='item-button edit-button' onClick={handleEdit}><i className="far fa-edit" alt='edit item' id={note._id}></i></button>
                <button alt='delete item' className='item-button delete-button' onClick={handleDelete}><i className="far fa-trash-alt" alt='delete item' id={note._id}></i></button>
            </div>
            <pre>{htmlDecode(note.content)}</pre>
        </div>
    )
}

export default Note