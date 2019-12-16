import React from 'react'
import { Grid, Form, Button, Message, Icon, Header } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import {BACKEND_URL} from '../../const_val';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: "",
      msg: "",
      sigPubKey: "",
      sigPrivKey: "",
      file: "",
      uploadBusy: false,
      genBusy: false,
      redirect: false
    }
    this.name = "";
    this.email = "";
    this.pwd = "";
    this.sigPubKey = "";
    this.sigPrivKey = "";
    this.fileInputRef = React.createRef();
  }

  genKey = () => {
    this.setState(state => {
      if(state.sigPubKey !== this.sigPubKey) state.sigPubKey = this.sigPubKey;
      if(state.sigPrivKey !== this.sigPrivKey) state.sigPrivKey = this.sigPrivKey;
      state.file = "{\"sigPubKey\": \"" + this.sigPubKey + "\", \"sigPrivKey\": \"" + this.sigPrivKey + "\"}";
      return state;
    })
  }

  keyUploaded = () => {
    console.log("Hi");
    const file = this.fileInputRef.current.files[0];
    const reader = new FileReader();
    this.setState(state => {
      state.uploadBusy = true;
      return state;
    })
    reader.onload = e => {
      const loaded = JSON.parse(e.target.result);
      this.setState(state => {
        state.uploadBusy = false;
        if("sigPubKey" in loaded) {
          state.sigPubKey = loaded['sigPubKey'];
          this.sigPubKey = loaded['sigPubKey'];
        }
        if("sigPrivKey" in loaded) {
          state.sigPrivKey = loaded['sigPrivKey'];
          this.sigPrivKey = loaded['sigPrivKey'];
        }
        return state;
      })
    }
    reader.onerror = e => {
      alert("You uploaded an invalid file");
    }
    reader.readAsText(file);
  }

  render() {
    if(this.state.redirect) return <Redirect to="/login" />;
    if(localStorage['token']) return <Redirect to="/redirect" />;
    

    return (
      <Grid textAlign="center" style={{marginTop: "2vh"}}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as='h2' icon textAlign='center'>
            <Icon name='user plus' circular />
            <Header.Content>Register</Header.Content>
          </Header>
          <Form
            onSubmit={e => {
              e.preventDefault();
              console.log(this.email, this.pwd, this.name);
              fetch(BACKEND_URL+"/auth/register", {
                method: "POST",
                body: JSON.stringify({name: this.name, email: this.email, pwd: this.pwd}),
                headers: {'content-type': "application/json"}
              })
              .then(res => {
                console.log(res.status);
                if(res.status === 400 || res.status === 401 || res.status === 404){
                  res.text()
                  .then(text => {
                    console.error(text);
                    this.setState(state => {
                      state.err = text;
                      return state
                    });
                  })
                }
                else if(res.status === 200) {
                  window.setTimeout((() => {
                    this.setState(state => {
                      state.redirect = true;
                      return state;
                    })
                  }), 3000);;
                  this.setState(state => {
                    state.msg = "Register success! Redirect in three seconds.";
                    return state
                  })
                }
              })
              .catch(err => {
                console.error(err);
              })
            }}
          >
            <Form.Field>
              <label>Name</label>
              <Form.Input type="text" required={true} id="userName" onChange={e => { this.name = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <Form.Input type="email" required={true} id="userEmail" onChange={e => { this.email = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <Form.Input type="password" required={true} id="userPassword" onChange={e => { this.pwd = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Signature Public Key</label>
              <Form.Input type="textarea" required={true} id="sigPubKey" placeholder="Base64 encoded public key" value={this.state.sigPubKey} onChange={e => { this.sigPubKey = e.target.value; this.genKey(); }} />
            </Form.Field>
            <Form.Field>
              <label>Signature Private Key</label>
              <Form.Input type="textarea" required={true} id="sigPrivKey" placeholder="Base64 encoded private key" value={this.state.sigPrivKey} onChange={e => { this.sigPrivKey = e.target.value; this.genKey(); }} />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Button loading={this.state.genBusy}>Generate Key</Form.Button>
              <Form.Button
                content="Upload Key"
                loading={this.state.uploadBusy}
                onClick={() => this.fileInputRef.current.click()}
              />
              <input
                ref={this.fileInputRef}
                type="file"
                accept=".json"
                hidden
                onInput={this.keyUploaded}
              />
              <Form.Button>
                <a href={"data:text/plain,"+this.state.file} download="key.json" style={{textDecoration: "None"}} >
                  Download Key
                </a>
              </Form.Button>
            </Form.Group>
            <Button color="green" type="submit">
              Register
            </Button>
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
    );
  }
}

export default RegisterForm;