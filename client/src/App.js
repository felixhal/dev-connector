import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing, { landing } from './components/layout/Landing';

const App = () => (
  <Router>
    <Fragment>
      <NavBar />
      <Route exact path='/' component={Landing} />
      <section className='container'>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
