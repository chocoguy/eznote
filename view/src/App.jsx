import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Taskbar from './basedcomponents/Taskbar';
import Landing from './components/Landing';
import Login from './basedcomponents/Login';
import Register from './basedcomponents/Register'
import Help from './components/Help';
import Notes from './basedcomponents/Notes';
import Create from './basedcomponents/Create';
import Edit from './basedcomponents/Edit';
import Main from './components/Main';



const App = () => {
  return (
    <Provider store = {store}>
      <Router>
        <div className="container-div">
        <Route exact path="/" component = { Main } />
        </div>
      </Router>
    </Provider>
  )
}

export default App
