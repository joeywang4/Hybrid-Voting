import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './container/navbar';
import Home from './container/home';
import Login from './container/navbar/Login';
import Register from './container/navbar/Register';
import Users from './container/users';
import Me from './container/users/me';
import User from './container/users/user';
import Elections from './container/elections';
import Election from './container/elections/Election';
import CreateElection from './container/elections/CreateElection';
import TestCreateElection from './container/tests/testCreateElection';
import {BACKEND_URL, CLIENT_URL} from './config';
import './App.css';

function timedFetch (url, options, timeout = 7000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    )
  ]);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    if(localStorage['token']) {
      // Check token validation
      this.checkToken();
    }
    this.state = {
      hasClient: false
    }
    this.checkClient();
  }

  checkToken = () => {
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
        if(localStorage['sigPubKey']) localStorage.removeItem('sigPubKey');
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

  checkClient = () => {
    timedFetch(CLIENT_URL+"/", undefined, 1000)
    .then(res => {
      if(res.status === 200) {
        console.log("[Client Connected]")
        this.setState(state => {
          state.hasClient = true;
          return state;
        })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="main">
            <Switch>
              <Route exact path="/"><Home /></Route>
              <Route exact path="/users"><Users /></Route>
              <Route exact path="/user">
                {({ location }) => {
                  const _id = location.search.substr(4);
                  if(_id === "") return <Me />;
                  else return <User id={_id} />;
                }}
              </Route>
              <Route exact path="/login"><Login /></Route>
              <Route exact path="/register"><Register hasClient={this.state.hasClient} /></Route>
              <Route exact path="/elections"><Elections /></Route>
              <Route exact path="/election">
                {({ location }) => {
                  const address = location.search.substring(9);
                  return <Election hasClient={this.state.hasClient} address={address} />;
                }}
              </Route>
              <Route exact path="/create-election"><CreateElection hasClient={this.state.hasClient} /></Route>
              <Route exact path="/test-create-election"><TestCreateElection hasClient={this.state.hasClient} /></Route>
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
