import React, { useEffect, useReducer } from "react";
import axios from "axios";
import dataReducer, {
  SET_LOGOUT,
  SET_USER,
	SET_SHOW_CATEGORY,
	SET_ADD_CATEGORY,
	SET_ADD_APPOINTMENT,
	SET_CALENDAR_EVENTS,
  SET_TOGGLE,
  SET_DELETE_CATEGORY,
  SET_DELETE_NOTE
} from "../reducers/dataReducer";

export default function useApplicationData() {

	function showCategory(category) {
		dispatch({type: SET_SHOW_CATEGORY, showCategory: true})
	}

  function getAppointmentsForUser(user) {
    return axios.get("/api/appointments", user.id).then(res => {
      console.log(res);
    });
	}
	
	function addCategory(category, id) {
		
		return axios.post(`/api/categories/${id}`, category)
		            .then((res) => {
									if(res.data) {
										dispatch({type: SET_ADD_CATEGORY, category: res.data[0]})
									}
								})
	}

	function deleteCategory(category) {
		return axios.delete(`/api/categories/${state.user.id}/categories/${category.id}`)
                .then(res => {console.log(category.category_name, ' category deleted')
                dispatch({type: SET_DELETE_CATEGORY, category_id: category.id})})
								.catch(error => console.log(error))
  }
  
  function deleteNote(category_id, note_id) {
    return axios.delete(`/api/notes/${state.user.id}/categories/${category_id}/${note_id}`)
         .then(res => {
           dispatch({type: SET_DELETE_NOTE, note_id: note_id})
           console.log('note deleted')})
  }

	function deleteAppointment(appointment_id) {
		console.log(appointment_id);
		return axios.delete(`/api/appointments/${state.user.id}/appointment/${appointment_id}`)
		            .then(res => {
									console.log(res, ' appointment deleted')
								})
								.catch(error => console.log(error))
	}


  function addAppointment(appointment) {

		console.log(appointment.user_id)
    return axios.post(`/api/appointments/${appointment.user_id}`, appointment).then(res => {
        dispatch({type: SET_ADD_APPOINTMENT, appointment: res.data[0]})
        const updatedAppointments = [...state.appointments]
        updatedAppointments.push(res.data[0])
        setCalendarEvents(updatedAppointments, state.categories)
    });
  }

  function userLogout() {
    dispatch({ type: SET_LOGOUT });
  }

  function userLogin(user) {

    return axios
      .post("/api/login", user)
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: SET_USER,
            token: res.data.token,
            user: res.data.user,
            isAuthenticated: true,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err, "err");
      });
  }

  function addUser(user) {

    return axios.post("/api/register", { user }).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SET_USER,
          token: res.data.token,
          user: res.data.newUser,
          isAuthenticated: true,
          loading: false
        });
      }
    });
  }

  const [state, dispatch] = useReducer(dataReducer, {
    categories: [],
    appointments: [],
    notes: [],
    user: {},
    users: {},
    token: "",
		isAuthenticated: false,
		showCategory: false,
		loading: true,
		calendarEvents: []
  });

  function authUser(token) {

    const config = {
      headers: { Authorization: "bearer " + token }
		};
		
    return axios.get("/api/authenticate", config).then(res => {
      if (res.data) {
        dispatch({
          type: SET_USER,
          token: token,
          user: res.data,
          isAuthenticated: true,
					loading: false
				});
				return res.data
      } else {
        console.log("something wrong");
      }
    });
	}

	function setToggle(category) {
    
    let filteredAppointments = state.appointments.filter(appointment => appointment.category_id === category.id)
                                                .map(appointment => {
                                                    console.log('inside map', appointment.toggle);
                                                    appointment.toggle =  !appointment.toggle;
                                                    console.log('inside map2', appointment.toggle);
                                                    return appointment
                                                  })
    console.log(filteredAppointments)
    axios.put(`/api/appointments/${state.user.id}/category/${category.id}/toggle`, filteredAppointments)
         .then(res => setCalendarEvents(state.appointments, state.categories)).catch(e => console.log(e))
	}

	
	function setCalendarEvents(appointments, categories) {
		let calendarEvents = appointments.map(appointment => {
      let category = categories.filter(category => category.id === appointment.category_id)
      let colour;
      if (category[0].colour === 'red') {
        colour = '#FF727C'
      } else if ( category[0].colour === 'blue') {
        colour = '#71D0F2'
      } else if ( category[0].colour === 'yellow') {
        colour = '#FFDF60'
      } else if ( category[0].colour === 'purple') {
        colour = '#D88FD8'
      } else if ( category[0].colour === 'green') {
        colour = '#85E5B5'
      }
			if (appointment.toggle === true) {

				return {
          color: colour,
          location: appointment.location,
          small_note: appointment.appointment_small_note,
					category_name: appointment.category_name,
					id: appointment.id,
					title: appointment.appointment_name,
					start: new Date(appointment.start_date),
					end: new Date(appointment.end_date),
					// allDay: appointment.allDay,
					groupId: appointment.category_id,
          toggle: appointment.toggle
				}
        } else {
          return {}
        }
      })
      console.log(calendarEvents)
      dispatch({type:SET_CALENDAR_EVENTS, calendarEvents})
    }

  // useEffect(() => {

  //   //console.log(state);
  //   const categories = axios.get("/api/categories");
  //   const appointments = axios.get("/api/appointments");
  //   const notes = axios.get("/api/notes");

  //   Promise.all([categories, appointments, notes]).then(all => {
  //     dispatch({
  //       type: SET_APPLICATION_DATA,
  //       categories: all[0].data,
  //       appointments: all[1].data,
  //       notes: all[2].data
	// 		});
  //   });
  // }, []);

  return {
    state,
    dispatch,
    addUser,
    userLogin,
    userLogout,
    addAppointment,
    getAppointmentsForUser,
		authUser,
		addCategory,
		showCategory,
		setCalendarEvents,
		setToggle,
		deleteAppointment,
    deleteCategory,
    deleteNote
  };
}
