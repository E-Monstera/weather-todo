import { htmlDecode } from "../../services/formatting";


const Details = (props) => {
    //Destructure props
    const { item } = props;


    return (
        <div className='modal'>
            <div className='modal-main'>
                <div>
                    <h2>Details...</h2>
                    <button className='x-button' onClick={props.toggleDetails}>X</button>
                </div>
                <h1>{htmlDecode(item.title)}</h1>
                <p>Description:</p>
                <p>{htmlDecode(item.desc)}</p>
                <p>Priority: {item.priority === 1 ? 'Urgent' : item.priority === 2 ? 'Medium' : 'Low'}</p>
                {item.project === null ? <p>No Associated Project</p> : <p>Project: {htmlDecode(item.project.title)} </p>}
                <p>Due Date: {item.due_date.slice(0, 10)}</p>
                <p>Completed: {item.completed ? 'Yes' : 'No'}</p>

                <button alt='edit item' className='item-button edit-button' onClick={props.handleEdit}><i className="far fa-edit" alt='edit item' id={item._id}></i></button>
                <button alt='delete item' className='item-button delete-button' onClick={props.handleDelete}><i className="far fa-trash-alt" alt='delete item' id={item._id}></i></button>

            </div>
        </div>
    )
}

export default Details