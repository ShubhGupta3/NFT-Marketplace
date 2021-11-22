
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/header'
import Create from './pages/create_item'
import Assets from './pages/assets'
import Dashboard from './pages/creator_db'


ReactDOM.render(
  <React.StrictMode>
       <Router>
      <Header/>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/home" component={App} />
        <Route path="/create" component={Create} />
        <Route path="/assets" component={Assets} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);