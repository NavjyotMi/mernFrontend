import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/app.scss";
import { Provider } from "react-redux";
// import { Store } from "@reduxjs/toolkit";
import { store } from "./redux/Store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
