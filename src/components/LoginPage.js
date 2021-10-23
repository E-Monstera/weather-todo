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
        <div>
            <h1>Login Page</h1>
            <button onClick={toggleLogin}>Login</button>
            <button onClick={toggleSignUp}>SignUp</button>
            {loginModal? <Login toggleLogin={toggleLogin} newUserFlag={newUserFlag}/>: null}
            {signUpModal? <Signup toggleSignUp={toggleSignUp} toggleLogin={toggleLogin}/>: null}
        </div>
    )
}

export default LoginPage