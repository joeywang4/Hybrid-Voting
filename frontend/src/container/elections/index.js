import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Divider, Loader, Card, Image, Button, Popup } from 'semantic-ui-react';
import { getAllElections } from '../../contract/electionMaster'
import electionIcon from './election.png'

const [FAILED, SUCCESS, LOADING] = [0, 1, 2];

class Elections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      progress: ""
    }
    this.elections = [];
    this.records = [];
    this.getElections();
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      });
    }
  }

  async getElections() {
    const updateProgress = text => this.setState({progress: text});
    this.elections = await getAllElections(updateProgress);
    if(this.elections === false) {
      this.setStatus(FAILED);
    }
    else{
      this.setStatus(SUCCESS);
    }
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
            <Loader active content={this.state.progress} />
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
                {this.elections.map((election, idx) => {
                  const [dBeg, dEnd] = [election.begin, election.end].map(time => new Date(parseInt(time)*1000));
                  const [sBeg, sEnd] = [dBeg, dEnd].map(_date => `${_date.getFullYear()}/${_date.getMonth()+1}/${_date.getDate()} ${_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: "h24" }).substring(0, 5)}`);
                  return (
                    <Card
                      link
                      as={ Link }
                      to={`/election?id=${idx}`}
                      header={election.title}
                      description={this.maxStr(election.description, 50)}
                      meta={sBeg + " ~ " + sEnd}
                      key={idx}
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