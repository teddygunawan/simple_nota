import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/js/all.js';
import './index.scss';
import Nota from './pages/Nota';
import Product from './pages/Product';
import brand from "./assets/brand.png";
import * as serviceWorker from './serviceWorker';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src={brand} alt="Brand" />
          </Link>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Nota
            </Link>
            <Link className="navbar-item" to="/products">
              Products
            </Link>
          </div>
        </div>
      </nav>
      <div className="container mt-5">

        {/* Make sure to put the most matching at the bottom as it will be executed otherwise. E.g "/" should be at the bottom most. 
                    Otherwise, try to use exact instead */}
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
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
