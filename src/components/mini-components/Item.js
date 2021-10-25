

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
                <button className='item-button delete-button'><i className="fas fa-info-circle"></i></button>
                <p>{item.due_date.slice(0, 10)}</p>
                <button alt='edit item' className='item-button edit-button'><i className="far fa-edit" alt='edit item'></i></button>
                <button alt='delete item' className='item-button delete-button'><i className="far fa-trash-alt" alt='delete item'></i></button>
            </div>
        </div>
    )
}

export default Item