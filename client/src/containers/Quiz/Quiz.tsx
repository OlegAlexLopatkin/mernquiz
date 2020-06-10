import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook  } from "react-redux";
import {RouteComponentProps} from "react-router-dom";
import classes from "./Quiz.module.css";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import {
  fetchQuizById,
  quizAnswerClick,
  retryQuiz
} from "../../store/actions/quiz";

interface IAnswerState {
  [answerId: string]: "error" | "success"
}

type IResult = {
  [answerId: string]: "error" | "success"
}

type State = {
  auth: {
    token: null | string
    userId: string
  }
  quiz: IStateQuiz
};

interface IStateQuiz {
  quizes: IQuize[],
  loading: boolean,
  error: null | Error,
  results: IResult,
  isFinished: boolean,
  activeQuestion: number,
  answerState: {[key: string]: string} ,
  quiz: {
    quiz: IDatabaseQuiz[]
    quizTitle: string
    userId: string
    _id: string
    __v: number
  }
  myquizes: IQuize[]
}

type IAnswer = {
  _id: string
  id: number
  text: string
}

interface IDatabaseQuiz {
  id: number
  question: string
  rightAnswerId: number
  _id: string
  answers: IAnswer[]
}


interface IQuize {
  id: string;
  name: string;
  quizTitle: string;
}





const useTypedSelector: TypedUseSelectorHook<State> = useSelector


// type TParams =  { id: string };
// interface IProps {
//   match: RouteComponentProps<TParams>
// }


interface IProps {
  match: {
    params: {
      id: string
    }
  }
}
const Quiz: React.FC<IProps> = props => {
  const dispatch = useDispatch();

  const {
    results,
    isFinished,
    activeQuestion,
    answerState,
    quiz,
    loading
  } = useTypedSelector(state => state.quiz);
  const dispatchFetchQuizById = useCallback(id => dispatch(fetchQuizById(id)), [
    dispatch
  ]);
  const dispatchQuizAnswerClick = (answerId: number) =>
    dispatch(quizAnswerClick(answerId));
  const dispatchRetryQuiz = useCallback(() => dispatch(retryQuiz()), [
    dispatch
  ]);

  useEffect(() => {
    dispatchFetchQuizById(props.match.params.id);
    return dispatchRetryQuiz;
  }, [dispatchFetchQuizById, dispatchRetryQuiz, props.match.params.id]);

  return (
    <div className={classes.Quiz}>
      <div className={classes.QuizWrapper}>
        <h1>Ответьте на все вопросы</h1>
        {loading || !quiz ? (
          <Loader />
        ) : isFinished ? (
          <FinishedQuiz
            results={results}
            quiz={quiz.quiz}
            onRetry={dispatchRetryQuiz}
          />
        ) : (
          <ActiveQuiz
            answers={quiz.quiz[activeQuestion].answers}
            question={quiz.quiz[activeQuestion].question}
            onAnswerClick={dispatchQuizAnswerClick}
            quizLength={quiz.quiz.length}
            answerNumber={activeQuestion + 1}
            state={answerState}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;
