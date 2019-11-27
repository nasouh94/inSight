import React from 'react';
import './App.scss';
import useApplicationData from "./hooks/useApplicationData";
import Calendar from "./components/Calendar"
import Nav from './components/nav/nav';
import SideBar from './components/sidebar/sidebar'; 
import LoginPage from './components/login_register/loginPage'
import RegisterPage from './components/login_register/registerPage'
import NotesList from './components/categoryPage/notesList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import PrivateRoute from './components/PrivateRoute';

import Editor from './components/textEditor/newText';

import MainPage from './components/MainPage'

function App() {

  const { state, dispatch, addUser } = useApplicationData();

  const userList = state.users.map( user => (
    <li key={user.id}>
      {user.first_name} {user.last_name} {user.email}
    </li>
  ))


  return (
    <Router>
    <Switch>
      <Route exact path="/" component={LoginPage}/>
      <Route path="/register" component={RegisterPage}/>
      <PrivateRoute path="/main" component={MainPage} />
      </Switch>
    </Router>
    
  );
}

export default App;