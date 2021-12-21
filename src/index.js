import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import "./globalStyle.less";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense
        fallback={
          <div className="center-alignment">
            <p>Loading</p>
          </div>
        }
      >
        <Routes />
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
