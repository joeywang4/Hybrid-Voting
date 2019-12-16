import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Divider, Loader, Input, Table, Message } from 'semantic-ui-react';
import {BACKEND_URL} from '../../const_val';

const [WARNING, WRONG, ERROR, WAITING, SUCCESS, LOADING, CHECKING] = [0, 1, 2, 3, 4, 5, 6];

class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeStatus: LOADING,
      recordStatus: LOADING,
      msg: "",
      flag: ""
    }
    this.records = [];
    this.name = "";
    this.description = "";
    this.score = NaN;
    this.init(props.id);
  }

  setStatus(challengeStatus=null, recordStatus=null) {
    if(challengeStatus || recordStatus) {
      this.setState(state => {
        if(challengeStatus && state.challengeStatus !== challengeStatus) state.challengeStatus = challengeStatus;
        if(recordStatus && state.recordStatus !== recordStatus) state.recordStatus = recordStatus;
        return state;
      })
    }
  }

  setTmpMsg(msg, type, duration=3000) {
    this.setState(state => {
      state.msg = msg;
      state.challengeStatus = type;
      return state;
    })
    window.setTimeout((() => {
      this.setState(state => {
        state.msg = "";
        state.challengeStatus = WAITING;
        return state;
      })
    }), duration)
  }

  async init(id) {
    this.getChallenge(id);
    this.getRecord(id);
  }

  getChallenge(id) {
    if(this.state.challengeStatus !== LOADING) this.setStatus(LOADING, null);
    fetch(BACKEND_URL+`/challenge?id=${id}`)
    .then(res => {
      if(res.status !== 200) {
        this.setStatus(ERROR);
      }
      else{
        res.json()
        .then(data => {
          this.name = data.name;
          this.description = data.description;
          this.score = data.score;
          this.setStatus(WAITING);
        })
      }
    })
    .catch(err => {this.setStatus(ERROR); console.error(err)});
  }

  getRecord(id) {
    if(this.state.recordStatus !== LOADING) this.setStatus(null, LOADING);
    fetch(BACKEND_URL+`/records?challenge=${id}`)
    .then(res => {
      if(res.status !== 200) {
        this.setStatus(null, ERROR);
      }
      else {
        res.json()
        .then(data => {
          this.records = data;
          this.setStatus(null, WAITING);
        })
      }
    })
    .catch(err => {this.setStatus(null, ERROR); console.error(err)});
  }

  handleFlagInput = e => {
    const _flag = e.target.value;
    if(this.state.flag !== _flag){
      this.setState(state => {
        state.flag = _flag;
        return state;
      })
    }
  }

  handleKeyPress = e => {
    if(e.key === "Enter") this.checkFlag();
  }

  checkFlag = () => {
    this.setState(state => {
      state.challengeStatus = CHECKING;
      state.msg = "Checking flag...";
      return state;
    })
    fetch(BACKEND_URL+`/record`, {
      method: "POST",
      body: JSON.stringify({challenge: this.props.id, flag: this.state.flag}),
      headers: new Headers({
        'authorization': localStorage['token'],
        'content-type': "application/json"
      })
    })
    .then(res => {
      if(res.status === 401) {
        this.setTmpMsg("You are not logged in!", WRONG);
      }
      else if(res.status === 400) {
        this.setTmpMsg("Wrong Flag!", WRONG);
      }
      else if(res.status === 200) {
        this.setTmpMsg("Correct :D", SUCCESS);
        this.getRecord(this.props.id);
      }
      else if(res.status === 201) {
        this.setTmpMsg("You have already solved this challenge", WARNING);
      }
      else this.setTmpMsg("Umm... this is weird", WARNING);
    })
    .catch(err => {this.setStatus(null, ERROR); console.error(err)})
  }

  convertTime = millis => {
    const d = new Date(millis);
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  render() {
    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        <div style={{minHeight: "10vh"}}>
          {
            this.state.challengeStatus === LOADING
            ?
              <Loader active content="Loading..." />
            :
              this.state.challengeStatus === ERROR
              ?
                <Header icon>
                  <Icon name="bug" />
                  <div style={{marginTop: "2vh"}} />
                  看來出了點差錯，請您再試一次。
                </Header>
              :
                <React.Fragment>
                  <Header size="huge" textAlign='center' style={{textDecoration: "underline"}}>
                    {this.name + ` [${this.score.toString()}]`}
                  </Header>
                  <Container textAlign='center' style={{minHeight: "16vh", marginTop: "2vh"}}>
                    <pre style={{fontSize: "1.5em"}}>{this.description}</pre>
                  </Container>
                  <Input 
                    fluid
                    icon="flag"
                    iconPosition="left"
                    onChange={this.handleFlagInput}
                    onKeyPress={this.handleKeyPress}
                    action={{content: "Submit", onClick: this.checkFlag}} 
                    placeholder="YOUR FLAG: NMLab{ ... }" 
                  />
                </React.Fragment>
          }
        </div>
        
        {
          this.state.msg.length > 0
          ?
            <Message
              negative={this.state.challengeStatus === WRONG}
              success={this.state.challengeStatus === SUCCESS}
              warning={this.state.challengeStatus === WARNING}
              icon={this.state.challengeStatus === CHECKING}
            >
              {
                this.state.challengeStatus === CHECKING
                ?
                  <Icon name='circle notched' loading />
                :
                  null
              }
              <Message.Header>{this.state.msg}</Message.Header>
            </Message>
          :
            null
        }

        <Divider />
        {
          this.state.recordStatus === LOADING
          ?
            <Loader active content="Loading..." />
          :
            this.state.recordStatus === ERROR
            ?
              <Header icon>
                <Icon name="bug" />
                <div style={{marginTop: "2vh"}} />
                看來出了點差錯，請您再試一次。
              </Header>
            :
              this.records.length === 0
              ?
                <Header icon>
                  <Icon name="thumbs down outline" />
                  <div style={{marginTop: "2vh"}} />
                  看來這裡沒東西
                </Header>
              :
                <Table celled padded singleLine style={{marginBottom: "5vh"}}>
                  <Table.Header>
                    <Table.Row>
                      {
                        ["User", "Solved Time"].map(_col => {
                          return <Table.HeaderCell textAlign="center" key={_col}>{_col}</Table.HeaderCell>
                        })
                      }
                    </Table.Row>
                  </Table.Header>
                  
                  <Table.Body>
                    {
                      this.records.map(record => {
                        return (
                          <Table.Row key={record.solver._id}>
                            <Table.Cell textAlign="center">
                              <Header 
                                as={ Link } 
                                to={`/user?id=${record.solver._id}`}
                              >
                                {record.solver.name}
                              </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              {this.convertTime(record.time)}
                            </Table.Cell>
                          </Table.Row>
                        )
                      })
                    }
                  </Table.Body>
                </Table>
        }
      </Container>
    );
  }
}

export default Challenges;
