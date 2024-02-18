import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/configureReduxStore";
import { toast } from "react-toastify";

interface Props{
  roles?: string[]| undefined;
}


export default function AuthRequired({roles}:Props) {
  const { user } = useAppSelector((state) => state.account);

  const location = useLocation();

  if (!user) {
    return <Navigate to="/logowanie" state={{ from: location }}></Navigate>;
  }
  if (roles && user && !roles.some(role => user.roles?.includes(role))) 
  {
    toast.error("Nie masz odpowiednich uprawnień");
    return <Navigate to='/katalog'/>;
  }
  return <Outlet />;
}
