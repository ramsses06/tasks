import React, { Fragment, Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Graphic from './pages/Graphic';
import Tasks from './pages/Tasks';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './global.css';

class App extends Component {
  render () {
    return (
      <Fragment>
        <Switch>
          {/* Mis rutas */}
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/tasks' component={Tasks} />
          <Route exact path='/graphic' component={Graphic} />
          <Route>
            <div>
              <h1>UPS!! Ô_Ô</h1>
            </div>
          </Route>
        </Switch>
      </Fragment>
    );
  }
}

export default App;
