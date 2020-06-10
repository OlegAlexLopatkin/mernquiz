import React from "react";
import classes from "./Button.module.css";

interface IProps {
  onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined
  disabled?: boolean
  children: string
  type: string
}

const Button: React.FC<IProps> = props => {
  const cls = [classes.Button, classes[props.type]];
  return (
    <button
      onClick={props.onClick}
      className={cls.join(" ")}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
