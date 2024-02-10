import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import AuthRequired from "./AuthRequired";
import OrderPage from "../../features/orderCheckout/OrderPage";
import Orders from "../../features/orders/Orders";
import AccountRecharge from "../../features/accountRecharge/AccountRecharge";
import AdminPanel from "../../features/adminPanel/AdminPanel";
import Profile from "../../features/profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AuthRequired />,
        children: [
          { path: "skladanie-zamowienia", element: <OrderPage /> },
          { path: "historia-zamowien", element: <Orders/> },
          { path: "profil", element: <Profile/> },
          { path: "doladowanie-konta", element: <AccountRecharge/> },
        
        ],
      },
     
      { path: "", element: <HomePage /> },
      { path: "katalog", element: <Catalog /> },
      { path: "katalog/:id", element: <ProductDetails /> },
      { path: "koszyk", element: <BasketPage /> },
      { path: "logowanie", element: <Login /> },
      { path: "rejestracja", element: <Register /> },
      { path: "blad-serwera", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },              
            
     
      // {
      //   element: <AuthRequired role={['Admin']} />, children: [
      //       { path: '/adminPanel', element: <AdminPanel /> },
      //   ]
      // },      
    ],
  },
]);
