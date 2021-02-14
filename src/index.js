import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import reducers from "./components/reducers";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
