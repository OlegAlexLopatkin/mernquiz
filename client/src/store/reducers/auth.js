import { AUTH_SUCCESS, AUTH_LOGOUT } from "../actions/actionType";
const initialState = {
  token: null,
  userId: ""
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        userId: action.userId
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: ""
      };
    default:
      return state;
  }
}
