import React from 'react'
import { Grid, Form, Button, Message, Icon, Header } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import {BACKEND_URL} from '../../config'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {err: "", msg: "", redirect: localStorage['token']?true:false};
    this.email = "";
    this.pwd = "";
  }

  render() {
    if(this.state.redirect) return <Redirect to="/redirect" />;

    return (
      <Grid textAlign="center" style={{marginTop: "2vh"}}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as='h2' icon textAlign='center'>
            <Icon name='user circle' />
            <Header.Content>Login</Header.Content>
          </Header>
          <Form
          onSubmit={e => {
          e.preventDefault();
          fetch(BACKEND_URL+"/auth/login", {
            method: "POST",
            body: JSON.stringify({email: this.email, pwd: this.pwd}),
            headers: {'content-type': "application/json"}
          })
          .then(res => {
            if(res.status !== 200){
              res.text()
              .then(text => {
                console.error(text);
                this.setState(state => {
                  state.err = text;
                  return state;
                });
              })
            }
            else {
              return res.json();
            }
          })
          .then(data => {
            localStorage['token'] = data.token;
            localStorage['name'] = data.name;
            localStorage['email'] = data.email;
            localStorage['sigPubKey'] = data.sigPubKey;
            window.setTimeout((() => {
              this.setState(state => {
                state.redirect = true;
                return state;
              });
            }), 1000);
            this.setState(state => {
              state.err = "";
              state.msg = `Welcome back, ${data.name}! Redirect to homepage in 1 second.`;
              return state;
            })
          })
          .catch(err => {
            console.error(err);
          })
          }}
        >
          <Form.Input icon='user' iconPosition='left' type="email" placeholder="Your email" required={true} id="userEmail" onChange={e => {this.email = e.target.value }} />
          <Form.Input icon='lock' iconPosition='left' type="password" placeholder="Your password" required={true} id="userPassword" onChange={e => {this.pwd = e.target.value }} />
          <Button type='submit'>Login</Button>
          {this.state.err
            ?
            <Message negative>{this.state.err}</Message>
            :
            null
          }
          {this.state.msg
            ?
            <Message positive>{this.state.msg}</Message>
            :
            null
          }
        </Form>
        </Grid.Column>
      </Grid>
    )
    
  }
}

export default LoginForm;