import React from 'react';
import { Header, Icon, Divider, Grid, Table, Form, Button, Message } from 'semantic-ui-react';
import { castBallot } from '../../contract/election';
import { CLIENT_URL, NO_CLIENT_URL } from '../../config';
import { hexToBase64, base64ToBytes32 } from '../../contract/util';

const [LOADING, IDLE] = [0, 1];

class Ballot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: IDLE,
      eKey: "",
      msg: "",
      privateKey: ""
    }
    this.isVoter = false;
    this.counts = [];
    this.fileInputRef = React.createRef();
    
    if(localStorage['email']) {
      for(let i = 0;i < this.props.voters.length;i++) {
        if(this.props.voters[i].email === localStorage['email']) {
          this.isVoter = true;
          break;
        }
      }
    }
    this.counts = this.props.choices.map(_ => 0);
    this.counts.push(0);
    for(let ballot of this.props.ballots) {
      this.counts[Math.log2(ballot.choice)] += 1;
    }
  }

  choiceToNum = choice => (1<<choice);

  onSubmit = e => {
    e.preventDefault();
  }

  onHash = hash => {
    const link = "https://ropsten.etherscan.io/tx/"+hash;
    this.setState(state => {
      console.log("Got hash", hash);
      state.status = IDLE;
      state.msg = (
        <Message positive icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Transaction Processing</Message.Header>
            Check your transaction <a href={link} target="_blank" rel="noopener noreferrer">here</a>
          </Message.Content>
        </Message>
      )
      return state;
    })
  }

  onConfirmed = (confirmationNumber, receipt) => {
    console.log("[*] Confirmed.", confirmationNumber, receipt);
    let ballotId = -1;
    if(receipt && receipt.events && receipt.events.NewBallot && receipt.events.NewBallot.returnValues) {
      ballotId = parseInt(receipt.events.NewBallot.returnValues.ballotId);
    }
    this.setState(state => {
      state.status = IDLE;
      state.msg = (
        <Message positive icon>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>Your ballot ID is {ballotId}</Message.Header>
            Please remember that!
          </Message.Content>
        </Message>
      );
      return state;
    })
  }

  onVote = async num => {
    if(!localStorage['sigPubKey'] || this.state.eKey === "" || this.state.privateKey === "") return false;
    this.setState({status: LOADING, msg: ""});
    let voters = this.props.voters.map(voter => voter.sigPubKey);
    for(let i = 0;i < voters.length;i++) {
      if(voters[i] === localStorage['sigPubKey']) {
        voters = voters.slice(0, i).concat(voters.slice(i+1));
        break;
      }
    }
    let [rawSignature, [c1, c2]] = await fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/createBallot", {
      method: 'POST',
      body: JSON.stringify({
        voters,
        sigPrivKey: this.state.privateKey,
        sigPubKey: localStorage['sigPubKey'],
        tellersPubShare: this.props.tellersPubShare,
        eKey: isNaN(this.state.eKey)?this.state.eKey:hexToBase64(parseInt(this.state.eKey).toString(16)),
        choice: num,
        accumBase: hexToBase64(this.props.accumBase),
        linkBase: hexToBase64(this.props.linkBase)
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      if(res.status === 200) return res.json();
      else console.log("error in create ballot");
    })
    .then(data => [data.signature, data.message.map(data => base64ToBytes32(data))]);
    let [pubKeyAccum, linkableTag] = rawSignature.slice(0, 2).map(data => base64ToBytes32(data));
    rawSignature = rawSignature.slice(2);
    let signature = [];
    for(let i = 0;i < rawSignature.length;i++) {
      signature = signature.concat(base64ToBytes32(rawSignature[i]));
    }
    castBallot(c1.concat(c2), pubKeyAccum, linkableTag, signature, this.props.address, this.onHash, this.onConfirmed);
  }

  getRandom(callback) {
    fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/getRandom?min=2")
    .then(res => {
      if(res.status === 200) {
        res.text()
        .then(data => {
          callback(data);
        })
      }
      else {
        callback("Ag==");
      }
    })
    .catch(err => {
      console.error(err);
      callback("Ag==")
    })
  }

  handleUploadPrivateKey = () => {
    const file = this.fileInputRef.current.files[0];
    const reader = new FileReader();
    this.setState(state => {
      state.uploadBusy = true;
      return state;
    })
    reader.onload = e => {
      const loaded = JSON.parse(e.target.result);
      if(!("sigPrivKey" in loaded)) {
        this.setState({err: "Invalid Key File!"});
        return false;
      }
      this.setState({privateKey: loaded['sigPrivKey']});
      console.log("Private Key:", this.state.privateKey);
    }
    reader.onerror = _ => {
      alert("You uploaded an invalid file");
    }
    reader.readAsText(file);
  }

  render() {
    const canVote = this.props.began === true && this.props.ended === false && this.isVoter;
    let reason = "";
    if(!canVote) {
      if(this.props.began === false) reason = "This election is not started yet";
      else if(this.props.ended === true) reason = "This election has ended";
      else if(!this.isVoter) reason = "You are not a voter";
      else reason = "You can not vote";
    }
    return (
      <React.Fragment>
        <div style={{marginTop: "2vh"}} />
        <Divider horizontal>
          <Header as='h4'>
            <Icon name='table' />
            Vote
          </Header>
        </Divider>
        <div style={{marginTop: "2vh"}} />
        <div style={{minHeight: "10vh"}}>
          <Grid textAlign="center">
            <Grid.Column style={{maxWidth: "50vw"}}>
              <Form loading={this.state.status === LOADING} onSubmit={this.onSubmit}>
                <Table celled textAlign="center">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Choices</Table.HeaderCell>
                      <Table.HeaderCell collapsing>{this.props.ended?"Count":""}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.props.choices.map((choice, id) => {
                      return (
                        <Table.Row key={id}>
                          <Table.Cell verticalAlign="middle">
                            <Header as='h2' textAlign="center">{choice}</Header>
                          </Table.Cell>
                          <Table.Cell collapsing>
                            {!this.props.ended?
                              <Button disabled={!canVote} positive onClick={_ => {this.onVote(this.choiceToNum(id))}}>Vote</Button>
                            :
                              <span>{this.counts[id]}</span>
                            }
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell negative>Abstain</Table.HeaderCell>
                      <Table.HeaderCell collapsing>
                        {!this.props.ended?
                          <Button disabled={!canVote} negative onClick={_ => {this.onVote(this.choiceToNum(this.props.choices.length))}}>
                            Vote
                          </Button>
                        :
                          <span>{this.counts[this.counts.length-1]}</span>
                        }
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                </Table>
                {canVote
                ?
                  <React.Fragment>
                    <Form.Field required>
                      <label>Signature Private Key</label>
                      <Form.Group>
                        <Form.Input 
                          type="text"
                          required
                          value={this.state.privateKey}
                          onChange={e => this.setState({privateKey: e.target.value})}
                          width={14}
                        />
                        <Form.Button
                          content="Upload"
                          type="button"
                          onClick={() => {
                            this.fileInputRef.current.click()
                          }}
                        />
                        <input
                          ref={this.fileInputRef}
                          type="file"
                          accept=".json"
                          hidden
                          onInput={this.handleUploadPrivateKey}
                        />
                      </Form.Group>
                    </Form.Field>
                    <Form.Field required>
                      <label>Ephemeral Key</label>
                      <Form.Group>
                        <Form.Input 
                          type="text"
                          required
                          value={this.state.eKey}
                          onChange={e => this.setState({eKey: e.target.value})}
                          width={14}
                        />
                        <Form.Button
                          content="Auto"
                          type="button"
                          onClick={_ => { this.getRandom(data => this.setState({eKey: data}))}}
                        />
                      </Form.Group>
                    </Form.Field>
                  </React.Fragment>
                :
                  <strong>{reason}</strong>
                }
              </Form>
              {this.state.msg !== ""
              ?
                this.state.msg
              :
                null
              }
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default Ballot;