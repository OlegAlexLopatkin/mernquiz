import { combineReducers } from "redux";
import quizReducer from "./quiz";
import authReducer from "./auth";

export default combineReducers({
  quiz: quizReducer,
  auth: authReducer
});
