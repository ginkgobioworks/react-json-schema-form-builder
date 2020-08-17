import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
ReactDOM.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement("head", null, /*#__PURE__*/React.createElement("link", {
  rel: "stylesheet",
  href: "https://use.fontawesome.com/releases/v5.11.2/css/all.css"
}), /*#__PURE__*/React.createElement("link", {
  rel: "stylesheet",
  href: "https://use.fontawesome.com/releases/v5.11.2/css/v4-shims.css"
})), /*#__PURE__*/React.createElement(App, null)), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();