import { Notifications } from "@mantine/notifications";
import { Outlet } from "react-router";
import c from "./layout.module.scss";

export const Layout = () => {
  return (
    <div className={c.layout}>
      <Notifications />
      <Outlet />
    </div>
  );
};
