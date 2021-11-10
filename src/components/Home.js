import { useState, useEffect, useContext } from 'react';
import { getWeather, updateLocation, put_item, updateUnits } from '../services/user.service';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Weather from './mini-components/Weather';
import { htmlDecode } from '../services/formatting'

const Home = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    const [location, setLocation] = useState('');       //State to hold the user inputted location
    const [loading, setLoading] = useState(true);       //State to serve as a flag to users when data is being fetched

    // Function to make user input for a location a controlled input
    const handleChange = (e) => {
        setLocation(e.target.value)
    }

    //Function to handle submitting a new location and grabbing the associated weather
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateLocation(location); //Start updating the location in the db
        userContext.userDispatch({ type: 'updateUserLocation', payload: { location: location } });    //Update location in App.js - Starts Loading animation
        grabWeather(location);
    }

    // Function to grab weather upon a user entering a new location
    const grabWeather = async (local) => {
        try {
            let data = await getWeather(local);  //Send the location to the backend API
            setLoading(false);
            setLocation('');
            userContext.userDispatch({ type: 'updateWeather', payload: { weather: data.data.weather } });    //Update location in App.js - Starts Loading animation
        } catch (err) {
            console.log('error')
            console.log(err)
        }
    }


    //useEffect to disable the loading animation when App.js is done grabbing currentUser weather
    useEffect(() => {
        if (currentUser.username === '') {
            //return, currentUser is still being set
            return;
        } else if (Object.keys(currentUser.primary_weather).length !== 0) {
            setLoading(false);      //Weather was grabbed in App.js, allow DOM to reflect this
        } else {
            return;
        }
    }, [currentUser])

    //Function to update the completed status of a post
    const updateChecked = async (e) => {
        console.log('in update checked')
        console.log(e.target)
        //First, grab the items data and update the completed status
        let initIndex = currentUser.planner.items.findIndex(item => item._id === e.target.className)
        let newItem = Object.assign({}, currentUser.planner.items[initIndex]);
        newItem.completed = !currentUser.planner.items[initIndex].completed;
        newItem.title = htmlDecode(currentUser.planner.items[initIndex].title);

        //Then, update in state
        let res = await put_item(newItem)
        if (res.message === 'item updated') {
            //success, now update item in state
            const planner = currentUser.planner;
            let index = planner.items.findIndex(item => item._id === res.item._id)
            planner.items.splice(index, 1, res.item);

            //Then update userContext to allow live updates for user
            userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        }
    }

    //Component used in DailyPlanner for each item
    const HomeItem = (props) => {
        let { item } = props;
        return (
            <div className='home-item' key={item._id}>
                <p className={item.priority === 1 ? 'bullet high' : item.priority === 2 ? 'bullet med' : 'bullet low'}>&bull;</p>
                <form className='item-checkbox-form'>
                    <label htmlFor='completed'>
                        <input type='checkbox' checked={item.completed} name='completed' id='completed' className={`${item._id} item-checkbox`} onChange={updateChecked}></input>
                        <span></span>
                    </label>
                </form>
                <h5>{htmlDecode(item.title)}</h5>
            </div>
        )
    }

    const DailyPlanner = (props) => {
        if (Object.keys(currentUser.planner).length === 0) {
            //currentUser is still being set
            return null;
        } else {
            //Create an empty array to fill with items matching the query
            let items = currentUser.planner.items;
            let arr = [];
            let date = new Date();
            let message = '';        //Allows a custom message to be set if nothing is actively due for that section

            if (props.filter === 'today') {
                //Extract the due_date and create a new day to compare 
                message = 'Nothing Due Today';
                //Check the duedate for each item to see if it matches todays date
                items.forEach(item => {
                    if (item.due_date.slice(0, 10) === date.toISOString().slice(0, 10)) {
                        let res = <HomeItem item={item} key={item._id} />
                        arr.push(res);
                    }

                })
            } else if (props.filter === 'tomorrow') {
                date.setDate(date.getDate() + 1)
                message = 'Nothing Due Tomorrow';
                //Check the duedate for each item to see if it matches todays date
                items.forEach(item => {
                    if (item.due_date.slice(0, 10) === date.toISOString().slice(0, 10)) {
                        let res = <HomeItem item={item} key={item._id} />
                        arr.push(res);
                    }

                })
            } else if (props.filter === 'urgent') {
                message = 'Nothing Due Urgently';
                //Filter is looking for items that are 'urgent' (priority===1)
                items.forEach(item => {
                    if (item.priority === 1) {
                        let res = <HomeItem item={item} key={item._id} />;
                        arr.push(res);
                    }

                })
            } else {
                //If prop.filter didn't match those above, return null
                return null;
            }



            //prop.filter matched an if statement above. The if statements populated arr with
            //items if they matched the date. Now, check if any items matched the requirements.
            //if nothing matched, arr is empty so return an 'error' message
            if (arr.length !== 0) {
                return arr;
            } else {
                return (
                    <div className='home-item'>
                        <h5>{message}</h5>
                    </div>
                )
            }

        }
    }

    // Function to change the users preferred units
    const handleUnits = async () => {
        let res = await updateUnits();      //Update in db
        if (res.status === 200) {
            //Updated state for live updates
            userContext.userDispatch({ type: 'updateUnits', payload: { units: res.data.user.units } })
        } else {
            console.log('error')
            console.log(res)
        }

    }



    return (
        <div className='home'>
            <div className='home-weather-wrapper'>
                    <div className='weather-form'>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='location'>Search New Location: </label>
                            <input type='text' id='location' name='location' placeholder='Search New City/Zipcode' required initialvalue={location} value={location} onChange={handleChange}></input>
                        </form>
                    </div>
                    {currentUser.location === '' ? <h3 className='title-color'>Please Enter Location Above</h3> : loading ?
                        <h3 className='title-color'>Loading...</h3> : < Weather />}


            </div>
            <div className='home-planner-wrapper'>
                <h2 className='title-color'>Planner</h2>
                <div className='home-planner-container'>
                    <div className='planner-holder'>
                        <Link to='/planner'>To Planner →</Link>
                        <div>
                            <h3>Due Today</h3>
                            <DailyPlanner filter='today' />
                        </div>
                        <div>
                            <h3>Due Tomorrow</h3>
                            <DailyPlanner filter='tomorrow' />
                        </div>
                        <div>
                            <h3>Urgent</h3>
                            <DailyPlanner filter='urgent' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home