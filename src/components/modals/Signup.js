import { useState } from 'react';
import { register } from '../../services/auth.service'

const Signup = (props) => {


    // State to hold the user data
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        password: '',
        username: '',
        email: ''
    });

    //Function to handle the controlled input for new user data.
    const handleChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    // Method to validate the password has 8 characters, a number, and a symbol
    const validate = () => {
        let numTest = new RegExp('.*[0-9]');
        let symTest = new RegExp('.*[!@#$%^&*]');

        let pass, name;
        // Password validation
        if (user.password.length < 8 || !numTest.test(user.password) || !symTest.test(user.password)) {
            pass = 'Password must have 8 characters, 1 number, and 1 symbol';
        } else {
            pass = ''
        }

        //username validation
        if (user.username.length < 3) {
            name = 'Username must have 3 characters';
        } else {
            name = '';
        }

        setErrors(prevState => ({             //Set the validation errors, if any
            password: pass,
            username: name,
            email: prevState.email
        }))

        if (pass === '' && name === '') {       //If both errors are empty, validation passed
            return true;
        } else {
            return false;
        }
    }

    //Function to handle submitting a new user to the database
    const handleSubmit = async (e) => {
        e.preventDefault();     //Prevent page refresh

        let validation = validate();    //Validate the password has 1 num, 1 symbol, and 8 keys in length

        if(validation) {  //validation is true, meaning all validation passed
            let results = await register(user)
            if (results.status === 200) {
                //success! Toggle modal and display login page
                props.toggleSignUp();
                props.toggleLogin(true);
            } else {
                //Failure, email already exists
                setErrors(prevState => ({
                    ...prevState,
                    email: results.message
                }))
            }
        } else {
            //allow user to fix errors
        }
    }

    return (
        <div className='modal'>
            <div className='modal-main'>
                <button className='x-button' onClick={props.toggleSignUp}>X</button>
                <h2>Create New Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-element'>
                        <label htmlFor='username'>Username:</label>
                        <input type='text' id='username' name='username' required initialvalue={user.username} value={user.username} onChange={handleChange}></input>
                        {errors.username === ''? null: <span className='error'>{errors.username}</span>}
                    </div>

                    <div className='form-element'>
                        <label htmlFor='email'>Email:</label>
                        <input type='email' id='email' name='email' required initialvalue={user.email} value={user.email} onChange={handleChange} />
                        {errors.email === ''? null: <span className='error'>{errors.email}</span>}
                    </div>

                    <div className='form-element'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' name='password' required initialvalue={user.password} value={user.password} onChange={handleChange}></input>
                        {errors.password === ''? null: <span className='error'>{errors.password}</span>}
                    </div>

                    <button className='submit-button' type='submit' >SignUp</button>
                </form>
            </div>
        </div>
    )
}

export default Signup