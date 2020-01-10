import React from 'react';
import { Header, Icon, Divider, Grid, Table, Form, Button } from 'semantic-ui-react';
import { castBallot } from '../../contract/election';
import { CLIENT_URL, NO_CLIENT_URL } from '../../const_val';
import { hexToBase64 } from '../../contract/util';

const [ERROR, LOADING, IDLE] = [0, 1, 2];

class Ballot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      eKey: "",
      msg: "",
      privateKey: ""
    }
    this.isVoter = false;
    this.fileInputRef = React.createRef();
    
    if(localStorage['email']) {
      for(let i = 0;i < this.props.voters.length;i++) {
        if(this.props.voters[i].email === localStorage['email']) {
          this.isVoter = true;
          break;
        }
      }
    }
  }

  choiceToNum = choice => (1<<choice);

  onVote = async num => {
    if(!localStorage['sigPubKey'] || this.state.eKey === "" || this.state.privateKey === "") return false;
    let voters = this.props.voters.map(voter => voter.sigPubKey);
    console.log("[Vote]", num);
    const rawSignature = await fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/createBallot", {
      method: 'POST',
      body: JSON.stringify({
        voters,
        sigPrivKey: this.state.privateKey,
        sigPubKey: localStorage['sigPubKey'], 
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
    })
    .then(data => data.signature);
    console.log(rawSignature);
    let signature = [];
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
              <Form loading={this.state.formStatus === LOADING} onSubmit={this.onSubmit}>
                <Table celled textAlign="center">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Choices</Table.HeaderCell>
                      <Table.HeaderCell collapsing></Table.HeaderCell>
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
                            <Button disabled={!canVote} positive onClick={_ => {this.onVote(this.choiceToNum(id))}}>Vote</Button>
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell negative>Abstain</Table.HeaderCell>
                      <Table.HeaderCell collapsing>
                        <Button disabled={!canVote} negative onClick={_ => {this.onVote(this.choiceToNum(this.props.choices.length))}}>
                          Vote
                        </Button>
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
                  <strong>You can not vote</strong>
                }
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default Ballot;