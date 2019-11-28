import React, {useReducer} from 'react';

export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_LOGIN = 'SET_LOGIN';
export const SET_LOGOUT = 'SET_LOGOUT';
export const SET_USER = 'SET_USER';
export const SET_USER_DATA = 'SET_USER_DATA';


export default function dataReducer (state, action)  {

  switch (action.type) {
    case SET_APPLICATION_DATA:
      return {
        ...state,
        categories: [...action.categories],
        appointments: [...action.appointments],
        notes: [...action.notes],
      };
    case SET_LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case SET_USER_DATA: 
       return { 
       ...state,
       user: action.user ? {...action.user} : null
    };
    case SET_USER:
        localStorage.setItem('token', action.token);
      return {
        ...state,
        token: action.token,
        user: action.user,
        isAuthenticated: true,
        loading: false
      };
    default:
      console.log("Unkown type in reducer");
      return state;
  }
}