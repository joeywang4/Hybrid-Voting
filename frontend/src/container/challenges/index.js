import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Divider, Loader, Card } from 'semantic-ui-react';
import {BACKEND_URL} from '../../const_val';

const [FAILED, SUCCESS, LOADING] = [0, 1, 2];

class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING
    }
    this.challenges = [];
    this.records = [];
    this.getChallenges();
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      })
    }
  }

  getChallenges() {
    fetch(BACKEND_URL+"/challenges")
    .then(res => {
      if(res.status !== 200) {
        this.setStatus(FAILED);
      }
      else{
        res.json()
        .then(data => {
          this.challenges = data;
        })
      }
    })
    .catch(err => {this.setStatus(FAILED); console.error(err)});
    if(localStorage['token']) {
      fetch(BACKEND_URL+"/records?solver=me", {
        headers: new Headers({
        'authorization': localStorage['token']
        })
      })
      .then(res => {
        if(res.status !== 200) {
          this.setStatus(FAILED);
        }
        else {
          res.json()
          .then(data => {
            this.records = data.map(record => record.challenge._id.toString());
            this.checkSolved();
            this.setStatus(SUCCESS);
          })
        }
      })
    }
    else this.setStatus(SUCCESS);
  }

  checkSolved = () => {
    for(let i = 0;i < this.challenges.length;i++) {
      let id = this.challenges[i]._id.toString();
      let found = this.records.find(record => record === id);
      if(found) this.challenges[i]['solved'] = true;
      else this.challenges[i]['solved'] = false;
    }
  }

  render() {
    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        <Header as='h2' icon textAlign='center'>
          <Icon name='trophy' circular />
          <Header.Content>Challenges</Header.Content>
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
                {this.challenges.map(challenge => {
                  return (
                    <Card
                      link
                      as={ Link }
                      to={`/challenge?id=${challenge._id}`}
                      header={(challenge.solved?"[Solved] ":"")+challenge.name}
                      description={`Score: ${challenge.score}`}
                      key={challenge._id}
                      color={challenge.solved?"green":null}
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

export default Challenges;
