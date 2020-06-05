import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import classes from "./MyQuiz.module.css";
import Loader from "../../components/UI/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyQuizes, deleteQuizById } from "../../store/actions/quiz";
import Button from "../../components/UI/Button/Button";

const MyQuiz = props => {
  const { myquizes, loading } = useSelector(state => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyQuizes());
  }, [dispatch]);

  const deleteQuiz = ({ id }) => {
    dispatch(deleteQuizById(id));
  };

  const renderQuizes = () => {
    return myquizes.map(quiz => {
      return (
        <li key={quiz.id}>
          <p>{quiz.name}</p>
          <p>{quiz.quizTitle}</p>
          <p>
            <Button type="error" onClick={() => deleteQuiz(quiz)}>
              Удалить
            </Button>
            <NavLink to={"/editquiz/" + quiz.id}>
              <Button type="success">Редактировать</Button>
            </NavLink>
          </p>
        </li>
      );
    });
  };

  return (
    <div className={classes.MyQuiz}>
      <div>
        <h1>Мои тесты</h1>
        {loading ? (
          <Loader />
        ) : myquizes.length !== 0 ? (
          <ul>{renderQuizes()}</ul>
        ) : (
          <h2>Вы пока не создали свои тесты</h2>
        )}
      </div>
    </div>
  );
};

export default MyQuiz;
