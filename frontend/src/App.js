import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './container/navbar';
import Home from './container/home';
import Login from './container/navbar/Login';
import Register from './container/navbar/Register';
import Users from './container/users';
import Me from './container/users/me';
import User from './container/users/user';
//import Resources from './container/rsrc';
//import CreateChallenge from './component/CreateChallenge';
//import Challenges from './container/challenges';
//import Challenge from './container/challenges/Challenge';
import {BACKEND_URL} from './const_val';
import './App.css';

const checkToken = () => {
  fetch(BACKEND_URL+"/user", {
    method: "GET",
    headers: new Headers({
      'authorization': localStorage['token']
    })
  })
  .then(res => {
    if(res.status === 401) {
      console.log("Token expired");
      localStorage.removeItem('token');
      if(localStorage['name']) localStorage.removeItem('name');
      if(localStorage['email']) localStorage.removeItem('email');
      if(localStorage['sigPubKey']) localStorage.removeItem('email');
      if(localStorage['sigPrivKey']) localStorage.removeItem('sigPrivKey');
      this.forceUpdate();
    }
    else if(res.status === 200 && (!localStorage['name'] || !localStorage['email'] || !localStorage['sigPubKey'])) {
      res.json()
      .then(data => {
        localStorage['name'] = data.name;
        localStorage['email'] = data.email;
        localStorage['sigPubKey'] = data.sigPubKey
      })
    }
  })
  .catch(err => {console.error(err)});
}

class App extends React.Component {
  constructor(props) {
    super(props);
    if(localStorage['token']) {
      // Check token validation
      checkToken();
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="main">
            <Switch>
              <Route exact path="/"><Home /></Route>
              {/*<Route exact path="/resources"><Resources /></Route>*/}
              <Route exact path="/users"><Users /></Route>
              <Route exact path="/user">
                {({ location }) => {
                  const _id = location.search.substr(4);
                  if(_id === "") return <Me />;
                  else return <User id={_id} />;
                }}
              </Route>
              <Route exact path="/login"><Login /></Route>
              <Route exact path="/register"><Register /></Route>
              {/*<Route exact path="/newChallenge"><CreateChallenge /></Route>*/}
              {/*<Route exact path="/challenges"><Challenges /></Route>*/}
              {/*<Route exact path="/challenge">
                {({ location }) => {
                  const _id = location.search.substr(4);
                  return <Challenge id={_id} />;
                }}
              </Route>*/}
              <Route path="/redirect/:name">
                {({ match }) => {
                  this.forceUpdate();
                  return <Redirect to={"/" + match.params.name} />;
                }}
              </Route>
              <Route path="/redirect">{() => {
                this.forceUpdate();
                return <Redirect to="/" />;
              }}</Route>
              <Route path="/:unknown">
                {({ match }) => {
                  return <strong>{`${match.params.unknown} Not Found!`}</strong>;
                }}
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
