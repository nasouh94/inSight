import React, { useEffect, useReducer } from "react";
import axios from "axios";
import dataReducer, {
  SET_APPLICATION_DATA,
  SET_LOGIN,
  SET_LOGOUT,
  SET_USER,
  SET_USER_DATA,
	SET_APPOINTMENT,
	SET_SHOW_CATEGORY
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
										state.categories.push(res.data[0])
									}
								})
	}

  function addAppointment(event, id) {

    return axios.post(`/api/appointment/${id}`, event).then(res => {
      console.log(res);
      if (res.data) {
        state.appointments.push(res.data[0]);
        console.log(state.appointments);
      }
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
    loading: true
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
		showCategory
  };
}
