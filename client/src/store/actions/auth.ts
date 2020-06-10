// import axios from "axios";
import axios from "../../axios/axios-quiz";
import { AUTH_SUCCESS, AUTH_LOGOUT } from "./actionType";
import {
  ThunkAction
} from './thunks';
// import key from '../../keys'

type State = Object;

type Actions = {
  type: string
  token: string | null
  userId: string

} | {type: string};
type ThunkResult<R> = ThunkAction<R, State, undefined, Actions>;

let timeout: any;

export function auth(email: string, password: string, isLogin: boolean): ThunkResult<void> {
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
    localStorage.setItem("expirationDate", expirationDate.toString());

    dispatch(authSuccess(data.token, data.userId));
    dispatch(autoLogout(expirationDate.getTime() - new Date().getTime()));
  };
}

export function autoLogout(time: number): ThunkResult<void> {
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

export function autoLogin(): ThunkResult<void> {
  return dispatch => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate") || "");
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

export function authSuccess(token: string, userId: string | null) {
  return {
    type: AUTH_SUCCESS,
    token,
    userId
  };
}
