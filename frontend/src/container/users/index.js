import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Divider, Loader, Card } from 'semantic-ui-react';
import {BACKEND_URL} from '../../config';

const [FAILED, SUCCESS, LOADING] = [0, 1, 2];
let users = [];

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING
    }
    this.getUsers();
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      })
    }
  }

  getUsers() {
    fetch(BACKEND_URL+"/users")
    .then(res => {
      if(res.status !== 200) {
        this.setStatus(FAILED);
      }
      else{
        res.json()
        .then(data => {
          users = data;
          this.setStatus(SUCCESS);
        })
      }
    })
    .catch(err => {this.setStatus(FAILED); console.error(err)});
  }

  render() {
    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        <Header as='h2' icon textAlign='center'>
          <Icon name='users' circular />
          <Header.Content>Users</Header.Content>
        </Header>
        <Divider />
        {
          this.state.status === LOADING
          ?
            <Loader active content="Loading..." />
          :
            this.state.status === FAILED
            ?
              <Header icon>
                <Icon name="bug" />
                <div style={{marginTop: "2vh"}} />
                看來出了點差錯，請您再試一次。
              </Header>
            :
              <Card.Group centered>
                {users.map(user => {
                  return (
                    <Card
                      link
                      as={ Link }
                      to={`/user?id=${user._id}`}
                      header={user.name}
                      description={user.email}
                      key={user._id}
                      style={{textDecoration: 'none'}}
                    />
                  )
                })}
              </Card.Group>
        }
      </Container>
    );
  }
}

export default Users;
