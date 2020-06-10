import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { logout } from "../../store/actions/auth";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Redirect to={"/"} />;
};

export default Logout;
