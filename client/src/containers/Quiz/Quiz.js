import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./Quiz.module.css";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import {
  fetchQuizById,
  quizAnswerClick,
  retryQuiz
} from "../../store/actions/quiz";

const Quiz = props => {
  const dispatch = useDispatch();

  const {
    results,
    isFinished,
    activeQuestion,
    answerState,
    quiz,
    loading
  } = useSelector(state => state.quiz);
  const dispatchFetchQuizById = useCallback(id => dispatch(fetchQuizById(id)), [
    dispatch
  ]);
  const dispatchQuizAnswerClick = answerId =>
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
