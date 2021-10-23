import { useState, useContext } from 'react';
import { login } from '../../services/auth.service'
import { UserContext } from '../../App';

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
            userContext.userDispatch({ type: 'setUser', payload: {user: res.user}})
        } else if (res.status === 400){    //Error, display message to user
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
                        <input type='text' id='email' name='email' required initialvalue={user.username} value={user.username} onChange={handleChange}></input>
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