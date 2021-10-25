import './assets/styles/App.scss'
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import React, { useReducer, useEffect } from 'react';
import { logout, authenticateUser } from './services/auth.service'
import { getWeather, getToDo } from './services/user.service';
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
      console.log('in setUser')
      console.log(action.payload.user)
      if (action.payload.user.location) {
        location = action.payload.user.location;
      }
      return {
        id: action.payload.user._id,
        location: location,
        username: action.payload.user.username,
        email: action.payload.user.email,
        primary_weather: {},
        planner: {}
      }

    case 'updateUserLocation':
      return {
        ...state,
        location: action.payload.location
      }

    case 'updatePlanner':
      return {
        ...state,
        planner: action.payload.planner
      }

    case 'updateWeather':
      return {
        ...state,
        primary_weather: action.payload.weather
      }

      case 'updatePlanWeath':
        console.log('updateplanweath')
        console.log(action.payload)
        return {
          ...state,
          primary_weather: action.payload.weather,
          planner: action.payload.planner
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

  // useEffect to authenticate a returning user if a jwt token exists
  useEffect(() => {
    if (localStorage.getItem('user')) {
      //User exists and is logged in, check if credentials are still good
      authenticateUser()
        .then(response => { //Success, update userContext
          dispatch({ type: 'setUser', payload: { user: response.data.user } })

          // Now that the users basic data has been collected, grab their weather data and planner
          getToDo()
          .then(res2 => {
            console.log('following getToDo in App')
            if (response.data.user.location === '') {
              //A location has not yet been set by the user
              dispatch({ type: 'updatePlanner', payload: { planner: res2.data } })
            } else {
              getWeather(response.data.user.location)
              .then(res3 => {
                dispatch({ type: 'updatePlanWeath', payload: { planner: res2.data, weather: res3.data.weather } })
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
