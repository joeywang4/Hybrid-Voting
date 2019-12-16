import React from 'react'
import { Link } from 'react-router-dom'
import {
    Nav,
    NavItem
} from 'reactstrap'
import classes from './Auth.module.css'

const notLoggedIn = (
  <Nav className="ml-auto" navbar>
    <NavItem className={classes.item}>
        <Link to="/login">Login</Link>
    </NavItem>
    <NavItem className={classes.item}>
        <Link to="/register">Register</Link>
    </NavItem>
  </Nav>
);

const logout = (
  <Link to="/redirect" onClick={() => {
    if(localStorage['token']) localStorage.removeItem('token');
    if(localStorage['name']) localStorage.removeItem('name');
    if(localStorage['email']) localStorage.removeItem('email');
    if(localStorage['sigPubKey']) localStorage.removeItem('sigPubKey');
    if(localStorage['sigPrivKey']) localStorage.removeItem('sigPrivKey');
  }}>
    Logout
  </Link>
)

const loggedIn = () => {
  return (
    <Nav className="ml-auto" navbar>
      {
        [
          {"name": "Elections", "link": "elections"},
          {"name": "Users", "link": "users"}
        ].map(items => {
          return (
            <NavItem className={classes.item} key={items.link}>
              <Link className={classes.features} to={`/${items.link}`}>{items.name}</Link>
            </NavItem>
          )
        })
      }
      <NavItem className={classes.item}>
          Hello, <Link to={`/user`}>{localStorage['name']}</Link>
      </NavItem>
      <NavItem className={classes.item}>
        {logout}
      </NavItem>
    </Nav>
  )
}

const Auth = () => {
  return(
    <React.Fragment>
      {
        localStorage['token']
        ?
          loggedIn()
        :
          notLoggedIn
      }
    </React.Fragment>
  )
}

export default Auth