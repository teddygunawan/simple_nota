import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { isPrintingReducer, productCartReducer } from "./store/reducers"
import "@fortawesome/fontawesome-free/js/all.js"
import "./index.scss"
import Nota from "./pages/Nota"
import Product from "./pages/Product"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"

const store = configureStore({
  reducer: {
    isPrinting: isPrintingReducer,
    productCart: productCartReducer,
  },
})

function Index() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Header />
          <div className="container mt-5" id="main">
            {/* Make sure to put the most matching at the bottom as it will be executed otherwise.
                E.g "/" should be at the bottom most. Otherwise, try to use exact instead */}
            <div className="border-box">
              <Switch>
                <Route exact path="/">
                  <Nota />
                </Route>
                <Route path="/products">
                  <Product />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    </React.StrictMode>
  )
}

ReactDOM.render(<Index />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
