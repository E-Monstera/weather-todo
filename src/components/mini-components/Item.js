import NewForm from "../modals/NewForm";
import { useState, useContext } from 'react';
import { delete_item, put_item } from "../../services/user.service";
import { UserContext } from "../../App";
import Details from "../modals/Details";
import { htmlDecode } from "../../services/formatting";

const Item = (props) => {
    //Destructure props
    const { item } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State and function to handle toggling the NewForm modal
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    //State and function to toggle the details component
    const [detailModal, setDetailModal] = useState(false);
    const toggleDetails = () => {
        setDetailModal(!detailModal);
    }

    // State must be sent to the NewForm modal and NewProject modal
    // in order to allow user to update item.
    const [source, setSource] = useState({
        data: undefined,
        object: 'item'
    })

    const handleEdit = (e) => {
        setDetailModal(false);
        //set source in state. The data section will hold the item object
        setSource({
            data: item,
            object: 'item'
        })

        toggleModal();
        //display the modal
    }

    const handleDelete = async (e) => {
        setDetailModal(false);                  //Close the detail modal if it was opened
        let res = await delete_item(e.target.id)
        if (res.message === 'Item deleted') {
            //success, now remove item from items
            const planner = currentUser.planner;
            //First, remove item from general list
            let index = planner.items.findIndex(item => item._id === e.target.id)
            planner.items.splice(index, 1);

            //Update usercontext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    //Function to update the completed status of a post
    const updateChecked = async (e) => {
        console.log('in update checked')
        let classes = e.target.className.split(' ')
        console.log(classes)
        //First, grab the items data and update the completed status
        let initIndex = currentUser.planner.items.findIndex(item => item._id === classes[0])
        let newItem = Object.assign({}, currentUser.planner.items[initIndex]);
        newItem.completed = !currentUser.planner.items[initIndex].completed;
        newItem.title = htmlDecode(currentUser.planner.items[initIndex].title);

        //Then, update in state
        let res = await put_item(newItem)
        if (res.message === 'item updated') {
            //success, now update item in state
            //First, update item in the planner.items list
            const planner = currentUser.planner;
            let index = planner.items.findIndex(item => item._id === res.item._id)
            planner.items.splice(index, 1, res.item);

            //Then update userContext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    return (
        <div className='item item-container'>
            <div className='item item-title'>
            <i className={item.priority === 1? "fas fa-exclamation-triangle" : item.priority ===2 ? "fas fa-exclamation-circle" : "fas fa-dot-circle"}></i>
                {/* <p className={item.priority === 1 ? 'bullet high' : item.priority === 2 ? 'bullet med' : 'bullet low'}>&bull;</p> */}
                <form className='item-checkbox-form'>
                    <label htmlFor='completed'>
                        <input type='checkbox' checked={item.completed} name='completed' id='completed' className={`${item._id} item-checkbox`} onChange={updateChecked}></input>
                        <span></span>
                    </label>
                </form>
                <p>{htmlDecode(item.title)}</p>
            </div>
            <div className='item item-details'>
                <button className='item-button detail-button' onClick={toggleDetails}><i className="fas fa-info-circle"></i></button>
                <p>{item.due_date.slice(0, 10)}</p>
                <button alt='edit item' className='item-button edit-button' onClick={handleEdit}><i className="far fa-edit" alt='edit item' id={item._id}></i></button>
                <button alt='delete item' className='item-button delete-button' onClick={handleDelete}><i className="far fa-trash-alt" alt='delete item' id={item._id}></i></button>
            </div>
            {modal ? <NewForm source={source} toggleModal={toggleModal} /> : null}
            {detailModal ? <Details toggleDetails={toggleDetails} handleDelete={handleDelete} handleEdit={handleEdit} item={item} /> : null}
        </div>
    )
}

export default Item