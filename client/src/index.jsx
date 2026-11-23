import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import staticDemoAdapter from "./demo/staticDemoAdapter";

if (import.meta.env.STATIC_DEMO) {
  axios.defaults.adapter = staticDemoAdapter;
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
