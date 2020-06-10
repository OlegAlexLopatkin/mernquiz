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
} from "../actions/actionType";

type IResult = {
  [answerId: string]: "error" | "success";
};

type IAnswer = {
  _id: string;
  id: number;
  text: string;
};

interface IDatabaseQuiz {
  id: number;
  question: string;
  rightAnswerId: number;
  _id: string;
  answers: IAnswer[];
}

interface IQuize {
  id: string;
  name: string;
  quizTitle: string;
}

interface IQuizeDatabase {
  quiz: IDatabaseQuiz[];
  quizTitle: string;
  userId: string;
  _id: string;
  __v: number;
}

type IAction = {
  type: string;
  myquizes: IQuize[];
  quiz: IQuizeDatabase;
  quizes: IQuize[];
  error: Error;
  number: number;
  answerState: null | { [key: string]: string };
  results: IResult;
};

interface IStateQuiz {
  quizes: IQuize[];
  loading: boolean;
  error: Error | null;
  results: IResult;
  isFinished: boolean;
  activeQuestion: number;
  answerState: null | { [key: string]: string };
  quiz: IQuizeDatabase | null;
  myquizes: IQuize[];
}

const initialState: IStateQuiz = {
  quizes: [],
  loading: false,
  error: null,
  results: {},
  isFinished: false,
  activeQuestion: 0,
  answerState: null,
  quiz: null,
  myquizes: [],
};

export default function quizReducer(
  state: IStateQuiz = initialState,
  action: IAction
): IStateQuiz {
  switch (action.type) {
    case FETCH_QUIZES_START:
      return {
        ...state,
        loading: true,
      };

    case FETCH_QUIZES_SUCCESS:
      return {
        ...state,
        loading: false,
        quizes: action.quizes,
      };

    case FETCH_MY_QUIZES_SUCCESS:
      return {
        ...state,
        loading: false,
        myquizes: action.myquizes,
      };

    case FETCH_QUIZES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case FETCH_QUIZ_SUCCESS:
      return {
        ...state,
        loading: false,
        quiz: action.quiz,
      };

    case QUIZ_SET_STATE:
      return {
        ...state,
        answerState: action.answerState,
        results: action.results,
      };
    case FINISH_QUIZ:
      return {
        ...state,
        isFinished: true,
      };

    case QUIZ_NEXT_QUESTION:
      return {
        ...state,
        answerState: null,
        activeQuestion: action.number,
      };
    case QUIZ_RETRY:
      return {
        ...state,
        isFinished: false,
        activeQuestion: 0,
        answerState: null,
        results: {},
      };

    default:
      return state;
  }
}
