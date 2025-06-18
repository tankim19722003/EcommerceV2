// components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const UserRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const ShopRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const user = useSelector((state) => state.user.user);

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/shop-page"} replace />;
  }

  return <Outlet />;
};