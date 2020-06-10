import { AUTH_SUCCESS, AUTH_LOGOUT } from "../actions/actionType";

interface IInitialState {
  token: null | string
  userId: string
}

interface IAction {
  type: string
  token?: string
  userId?: string
}
const initialState: IInitialState = {
  token: null,
  userId: ""
};

export default function authReducer(state: IInitialState = initialState, action: IAction) {
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
