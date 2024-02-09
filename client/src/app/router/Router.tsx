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
import ProfilePage from "../../features/profile/ProfilePage";
import AccountRecharge from "../../features/accountRecharge/AccountRecharge";
import AdminPanel from "../../features/adminPanel/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "basket", element: <BasketPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },              
            
      {
        element: <AuthRequired />,
        children: [
          { path: "orderPage", element: <OrderPage /> },
          { path: "orders", element: <Orders/> },
          { path: "profile", element: <ProfilePage/> },
          { path: "accountRecharge", element: <AccountRecharge/> },
        
        ],
      },
      // {
      //   element: <AuthRequired role={['Admin']} />, children: [
      //       { path: '/adminPanel', element: <AdminPanel /> },
      //   ]
      // },      
    ],
  },
]);
