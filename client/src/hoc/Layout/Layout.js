import React, { useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Layout.module.css";
import MenuToggle from "../../components/Navigation/MenuToggle/MenuToggle";
import Drawer from "../../components/Navigation/Drawer/Drawer";

const Layout = props => {
  const [menu, setMenu] = useState(false);
  const isAuthenticated = useSelector(state => !!state.auth.token);
  const toggleMenuHandler = () => {
    setMenu(!menu);
  };

  const menuCloseHandler = () => {
    setMenu(false);
  };

  return (
    <div className={classes.Layout}>
      <Drawer
        isOpen={menu}
        onClose={menuCloseHandler}
        isAuthenticated={isAuthenticated}
      />
      <MenuToggle onToggle={toggleMenuHandler} isOpen={menu} />
      <main>{props.children}</main>
    </div>
  );
};
export default Layout;
