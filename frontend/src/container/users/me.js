import React from 'react';
import { Container, Header, Icon, Divider, Loader } from 'semantic-ui-react';
import EditUser from "./editUser";
import {BACKEND_URL} from '../../config';

const [FAILED, SUCCESS, LOADING, MISSING] = [0, 1, 2, 3];

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING
    }
    this.user = null;
    this.getUser();
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      })
    }
  }

  getUser() {
    fetch(BACKEND_URL+`/user`, {
      method: "GET",
      headers: new Headers({
        'authorization': localStorage['token']
      })
    })
    .then(res => {
      if(res.status === 401) {
        this.setStatus(MISSING);
      }
      else if(res.status !== 200) {
        this.setStatus(FAILED);
      }
      else{
        res.json()
        .then(data => {
          this.user = data;
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
                看來出了點差錯，請您再試一次
              </Header>
            :
              this.state.status === MISSING
              ?
                <Header icon>
                  <Icon name="eye slash" />
                  <div style={{marginTop: "2vh"}} />
                  您好像沒有登入歐...
                </Header>
              :
                <React.Fragment>
                  <Header size='huge'>{this.user.name}</Header>
                  <Header size='medium'>{this.user.email}</Header>
                  <div style={{marginTop: "2vh"}} />
                  <Divider horizontal>
                    <Header size="small">
                      <Icon name="wrench" />
                      Edit Profile
                    </Header>
                  </Divider>
                  <EditUser id={this.user._id} />
                </React.Fragment>
        }
      </Container>
    );
  }
}

export default User;
