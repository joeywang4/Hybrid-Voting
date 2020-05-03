import React from 'react';
import { Container, Header, Icon, Loader } from 'semantic-ui-react';
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
    fetch(BACKEND_URL+`/user?id=${this.props.id}`)
    .then(res => {
      if(res.status === 404) {
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
                  <Icon name="crosshairs" />
                  <div style={{marginTop: "2vh"}} />
                  查無此人
                </Header>
              :
                <React.Fragment>
                  <Header size='huge'>{this.user.name}</Header>
                  <Header size='medium'>{this.user.email}</Header>
                  <div style={{marginTop: "2vh"}} />
                </React.Fragment>
        }
      </Container>
    );
  }
}

export default User;
