import React from 'react'
import { Header, Icon, Divider, Grid, Form, Message } from 'semantic-ui-react'
import {BACKEND_URL} from '../const_val';

const [FAILED, SUCCESS, WAIT] = [0, 1, 2];

class CreateChallenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: WAIT
    }
    this.name = "";
    this.description = "";
    this.flag = "";
    this.score = "";
  }

  onInputChange = e => {
    this.setState({status: WAIT});
    if(e.target.id === "name") this.name = e.target.value;
    else if(e.target.id === "description") this.description = e.target.value;
    else if(e.target.id === "flag") this.flag = e.target.value;
    else if(e.target.id === "score") this.score = e.target.value;
  }

  onSubmit = e => {
    e.preventDefault();
    if(this.name === "" || this.description === "" || this.flag === "" || this.score === "") {
      console.error("Missing field!");
      this.setState({status: FAILED});
      return;
    }
    if(isNaN(parseInt(this.score))) {
      console.error("Invalid score!");
      this.setState({status: FAILED});
      return;
    }
    fetch(BACKEND_URL+"/challenge", {
      method: "POST",
      body: JSON.stringify({name: this.name, description: this.description, flag: this.flag, score: this.score}),
      headers: new Headers({
        'authorization': localStorage['token'],
        'content-type': "application/json"
      })
    })
    .then(res => {
      if(res.status !== 200) {
        console.error("Error...")
        this.setState({status: FAILED});
      }
      else {
        this.setState({status: SUCCESS});
      }
    })
  }

  render() {
    if(localStorage['email'] !== "b05901143@ntu.edu.tw") {
      return (
        <div>
          <Header as='h2' icon textAlign='center'>
            <Icon name='user secret' circular />
            <Header.Content>You are NOT TA!</Header.Content>
          </Header>
        </div>
      )
    }
    
    return (
      <Grid textAlign="center">
        <Grid.Column style={{ maxWidth: "30vw", top: "5vh" }}>
          <Header as='h2' icon textAlign='center'>
            <Icon name='code' circular />
            <Header.Content>New Challenge</Header.Content>
          </Header>
          <Divider />
          <Form onSubmit={this.onSubmit}>
            <Form.Input id="name" onChange={this.onInputChange} label="題目名稱" />
            <Form.TextArea id="description" onChange={this.onInputChange} label="題目敘述" />
            <Form.Input id="flag" onChange={this.onInputChange} label="FLAG" />
            <Form.Input id="score" onChange={this.onInputChange} label="分數" />
            <Form.Button>Submit</Form.Button>
          </Form>
          {
            this.state.status === FAILED
            ?
              <Message 
                error
                header="Craete Challenge Failed"
              />
            :
              null
          }
          {
            this.state.status === SUCCESS
            ?
              <Message 
                success
                header="新增題目成功！"
              />
            :
              null
          }
        </Grid.Column>
      </Grid>
    );
  }
}

export default CreateChallenge;