import { Switch, Route } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './App';

import LoginPage from './components/LoginPage';
import Home from './components/Home';
import ToDo from './components/ToDo';

const Routes = () => {
    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    return (
        <Switch>
            <Route path='/' exact component={currentUser.username === ''? LoginPage:Home} />
            <Route path='/schedule' component={ToDo} />
        </Switch>
    )
}

export default Routes;