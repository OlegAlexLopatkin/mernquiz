import axios from "../../axios/axios-quiz";
import {
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FETCH_QUIZES_ERROR,
  FETCH_QUIZ_SUCCESS,
  QUIZ_SET_STATE,
  FINISH_QUIZ,
  QUIZ_NEXT_QUESTION,
  QUIZ_RETRY,
  FETCH_MY_QUIZES_SUCCESS,
} from "./actionType";

export function fetchQuizes() {
  return async (dispatch) => {
    dispatch(fetchQuizesStart());
    try {
      const response = await axios.get("/quizes");
      // const quizes = [];
      // Object.keys(response.data).forEach((key, index) => {
      //   quizes.push({
      //     id: key,
      //     name: `Тест №${index + 1}`,
      //     quizTitle: response.data[key].quizTitle
      //   });
      // });

      const quizes = response.data.map(({ _id, quizTitle }, index) => ({
        id: _id,
        name: `Тест №${index + 1}`,
        quizTitle,
      }));

      dispatch(fetchQuizesSuccess(quizes));
    } catch (e) {
      dispatch(fetchQuizesError(e));
    }
  };
}

export function fetchMyQuizes() {
  return async (dispatch, getState) => {
    dispatch(fetchQuizesStart());
    try {
      const response = await axios.get("/quizes");
      const myquizes = [];
      const data = response.data;
      // console.log(data);
      // let index = 0
      // for (let item in data) {
      //   index++;
      //   if (data[item].userId === getState().auth.userId) {
      //     myquizes.push({
      //       id: item,
      //       name: `Тест №${index + 1}`,
      //       quizTitle: data[item].quizTitle
      //     });
      //   }
      // }
      data.forEach(({ userId, _id, quizTitle }, index) => {
        if (userId === getState().auth.userId) {
          myquizes.push({
            id: _id,
            name: `Тест №${index + 1}`,
            quizTitle,
          });
        }
      });
      // console.log('myquizes`', myquizes1)
      // console.log('myquizes', myquizes)

      dispatch(fetchMyQuizesSuccess(myquizes));
    } catch (e) {
      dispatch(fetchQuizesError(e));
    }
  };
}

export function fetchQuizById(quizId) {
  return async (dispatch) => {
    dispatch(fetchQuizesStart());

    try {
      const response = await axios.get(`/quizes/${quizId}`);
      const quiz = response.data;

      dispatch(fetchQuizSuccess(quiz));
    } catch (e) {
      dispatch(fetchQuizesError(e));
    }
  };
}

export function deleteQuizById(quizId) {
  return async (dispatch, getState) => {
    dispatch(fetchQuizesStart());

    try {
      await axios.delete(`/quizes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      const response = await axios.get("/quizes");
      const data = response.data;
      let quizes = [];
      if (data) {
        quizes = data.map(({ _id, quizTitle }, index) => ({
          id: _id,
          name: `Тест №${index + 1}`,
          quizTitle,
        }));
      }

      dispatch(fetchQuizesSuccess(quizes));
      const myquizes = [];
      if (data) {
        data.forEach(({ _id, quizTitle, userId }, index) => {
          if (userId === getState().auth.userId) {
            myquizes.push({
              id: _id,
              name: `Тест №${index + 1}`,
              quizTitle,
            });
          }
        });
      }
      // for (let item in data) {
      //   if (data[item].userId === getState().auth.userId) {
      //     myquizes.push({
      //       id: item,
      //       name: `Тест №${++index}`,
      //       quizTitle: data[item].quizTitle
      //     });
      //   }
      // }
      dispatch(fetchMyQuizesSuccess(myquizes));
    } catch (e) {
      dispatch(fetchQuizesError(e));
    }
  };
}

export function fetchQuizSuccess(quiz) {
  return {
    type: FETCH_QUIZ_SUCCESS,
    quiz,
  };
}

export function fetchQuizesStart() {
  return {
    type: FETCH_QUIZES_START,
  };
}

export function fetchQuizesSuccess(quizes) {
  return {
    type: FETCH_QUIZES_SUCCESS,
    quizes,
  };
}

export function fetchMyQuizesSuccess(myquizes) {
  return {
    type: FETCH_MY_QUIZES_SUCCESS,
    myquizes,
  };
}

export function fetchQuizesError(e) {
  return {
    type: FETCH_QUIZES_ERROR,
    error: e,
  };
}

export function quizSetState(answerState, results) {
  return {
    type: QUIZ_SET_STATE,
    answerState,
    results,
  };
}

export function finishQuiz() {
  return {
    type: FINISH_QUIZ,
  };
}

export function quizNextQuestion(number) {
  return {
    type: QUIZ_NEXT_QUESTION,
    number,
  };
}

export function retryQuiz() {
  return {
    type: QUIZ_RETRY,
  };
}

export function quizAnswerClick(answerId) {
  return (dispatch, getState) => {
    const state = getState().quiz;

    if (state.answerState) {
      const key = Object.keys(state.answerState)[0];
      if (state.answerState[key] === "success") {
        return;
      }
    }
    const question = state.quiz.quiz[state.activeQuestion];
    const results = state.results;

    if (question.rightAnswerId === answerId) {
      if (!results[question.id]) {
        results[question.id] = "success";
      }

      dispatch(quizSetState({ [answerId]: "success" }, results));

      const timeout = window.setTimeout(() => {
        if (isQuizFinished(state)) {
          dispatch(finishQuiz());
        } else {
          dispatch(quizNextQuestion(state.activeQuestion + 1));
        }
        window.clearTimeout(timeout);
      }, 1000);
    } else {
      results[question.id] = "error";
      dispatch(quizSetState({ [answerId]: "error" }, results));
    }
  };
}

function isQuizFinished(state) {
  return state.activeQuestion + 1 === state.quiz.quiz.length;
}
