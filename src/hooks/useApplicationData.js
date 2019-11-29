import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import dataReducer,{ SET_APPLICATION_DATA,
                     SET_LOGIN,
                     SET_LOGOUT,
                     SET_USER,
                     SET_USER_DATA, 
                     SET_APPOINTMENT} from '../reducers/dataReducer';

export default function useApplicationData () {

  function addAppointment(event){
    return axios
      .post('/api/appoitnments', event)
      .then(res => {
        console.log(res)
        if(res.data) {
          dispatch({type:SET_APPOINTMENT, appointments: res.data})
        }
      })
  }

  
  function authUser(token) {
    const config = {
      headers: {'Authorization': "bearer " + token}
    }; 
      return axios
      .get('/api/authenticate', config)
      .then((res) => {
        console.log(res)
        if (res.data) {
          dispatch({type: SET_USER, token: token, user: res.data, isAuthenticated: true, loading: false})
        }
      })
  }


  function userLogout() {
    dispatch({ type: SET_LOGOUT })
  }


  function userLogin(user) {

			return axios.post('/api/login',  user )
			.then((res) =>{
        if (res.status === 200) {
          dispatch({type: SET_USER, token: res.data.token, user: res.data.user, isAuthenticated: true, loading: false})
        }
        }
			).catch((err) => {
				console.log(err, "err")
			})
    }
  

  function addUser(user) {
    return axios
      .post('/api/register', {user})
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          dispatch({type: SET_USER, token: res.data.token, user: res.data.newUser, isAuthenticated: true, loading: false})
        }
      })
  }

  const [state, dispatch] = useReducer(dataReducer, ({categories: [], 
                                                      appointments: [],
                                                      notes: [], 
                                                      user: {},
                                                      users: {}, 
                                                      token: '', 
                                                      isAuthenticated: false,
                                                      loading: true}));

  useEffect(() => {
    
    const users = axios.get('/api/users');
    const categories = axios.get('/api/categories');
    const appointments = axios.get('/api/appointments');
    const notes = axios.get('/api/notes');
    

    Promise.all([users, categories, appointments, notes])
           .then(all => {
             dispatch({
               type: SET_APPLICATION_DATA,
               users: all[0].data,
               categories: all[1].data,
               appointments: all[2].data,
               notes: all[3].data

              })
            })
          }, []);
          
          return {
    state,
    dispatch,
    addUser,
    userLogin,
    userLogout,
    authUser,
    addAppointment
  }
}
