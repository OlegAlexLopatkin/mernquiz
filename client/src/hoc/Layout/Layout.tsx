import React, { useState } from "react";
import { useSelector, TypedUseSelectorHook  } from "react-redux";
import classes from "./Layout.module.css";
import MenuToggle from "../../components/Navigation/MenuToggle/MenuToggle";
import Drawer from "../../components/Navigation/Drawer/Drawer";

type IProps = {
  children: React.ReactElement<any, any> | null
}

type IState = {
  auth: {
    token: string
  }
}
const useTypedSelector: TypedUseSelectorHook<IState> = useSelector


const Layout: React.FC<IProps> = (props) => {

  const [menu, setMenu] = useState<boolean>(false);
  const isAuthenticated = useTypedSelector(state => !!state.auth.token);
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
