import React from "react";
import classes from "./AnswersList.module.css";
import AnswerItem from "./AnswerItem/AnswerItem";

interface Answer {
  _id: string;
  id: number;
  text: string;
}

interface IState {
  [key: number]: string | undefined | null;
}
interface IProps {
  state: IState;
  answers: Array<Answer>;
  onAnswerClick: Function;
}

const AnswersList: React.FC<IProps> = (props) => (
  <ul className={classes.AnswersList}>
    {props.answers.map((answer, index) => {
      return (
        <AnswerItem
          answer={answer}
          key={index}
          onAnswerClick={props.onAnswerClick}
          state={props.state ? props.state[answer.id] : null}
        />
      );
    })}
  </ul>
);

export default AnswersList;
