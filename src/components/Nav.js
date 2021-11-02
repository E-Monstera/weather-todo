import { Link } from 'react-router-dom'
import { useState, useContext } from 'react';
import { logout } from '../services/auth.service';
import { UserContext } from '../App';
import { useHistory } from 'react-router-dom'
const Nav = () => {
    // Grab UserContext from app.js 
    const userContext = useContext(UserContext);
    
    
    const [dropdown, setDropdown] = useState(false);
    
    const toggleDropdown = () => {
        setDropdown(!dropdown)
    }
    
    // Set the stage to be able to redirect a user after logout
    let history = useHistory();
    const handleLogout = () => {
        toggleDropdown();
        logout();
        userContext.userDispatch({ type: 'logoutUser' });
        history.push('/');
    }


    return (
        <nav>
            <div className='title'>
                <Link to='/'>
                    The Weather <div className='title-accent'><p>(or</p><p>not)</p></div> Planner
                </Link>
            </div>
            <button className='toggle-button' onClick={toggleDropdown}>≡</button>
            {dropdown ?
                <ul className='nav-dropdown'>
                    <li>
                        <Link to='/planner' onClick={toggleDropdown}>To Planner</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button></li>
                </ul>
                : null}
        </nav >
    )
}

export default Nav;