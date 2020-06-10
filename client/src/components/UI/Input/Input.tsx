import React from "react";
import classes from "./Input.module.css";

interface IValid {
  valid: boolean
  touched: boolean
  shouldValidate: boolean
}

function isInvalid({ valid, touched, shouldValidate }: IValid ): boolean {
  return !valid && shouldValidate && touched;
}

interface IProps {
  type?: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  errorMessage: string
  valid: boolean
  touched: boolean
  shouldValidate: boolean
}

const Input: React.FC<IProps> = props => {
  const inputType: string = props.type || "text";
  const cls: string[] = [classes.Input];
  const htmlFor: string = `${inputType}-${Math.random()}`;

  if (isInvalid(props)) {
    cls.push(classes.invalid);
  }
  return (
    <div className={cls.join(" ")}>
      <label htmlFor={htmlFor}>{props.label}</label>
      <input
        type={inputType}
        id={htmlFor}
        value={props.value}
        onChange={props.onChange}
      />
      {isInvalid(props) ? (
        <span>{props.errorMessage || "Введите верное значение"}</span>
      ) : null}
    </div>
  );
};

export default Input;
