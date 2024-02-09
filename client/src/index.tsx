import React from "react";
import ReactDOM from "react-dom/client";
import "../src/app/layout/styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { router } from "./app/router/Router.tsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { reduxStore } from "./app/redux/configureStore.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode> 
      <Provider store={reduxStore}>
        <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
);
