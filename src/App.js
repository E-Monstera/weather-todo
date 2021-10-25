import './assets/styles/App.scss'
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import React, { useReducer, useEffect } from 'react';
import {logout, authenticateUser} from './services/auth.service'
import Nav from './components/Nav'

export const UserContext = React.createContext();
const initialState = {
  id: '',
  username: '',
  location: '',
  email: '',
  primary_weather: {},
  planner: []
}

// Reducer method to either set the user in state or logout the user
const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      let location = ''
      if (action.payload.user.location) {
        location = action.payload.user.location;
      }
      return {
        id: action.payload.user.id,
        location: location,
        username: action.payload.user.username,
        email: action.payload.user.email,
        primary_weather: {},
        planner: []
      }

    case 'updateUser':
      return {
        ...state,
        location: action.payload.user.location
      }

    case 'logoutUser':
      return initialState

    default:
      return state
  }
}

function App() {
  // useReducer hook for the user
  const [currentUser, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      //User exists and is logged in, check if credentials are still good
      authenticateUser()
      .then(response => { //Success, update userContext
        dispatch({ type: 'setUser', payload: {user: response.data.user}})
      })
      .catch(error => {
        //Error occured, logout user - Token is most likely expired
        logout();
      })
    } else {
      //No token exists so this is not a returning user, allow user to signup or login
    }
    }, [])

  return (
    <UserContext.Provider
      value={{ currentUser, userDispatch: dispatch }}
    >
      <Router>
        <div className='app rainy-day'>
          <Nav />
            <Routes />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
