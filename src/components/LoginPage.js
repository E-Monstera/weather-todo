import { useState } from 'react';

import Login from './modals/Login';
import Signup from './modals/Signup';


const LoginPage = () => {
    const [loginModal, setLoginModal] = useState(false);
    const [signUpModal, setSignUpModal] = useState(false);
    const [newUserFlag, setNewUserFlag] = useState(false);      //Change to true when a user successfully creates a new account

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

    return (
        <div className='welcome-container'>
            <div className='welcome-header'>
                <div className='banner'>
                    <button onClick={toggleLogin}>Login</button>
                    <div>
                        <h1>The</h1>
                        <h1>Weather</h1>
                        <p>(or not)</p>
                        <h1>Planner</h1>
                    </div>
                </div>
            </div>
            <div className='cta-section'>
                <p>Are you ready for the open road?</p>
                <p>The perfect planner for your day. Create your plans with the weather in mind and you can never go wrong!</p>
                <button onClick={toggleSignUp}>SignUp</button>
                <button>Try Demo Account</button>
            </div>
            <div className='banner-section'>

            </div>
            {loginModal ? <Login toggleLogin={toggleLogin} newUserFlag={newUserFlag} /> : null}
            {signUpModal ? <Signup toggleSignUp={toggleSignUp} toggleLogin={toggleLogin} /> : null}
        </div>
    )
}

export default LoginPage