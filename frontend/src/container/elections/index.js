import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Divider, Loader, Card, Image, Button, Popup } from 'semantic-ui-react';
import { BACKEND_URL } from '../../config';
import electionIcon from './election.png'

const [ERROR, SUCCESS, LOADING] = [0, 1, 2];

class Elections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING
    }
    this.elections = [];
    this.getElections();
  }

  async getElections() {
    await fetch(BACKEND_URL+"/elections")
    .then(res => {
      if(res.status !== 200) {
        this.setState({status: ERROR});
      }
      else{
        return res.json();
      }
    })
    .then(data => {
      this.elections = data;
      this.setState({status: SUCCESS});
    })
    .catch(err => {
      this.setState({status: ERROR});
      console.error(err);
    });
  }

  maxStr(_str, size) {
    if(_str.length > size) return _str.substring(0, size-3)+"...";
    else return _str;
  }

  render() {
    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        <Image src={electionIcon} size="tiny" centered />
        <Header as='h2' icon textAlign='center'>
          <Header.Content>Elections</Header.Content>
        </Header>
        <Divider />
        {
          this.state.status === LOADING
          ?
            <Loader active />
          :
            this.state.status === ERROR
            ?
              <Header icon>
                <Icon name="bug" />
                <div style={{marginTop: "2vh"}} />
                看來出了點差錯，請您再試一次。
              </Header>
            :
              <Card.Group centered>
                {this.elections.map((election, idx) => {
                  return (
                    <Card
                      link
                      as={ Link }
                      to={`/election?address=${election.address}`}
                      header={election.title}
                      meta={this.maxStr(election.description, 50)}
                      key={election.address}
                      style={{textDecoration: 'none'}}
                    />
                  )
                })}
              </Card.Group>
        }
        
        <Popup content='New Election' position="top center" trigger={
          <Button style={{position: "fixed", bottom: "5vh", right: "5vh"}} size="big" color="green" circular icon="plus" as={Link} to='/create-election' />
        } />
      </Container>
    );
  }
}

export default Elections;