import React from "react";
import classes from "./AnswerItem.module.css";

interface Answer {
  _id: string
  id: number
  text: string
}



interface IProps {
  state: string | undefined | null
  onAnswerClick: Function
  answer: Answer
}

const AnswerItem: React.FC<IProps> = (props) => {
  const cls: Array<string> = [classes.AnswerItem];
  if (props.state) {
    cls.push(classes[props.state]);
  }
  return (
    <li
      className={cls.join(" ")}
      onClick={() => props.onAnswerClick(props.answer.id)}
    >
      {props.answer.text}
    </li>
  );
};

export default AnswerItem;
