import { Outlet } from "react-router";
import AppNavbar from "../components/AppNavbar";
import "../App.css";

function AdminLayout() {
  return (
    <div className="app-wrapper admin-wrapper">
      <AppNavbar mode="admin" />
      <Outlet />
    </div>
  );
}

export default AdminLayout;