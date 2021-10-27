import { useState, useEffect, useContext } from 'react';
import { getWeather, updateLocation, put_item } from '../services/user.service';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Weather from './mini-components/Weather';
import { htmlDecode } from '../services/formatting'

const Home = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    const [location, setLocation] = useState('');       //State to hold the user inputted location
    const [loading, setLoading] = useState(true);

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
            console.log('HIT USEEFFECT FOR LOADING')
            setLoading(false);      //Weather was grabbed in App.js, allow DOM to reflect this
        } else {
            return;
        }
    }, [currentUser])

    //Function to update the completed status of a post
    const updateChecked = async (e) => {
        //First, grab the items data and update the completed status
        let initIndex = currentUser.planner.items.findIndex(item => item._id === e.target.className)
        let newItem = currentUser.planner.items[initIndex];
        newItem.completed = !newItem.completed;

        // //Then, update in state
        // let res = await put_item(newItem)
        // if (res.message === 'item updated') {
        //     //success, now update item in state
        //     //First, update item in the planner.items list
        //     const planner = currentUser.planner;
        //     let index = planner.items.findIndex(item => item._id === res.item._id)
        //     planner.items.splice(index, 1, res.item);

        //     //Then, update item in the project, if it is part of the project
        //     if (res.item.project !== null) {
        //         let index2 = planner.projects.findIndex(proj => res.item.project === proj.project._id)
        //         let index3 = planner.projects[index2].items.findIndex(item => item._id === res.item._id)
        //         planner.projects[index2].items.splice(index3, 1, res.item)
        //     }

        //     //Then update userContext to allow live updates for user
        //     userContext.userDispatch({ type: 'updatePlanner', payload: { planner } })
        // }
    }



    const DailyPlanner = (props) => {

        if (currentUser.planner.length === 0) {
            //currentUser is still being set
            return null;
        } else {

            if (props.filter === 'today') {
                //Create an empty array to fill with items matching the query
                let arr = [];

                //Extract the due_date and create a new day to compare 
                let items = currentUser.planner.items;
                let today = new Date();

                //Check the duedate for each item to see if it matches todays date
                items.forEach(item => {
                    if (item.due_date.slice(0, 10) === today.toISOString().slice(0, 10)) {
                        let res = (
                            <div className='home-item'>
                                <form className='item-checkbox'>
                                    <label htmlFor='completed'>Completed?</label>
                                    {item.completed ?
                                        <input type='checkbox' checked name='completed' id='completed' className={item._id} onChange={updateChecked}></input>
                                        :
                                        <input type='checkbox' name='completed' id='completed' className={item._id} onChange={updateChecked}></input>
                                    }
                                </form>
                                <h5>{htmlDecode(item.title)}</h5>
                            </div>
                        )
                        arr.push(res);
                    } else {

                    }
                })
                return arr;
            } else {
                return null;
            }
        }
    }


    return (
        <div className='home'>
            {console.log(currentUser)}
            <div className='home-weather-wrapper'>
                {currentUser.location === '' ? <h3>Current Location: None on file</h3> :
                    <h2>{currentUser.location[0].toUpperCase()}{currentUser.location.slice(1)}</h2>}
                <div className='weather-form'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='location'>Search New Location: </label>
                        <input type='text' id='location' name='location' placeholder='Search New City/Zipcode' required initialvalue={location} value={location} onChange={handleChange}></input>
                    </form>
                </div>

                {loading ? <h3>Loading...</h3> : <Weather />}

            </div>
            <div className='home-planner-wrapper'>
                <h2>Planner</h2>
                <div className='home-planner-container'>
                    <div className='planner-holder'>
                        <Link to='/planner'>To Planner →</Link>
                        <div>
                            <h3>Due Today</h3>
                            <DailyPlanner filter='today' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home