

const Item = (props) => {
    const { item } = props;

    return (
        <div className='item item-container'>
            <div className='item item-title'>
                <form className='item-checkbox'>
                    <label htmlFor='completed'>Completed?</label>
                    <input type='checkbox' name='completed' id='completed'></input>
                </form>
                <p>{item.title}</p>
            </div>
            <div className='item item-details'>
                <button>Details</button>
                <p>{item.due_date.slice(0, 10)}</p>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
    )
}

export default Item