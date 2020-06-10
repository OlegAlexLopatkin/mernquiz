import React from "react";
import classes from "./Select.module.css";

interface IOption {
  value: string
  text: string
}

interface IProps {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<IOption>
}

const Select: React.FC<IProps> = props => {
  const htmlFor = `${props.label}-${Math.random()}`;
  return (
    <div className={classes.Select}>
      <label htmlFor={htmlFor}>{props.label}</label>
      <select id={htmlFor} value={props.value} onChange={props.onChange}>
        {props.options.map((option, index) => {
          return (
            <option value={option.value} key={option.value + index}>
              {option.text}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
