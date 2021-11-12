import { useState, useContext } from 'react';
import { login } from '../../services/auth.service'
import { UserContext } from '../../App';
import { getWeather, getToDo } from '../../services/user.service';

const Login = (props) => {

    // Grab UserContext in order to alert App.js that a user has logged in
    const userContext = useContext(UserContext);

    //State to hold the current user
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    //State to hold any errors
    const [error, setError] = useState('');

    //Function to handle state change for controlled inputs
    const handleChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }


    //Function to handle submitting data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await login(user)     //Wait for user to login
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
            setError(res.data.message)
        }
    }

    return (
        <div className='modal'>
            <div className='modal-main'>
                <button className='x-button' onClick={props.toggleLogin}>X</button>
                <h2>Login</h2>
                {props.newUserFlag ? <span className='success'>Account Created! Login with new account below!</span> : null}
                <form onSubmit={handleSubmit}>
                    <div className='form-element'>
                        <label htmlFor='email'>Email:</label>
                        <input type='text' id='email' autoFocus name='email' required initialvalue={user.username} value={user.username} onChange={handleChange}></input>
                    </div>

                    <div className='form-element'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' name='password' required initialvalue={user.password} value={user.password} onChange={handleChange}></input>
                    </div>
                    {error === '' ? null : <span className='error'>{error}</span>}
                    <button className='submit-button' type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login