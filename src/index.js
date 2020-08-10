import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Nota from './pages/Nota';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div className="container">
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Nota</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav> */}

        {/* Make sure to put the most matching at the bottom as it will be executed otherwise. E.g "/" should be at the bottom most. 
                    Otherwise, try to use exact instead */}
        <Switch>
          <Route exact path="/">
            <Nota />
          </Route>
          <Route path="/about">
            hmm
                    </Route>
        </Switch>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
