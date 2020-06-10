import React from "react";
import classes from "./ActiveQuiz.module.css";
import AnswersList from "./AnswersList/AnswersList";


interface Answer {
  _id: string;
  id: number;
  text: string;
}

interface IState {
  [key: number]: string | undefined | null;
}

interface IProps {
  answerNumber: number
  state: IState
  quizLength: number
  question: string
  onAnswerClick: Function
  answers: Array<Answer>
}

const ActiveQuiz: React.FC<IProps> = props => {
  return (
  <div className={classes.ActiveQuiz}>
    <p className={classes.Question}>
      <span>
        <strong>{props.answerNumber}.</strong>&nbsp;
        {props.question}
      </span>
      <small>
        {props.answerNumber} из {props.quizLength}
      </small>
    </p>
    <AnswersList
      state={props.state}
      answers={props.answers}
      onAnswerClick={props.onAnswerClick}
    />
  </div>
)};

export default ActiveQuiz;
