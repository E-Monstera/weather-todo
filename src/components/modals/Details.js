import { htmlDecode } from "../../services/formatting";
import { format } from 'date-fns';

const Details = (props) => {
    //Destructure props
    const { item } = props;


    return (
        <div className='modal'>
            <div className='modal-main details-modal'>
                <div className='details-header'>
                    <h2>Details...</h2>
                    <div className='detail-buttons'>
                        <button alt='edit item' className='item-button edit-button' onClick={props.handleEdit}><i className="far fa-edit" alt='edit item' id={item._id}></i></button>
                        <button alt='delete item' className='item-button delete-button' onClick={props.handleDelete}><i className="far fa-trash-alt" alt='delete item' id={item._id}></i></button>
                    </div>
                    <button className='x-button' onClick={props.toggleDetails}>X</button>
                </div>
                <div className='details'>
                    <h1 id='details-title'>{htmlDecode(item.title)}</h1>
                    <div>
                        <p className='details-label'>Description:</p>
                        <p id='details-desc'>{htmlDecode(item.desc)}</p>
                    </div>
                    <div>
                        <p><span className='details-label'>Priority: </span>{item.priority === 1 ? 'Urgent' : item.priority === 2 ? 'Medium' : 'Low'}</p>
                    </div>
                    <div>
                        {item.project === null ? <p className='details-label'>No Associated Project</p> : <p><span className='details-label'>Project: </span>{htmlDecode(item.project.title)} </p>}
                    </div>
                    <div>
                        <p><span className='details-label'>Due Date: </span>{format((new Date(item.due_date)), 'MM/dd/yyyy')}</p>
                    </div>
                    <div>
                        <p><span className='details-label'>Completed: </span>{item.completed ? 'Yes' : 'No'}</p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Details