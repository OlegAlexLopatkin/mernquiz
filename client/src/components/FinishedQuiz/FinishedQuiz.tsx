import React from "react";
import classes from "./FinishedQuiz.module.css";
import Button from "../UI/Button/Button";
import { Link } from "react-router-dom";

interface Answer {
  _id: string
  id: number
  text: string
}

interface IQuiz {
  _id: string
  id: number
  question: string
  rightAnswerId: number
  answers: Answer[]
}
interface IProps {
  results: {
    [key: string]: string
  }
  quiz: Array<IQuiz>
  onRetry: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined
  disabled?: boolean
}

const FinishedQuiz: React.FC<IProps> = props => {
  const successCount = Object.keys(props.results).reduce((total, key) => {
    if (props.results[key] === "success") {
      total++;
    }
    return total;
  }, 0);
  return (
    <div className={classes.FinishedQuiz}>
      <ul>
        {props.quiz.map((quizItem, index) => {
          const cls = [
            "fa",
            props.results[quizItem.id] === "error" ? "fa-times" : "fa-check",
            classes[props.results[quizItem.id]]
          ];
          return (
            <li key={index}>
              <strong>{index + 1}</strong>.&nbsp;
              {quizItem.question}
              <i className={cls.join(" ")} />
            </li>
          );
        })}
      </ul>
      <p>
        Правильно {successCount} из {props.quiz.length}
      </p>
      <div className={classes.ButtonsLine}>
        <Button onClick={props.onRetry} type="primary">
          Повторить
        </Button>
        <Link to="/">
          <Button type="success">Перейти в список тестов</Button>
        </Link>
      </div>
    </div>
  );
};

export default FinishedQuiz;
