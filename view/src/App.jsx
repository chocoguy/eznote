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




const App = () => {
  return (
      <Router>
        <div className="container-div">
        <Route exact path="/" component={Landing} />
        <section className="section-div">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/help" component={Help} />
            <Route exact path="/notes" component={Notes} />
            <Route exact path="/createnote" component={Create} />
            <Route exact path="/editnote" component={Edit} />
          </Switch>
          <Taskbar />
        </section>
        </div>
      </Router>
  )
}

//need route to view single note
//     <Provider store = {store}>
//     </Provider>

export default App
