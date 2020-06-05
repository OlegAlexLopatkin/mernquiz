// import axios from "axios";
import axios from "../../axios/axios-quiz";
import { AUTH_SUCCESS, AUTH_LOGOUT } from "./actionType";
// import key from '../../keys'

let timeout;

export function auth(email, password, isLogin) {
  return async dispatch => {
    const authData = {
      email,
      password
    };

    let url =
      `/api/auth/register`;

    if (isLogin) {
      url =
        `/api/auth/login`;
    }

    

    const response = await axios.post(url, authData);
    const data = response.data;

    const expirationDate = new Date(
      new Date(data.expirationDate)
    );

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("expirationDate", expirationDate);

    dispatch(authSuccess(data.token, data.userId));
    dispatch(autoLogout(expirationDate.getTime() - new Date().getTime()));
  };
}

export function autoLogout(time) {
  return dispatch => {
    timeout = setTimeout(() => {
      dispatch(logout());
    }, time);
  };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  clearTimeout(timeout);
  
  return {
    type: AUTH_LOGOUT
  };
}

export function autoLogin() {
  return dispatch => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, userId));
        dispatch(
          autoLogout(expirationDate.getTime() - new Date().getTime())
        );
      }
    }
  };
}

export function authSuccess(token, userId) {
  return {
    type: AUTH_SUCCESS,
    token,
    userId
  };
}
