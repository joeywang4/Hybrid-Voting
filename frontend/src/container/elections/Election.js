import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Loader, Portal, Button, Segment, Card } from 'semantic-ui-react';
import KeySharing from './KeySharing';
import Ballot from './Ballot';
import Result from './Result';
import { getElectionInfo } from '../../contract/election';
import { hexToBase64, bytes32ToHex } from '../../contract/util';
import {BACKEND_URL} from '../../config';

const [ERROR, LOADING, IDLE] = [0, 1, 2];

class Election extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      voterOpen: false,
      tellerOpen: false
    }
    this.title = "";
    this.description = "";
    this.begin = 0;
    this.end = 0;
    this.ballots = [];
    this.choices = [];
    this.voters = [];
    this.tellers = [];
    this.admin = [];
    this.accumBase = [];
    this.linkBase = [];
    this.accumVoters = [];
    this.elgamalPubKey = [];
    this.sigN = [];
    this.sigPhi = [];
    this.tellersPubShare = [];
    this.tellersSecret = [];
    this.getElection(props.address);
  }

  pubKeyToUser = async bytes32PubKey => {
    let hexKey = ""
    for(let i = 0;i < 4;i++) {
      if(bytes32PubKey[i].substring(0, 2) === "0x") hexKey += bytes32PubKey[i].substring(2);
      else hexKey +=  bytes32PubKey[i];
    }
    let pubKey = hexToBase64(hexKey);
    return await fetch(BACKEND_URL+"/searchUser", {
      method: "POST",
      body: JSON.stringify({sigPubKey: pubKey}),
      headers: {'content-type': "application/json"}
    })
    .then(res => {
      if(res.status === 200) return res.json();
    })
    .then(data => data);
  }

  async getElection(address) {
    let dbSuccess = false;
    await fetch(BACKEND_URL+`/election?address=${address}`)
    .then(res => {
      if(res.status !== 200) {
        this.setState({status: ERROR});
      }
      else{
        return res.json();
      }
    })
    .then(data => {
      this.title = data.title;
      this.description = data.description;
      this.choices = data.choices;
      this.voters = data.voters;
      this.ballots = data.ballots;
      dbSuccess = true;
    })
    .catch(err => {
      this.setState({status: ERROR});
      console.error(err);
    });
    const election = await getElectionInfo(address);
    [
      this.begin,
      this.end,
      this.accumBase,
      this.linkBase,
      this.accumVoters,
      this.elgamalPubKey,
      this.sigN,
      this.sigPhi
    ] = [
      election.begin,
      election.end,
      bytes32ToHex(election.accumBase),
      bytes32ToHex(election.linkBase),
      election.accumVoters,
      election.elgamalPubKey,
      election.sigN,
      election.sigPhi
    ]
    this.tellers = await Promise.all(election.tellers.map(teller => this.pubKeyToUser(teller)));
    this.admin = await this.pubKeyToUser(election.admin);
    this.tellersPubShare = election.tellersPubShare.map(pubShare => bytes32ToHex(pubShare));
    this.tellersSecret = election.tellersSecret.map(secret => bytes32ToHex(secret));
    if(dbSuccess) {
      this.setState({status: IDLE});
    }
  }

  convertTime = epoch => {
    const dTime = new Date(parseInt(epoch)*1000);
    return `${dTime.getFullYear()}/${dTime.getMonth()+1}/${dTime.getDate()} ${dTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: "h24" }).substring(0, 5)}`;
  }

  render() {
    let now = Math.floor(Date.now()/1000);
    let begin = parseInt(this.begin);
    let end = parseInt(this.end);

    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        <div style={{minHeight: "10vh"}}>
          {
            this.state.status === LOADING
            ?
              <Loader active content="Loading..." />
            :
              this.state.status === ERROR
              ?
                <Header icon>
                  <Icon name="bug" />
                  <div style={{marginTop: "2vh"}} />
                  看來出了點差錯，請您再試一次。
                </Header>
              :
                <React.Fragment>
                  <Header size="huge" textAlign='center'>
                    {this.title}
                  </Header>
                  <Container textAlign='center' style={{minHeight: "5vh", marginTop: "2vh"}}>
                    <p style={{fontSize: "1.5em", whiteSpace: "pre-wrap"}}>{this.description}</p>
                  </Container>
                  {/* Time Range */}
                  <p>
                    Duration: {this.convertTime(this.begin)} ~ {this.convertTime(this.end)}
                  </p>
                  {/* Admin */}
                  <p>
                    Created by: <Link to={`/user?id=${this.admin._id}`}>{this.admin.name}</Link>
                  </p>
                  {/* View Voters */}
                  <Button
                    content='View Voters'
                    disabled={this.state.voterOpen}
                    onClick={_ => {this.setState({voterOpen: true})}}
                  />
                  <Portal onClose={_ => {this.setState({voterOpen: false})}} open={this.state.voterOpen}>
                    <Segment
                      placeholder
                      style={{
                        left: "10%",
                        width: "80%",
                        top: "15vh",
                        position: "fixed",
                        zIndex: 1000
                      }}
                    >
                      <Card.Group centered>
                        {this.voters.map( voter => {
                          return (
                            <Card
                              link
                              as={ Link }
                              to={`/user?id=${voter._id}`}
                              header={voter.name}
                              meta={voter.email}
                              key={voter._id}
                              style={{textDecoration: 'none'}}
                            />
                          )
                        })}
                      </Card.Group>
                      <Button
                        content='Close'
                        negative
                        style={{marginTop: "2vh"}}
                        onClick={_ => {this.setState({voterOpen: false})}}
                      />
                    </Segment>
                  </Portal>
                  {/* View Tellers */}
                  <Button
                    content='View Tellers'
                    disabled={this.tellerOpen}
                    onClick={_ => {this.setState({tellerOpen: true})}}
                  />
                  <Portal onClose={_ => {this.setState({tellerOpen: false})}} open={this.state.tellerOpen}>
                    <Segment
                      placeholder
                      style={{
                        left: "10%",
                        width: "80%",
                        top: "15vh",
                        position: "fixed",
                        zIndex: 1000
                      }}
                    >
                      <Card.Group centered>
                        {this.tellers.map( voter => {
                          return (
                            <Card
                              link
                              as={ Link }
                              to={`/user?id=${voter._id}`}
                              header={voter.name}
                              meta={voter.email}
                              key={voter._id}
                              style={{textDecoration: 'none'}}
                            />
                          )
                        })}
                      </Card.Group>
                      <Button
                        content='Close'
                        negative
                        style={{marginTop: "2vh"}}
                        onClick={_ => {this.setState({tellerOpen: false})}}
                      />
                    </Segment>
                  </Portal>
                  {/* Key Sharing */}
                  <KeySharing
                    began={now >= begin}
                    ended={now > end}
                    tellers={this.tellers}
                    tellersPubShare={this.tellersPubShare}
                    tellersSecret={this.tellersSecret}
                    address={this.props.address}
                    status={this.state.status}
                    hasClient={this.props.hasClient}
                  />
                  {/* Cast Ballot */}
                  <Ballot
                    began={now >= begin}
                    ended={now > end}
                    voters={this.voters}
                    choices={this.choices}
                    tellersPubShare={this.tellersPubShare}
                    accumBase={this.accumBase}
                    accumVoters={this.accumVoters}
                    linkBase={this.linkBase}
                    ballots={this.ballots}
                    address={this.props.address}
                    hasClient={this.props.hasClient}
                  />
                  {/* View Ballots */}
                  <Result
                    began={now >= begin}
                    ended={now > end}
                    tellersPubShare={this.tellersPubShare}
                    tellersSecret={this.tellersSecret}
                    ballots={this.ballots}
                    choices={this.choices}
                    address={this.props.address}
                    hasClient={this.props.hasClient}
                  />
                </React.Fragment>
          }
        </div>
      </Container>
    );
  }
}

export default Election;