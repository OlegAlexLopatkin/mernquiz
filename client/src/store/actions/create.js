import { CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION } from "./actionType";
import axios from "../../axios/axios-quiz";

export function createQuizQuestion(item) {
  return {
    type: CREATE_QUIZ_QUESTION,
    item
  };
}

export function resetQuizCreation() {
  return {
    type: RESET_QUIZ_CREATION
  };
}

export function finishCreateQuiz() {
  return async (dispatch, getState) => {
    const quiz = getState().create.quiz;
    await axios.post("/quizes", { quiz, userId: getState().auth.userId });
    dispatch(resetQuizCreation());
  };
}
