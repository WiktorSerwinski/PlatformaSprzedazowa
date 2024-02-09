import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/configureStore";

export default function AuthRequired() {
  const { user } = useAppSelector((state) => state.account);

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }}></Navigate>;
  }
  return <Outlet />;
}
