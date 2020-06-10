import React from "react";
import classes from "./Backdrop.module.css";

interface IProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Backdrop: React.FC<IProps> = props => (
  <div className={classes.Backdrop} onClick={props.onClick} />
);

export default Backdrop;

