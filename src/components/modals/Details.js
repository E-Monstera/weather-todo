import { htmlDecode } from "../../services/formatting";


const Details = (props) => {
    //Destructure props
    const { item } = props;


    return (
        <div className='modal'>
            <div className='modal-main details-modal'>
                <div>
                    <h2>Details...</h2>
                    <button className='x-button' onClick={props.toggleDetails}>X</button>
                </div>
                <h1 id='details-title'>{htmlDecode(item.title)}</h1>
                <p className='details-header'>Description:</p>
                <p>{htmlDecode(item.desc)}</p>
                <p><span className='details-header'>Priority: </span>{item.priority === 1 ? 'Urgent' : item.priority === 2 ? 'Medium' : 'Low'}</p>
                {item.project === null ? <p className='details-header'>No Associated Project</p> : <p><span className='details-header'>Project: </span>{htmlDecode(item.project.title)} </p>}
                <p><span className='details-header'>Due Date: </span>{item.due_date.slice(0, 10)}</p>
                <p><span className='details-header'>Completed: </span>{item.completed ? 'Yes' : 'No'}</p>

                <button alt='edit item' className='item-button edit-button' onClick={props.handleEdit}><i className="far fa-edit" alt='edit item' id={item._id}></i></button>
                <button alt='delete item' className='item-button delete-button' onClick={props.handleDelete}><i className="far fa-trash-alt" alt='delete item' id={item._id}></i></button>

            </div>
        </div>
    )
}

export default Details