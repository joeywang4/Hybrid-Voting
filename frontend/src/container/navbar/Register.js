import React from 'react'
import { Grid, Form, Button, Message, Icon, Header, TextArea } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import {BACKEND_URL, CLIENT_URL, NO_CLIENT_URL} from '../../config';

const [IDLE, BUSY, ERROR] = [0, 1, 2]

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
      genState: IDLE,
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
      state.genState = BUSY;
      return state;
    })
    fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/genSigKey")
    .then(res => {
      if(res.status === 200) {
        res.json()
        .then(data => {
          if("sigPubKey" in data) this.sigPubKey = data['sigPubKey'];
          if("sigPrivKey" in data) this.sigPrivKey = data['sigPrivKey'];
          this.updateKey();
          this.setState(state => {
            state.genState = IDLE;
            return state;
          })
        })
      }
      else {
        this.setState(state => {
          state.genState = ERROR;
          return state;
        })
      }
    })
    .catch(err => {
      console.log("Generate Keypair Error", err);
      this.setState(state => {
        state.genState = ERROR;
        return state;
      })
    })
  }

  updateKey = () => {
    this.setState(state => {
      if(state.sigPubKey !== this.sigPubKey) state.sigPubKey = this.sigPubKey;
      if(state.sigPrivKey !== this.sigPrivKey) state.sigPrivKey = this.sigPrivKey;
      state.file = "{\"sigPubKey\": \"" + this.sigPubKey + "\", \"sigPrivKey\": \"" + this.sigPrivKey + "\"}";
      return state;
    })
  }

  loadKey = data => {
    const loaded = JSON.parse(data);
      if("sigPubKey" in loaded) {
        this.sigPubKey = loaded['sigPubKey'];
      }
      if("sigPrivKey" in loaded) {
        this.sigPrivKey = loaded['sigPrivKey'];
      }
      this.updateKey();
      this.setState(state => {
        state.uploadBusy = false;
        return state;
      })
  }

  keyUploaded = () => {
    const file = this.fileInputRef.current.files[0];
    const reader = new FileReader();
    this.setState(state => {
      state.uploadBusy = true;
      return state;
    })
    reader.onload = e => {
      this.loadKey(e.target.result);
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
            <Icon name='user plus'/>
            <Header.Content>Register</Header.Content>
          </Header>
          <Form
            onSubmit={e => {
              e.preventDefault();
              fetch(BACKEND_URL+"/auth/register", {
                method: "POST",
                body: JSON.stringify({name: this.name, email: this.email, pwd: this.pwd, sigPubKey: this.sigPubKey}),
                headers: {'content-type': "application/json"}
              })
              .then(res => {
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
                  }), 3000);
                  localStorage["sigPrivKey"] = this.sigPrivKey;
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
              <Form.Input icon='user' iconPosition='left' placeholder="Name" type="text" required={true} id="userName" onChange={e => { this.name = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <Form.Input icon='mail' iconPosition='left' placeholder="Email" type="email" required={true} id="userEmail" onChange={e => { this.email = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <Form.Input icon='lock' iconPosition='left' placeholder="Password" type="password" required={true} id="userPassword" onChange={e => { this.pwd = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Signature Public Key</label>
              <Form.Input type="textarea" required={true} control={TextArea} id="sigPubKey" placeholder="Base64 encoded public key" value={this.state.sigPubKey} onChange={e => { this.sigPubKey = e.target.value; this.updateKey(); }} />
            </Form.Field>
            <Form.Field>
              <label>Signature Private Key</label>
              <Form.Input type="textarea" required={true} control={TextArea} id="sigPrivKey" placeholder="Base64 encoded private key" value={this.state.sigPrivKey} onChange={e => { this.sigPrivKey = e.target.value; this.updateKey(); }} />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Button type="button" loading={this.state.genState === BUSY} onClick={this.genKey}>Generate Key</Form.Button>
              <Form.Button
                content="Upload Key"
                loading={this.state.uploadBusy}
                type="button"
                onClick={() => this.fileInputRef.current.click()}
              />
              <input
                ref={this.fileInputRef}
                type="file"
                accept=".json"
                hidden
                onInput={this.keyUploaded}
              />
              <Form.Button type="button">
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