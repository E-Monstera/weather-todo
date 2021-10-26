import NewForm from "../modals/NewForm";
import { useState, useContext } from 'react';
import { delete_item, put_item } from "../../services/user.service";
import { UserContext } from "../../App";

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

    // State must be sent to the NewForm modal and NewProject modal
    // in order to allow user to update item.
    const [source, setSource] = useState({
        data: undefined,
        object: 'item'
    })

    const handleEdit = (e) => {
        //set source in state. The data section will hold the item object
        setSource({
            data: item,
            object: 'item'
        })

        console.log(item)
        console.log(item.due_date.toString())
        toggleModal();
        //display the modal
    }

    const handleDelete = async (e) => {
        let res = await delete_item(e.target.id)
        if (res.message === 'Item deleted') {
            //success, now remove item from general item and project list
            const planner = currentUser.planner;
            //First, remove item from general list
            let index = planner.items.findIndex(item => item._id === e.target.id)
            let deletedItem = planner.items[index];
            planner.items.splice(index, 1);

            //Then, remove item from a project list if it has an associated project
            //if true, then it doesn't have an associated project
            console.log('deleted item')
            console.log(deletedItem)
            if (deletedItem.project !== null && deletedItem.project !== undefined) {
                let index2 = planner.projects.findIndex(proj => deletedItem.project === proj.project._id)
                console.log('index2: '+index2)
                let index3 = planner.projects[index2].items.findIndex(item => item._id === e.target.id)
                planner.projects[index2].items.splice(index3, 1)
            }

            //Update usercontext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    //Function to update the completed status of a post
    const updateChecked = async (e) => {
        //First, grab the items data and update the completed status
        let initIndex = currentUser.planner.items.findIndex(item => item._id === e.target.className)
        let newItem = currentUser.planner.items[initIndex];
        newItem.completed = !newItem.completed;

        //Then, update in state
        let res = await put_item(item)
        if (res.message === 'item updated') {
            //success, now update item in state
            //First, update item in the planner.items list
            const planner = currentUser.planner;
            let index = planner.items.findIndex(item => item._id === res.item._id)
            planner.items.splice(index, 1, res.item);

            //Then, update item in the project, if it is part of the project
            if (res.item.project !== null) {
                let index2 = planner.projects.findIndex(proj => res.item.project === proj.project._id)
                let index3 = planner.projects[index2].items.findIndex(item => item._id === res.item._id)
                planner.projects[index2].items.splice(index3, 1, res.item)
            }

            //Then update userContext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    return (
        <div className='item item-container'>
            <div className='item item-title'>
                <form className='item-checkbox'>
                    <label htmlFor='completed'>Completed?</label>
                    {item.completed? 
                    <input type='checkbox' checked name='completed' id='completed' className={item._id} onChange={updateChecked}></input>
                    :
                    <input type='checkbox' name='completed' id='completed' className={item._id} onChange={updateChecked}></input>
                    }
                </form>
                <p>{item.title}</p>
            </div>
            <div className='item item-details'>
                <button className='item-button delete-button'><i className="fas fa-info-circle"></i></button>
                <p>{item.due_date.slice(0, 10)}</p>
                <button alt='edit item' className='item-button edit-button' onClick={handleEdit}><i className="far fa-edit" alt='edit item' id={item._id}></i></button>
                <button alt='delete item' className='item-button delete-button' onClick={handleDelete}><i className="far fa-trash-alt" alt='delete item' id={item._id}></i></button>
            </div>
            {modal ? <NewForm source={source} toggleModal={toggleModal}/> : null}
        </div>
    )
}

export default Item