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
import Profile from "../../features/profile/Profile";
import AdminCatalog from "../../features/adminPanel/AdminCatalog";
import CreateRechargeCode from "../../features/adminPanel/CreateRechargeCode";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
      {
        element: <AuthRequired />,
        children: [
          { path: "skladanie-zamowienia", element: <OrderPage /> },
          { path: "historia-zamowien", element: <Orders /> },
          { path: "profil", element: <Profile /> },
          { path: "doladowanie-konta", element: <AccountRecharge /> },
        ],
      },
      {
        element: <AuthRequired roles={["Admin"]} />,
        children: [
          { path: "edycja-katalogu", element: <AdminCatalog /> },
          { path: "tworzenie-kodu-doładowania", element: <CreateRechargeCode /> },
          { path: "potwierdzanie-zamówień", element:  <Orders/> },
        ],
      },
      { path: "", element: <HomePage/> },
      { path: "katalog", element: <Catalog /> },
      { path: "katalog/:id", element: <ProductDetails /> },
      { path: "koszyk", element: <BasketPage /> },
      { path: "logowanie", element: <Login /> },
      { path: "rejestracja", element: <Register /> },
      { path: "blad-serwera", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },

      
    ],
  },
]);
