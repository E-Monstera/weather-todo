import { useState, useContext } from 'react';
import { UserContext } from '../App';
import Login from './modals/Login';
import Signup from './modals/Signup';
import { getWeather, getToDo } from '../services/user.service';
import { login } from '../services/auth.service'


const LoginPage = () => {
    const [loginModal, setLoginModal] = useState(false);
    const [signUpModal, setSignUpModal] = useState(false);
    const [newUserFlag, setNewUserFlag] = useState(false);      //Change to true when a user successfully creates a new account

    // Grab UserContext in order to alert App.js that a user has logged in
    const userContext = useContext(UserContext);


    const toggleLogin = (flag) => {
        //Toggles the login page
        //The flag variable is used to indicate if a user just successfully signed up
        // if they did so successfully, display the login modal and convey message to users
        if (flag && flag.type !== 'click') {
            setNewUserFlag(true);
        }
        setLoginModal(!loginModal)
    }

    //Function to toggle the signup modal
    const toggleSignUp = () => {
        setSignUpModal(!signUpModal);
    }

    //Function to login the demo user
    const loginDemo = async () => {
        //email: testing@test.com
        //password: Testing123!
        let res = await login({email:'testing@test.com', password:'Testing123!'})     //Wait for user to login
        if (res.status === 200) {   //Success! Update userContext and close modal
            userContext.userDispatch({ type: 'setUser', payload: { user: res.user } })

            // Now that the users basic data has been collected, grab their weather data and planner
            getToDo()
                .then(res2 => {
                    if (res.user.location === undefined) {
                        //A location has not yet been set by the user
                        userContext.userDispatch({ type: 'updatePlanner', payload: { planner: res2.data } })
                    } else {
                        getWeather(res.user.location)
                            .then(res3 => {
                                userContext.userDispatch({ type: 'updatePlanWeath', payload: { planner: res2.data, weather: res3.data.weather } })
                            })
                            .catch(err3 => {
                                console.log('error following getWeather in App.js')
                                console.log(err3)
                            })
                    }
                })
                .catch(err2 => {
                    console.log('error following getToDo')
                    console.log(err2.response)
                })


        } else if (res.status === 400) {    //Error, display message to user
            console.log('error')
        }

    }

    return (
        <div className='welcome-container'>
            <div className='welcome-header'>
                <div className='banner'>
                    <button className='home-button login-button' onClick={toggleLogin}>Login</button>
                    <div>
                        <h1>The</h1>
                        <h1>Weather</h1>
                        <p>or not</p>
                        <h1>Planner</h1>
                    </div>
                </div>
            </div>
            <div className='cta-section'>
                <p>Are you ready for the open road?</p>
                <p>The perfect planner for your day. Create your plans with the weather in mind and you can never go wrong!</p>
                <div>
                    <button className='home-button' onClick={toggleSignUp}>Sign Up</button>
                    <button className='home-button' onClick={loginDemo}>Try Demo Account</button>
                </div>
            </div>
            <div className='banner-section'>

            </div>
            {loginModal ? <Login toggleLogin={toggleLogin} newUserFlag={newUserFlag} /> : null}
            {signUpModal ? <Signup toggleSignUp={toggleSignUp} toggleLogin={toggleLogin} /> : null}
        </div>
    )
}

export default LoginPage