import React from 'react';
import { Header, Icon, Divider, Form, Grid, Message, Button, Portal, Segment, Table, Popup, Container } from 'semantic-ui-react';
import { sendElgamalPubShare, sendElgamalSecret, getTellersPubShare, getTellersSecret } from '../../contract/election';
import { base64ToBytes32, hexToBase64 } from '../../contract/util';
import { CLIENT_URL, NO_CLIENT_URL } from "../../config";

const [LOADING, IDLE] = [0, 1];

class KeySharing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formStatus: IDLE,
      msg: "",
      privateKey: "",
      secret: 0,
      publicShare: "",
      tellersOpen: false,
      tellersPubShare: props.tellersPubShare,
      tellersSecret: props.tellersSecret
    }
    this.tellerId = -1;
    this.hasSharedPub = false;
    this.hasSharedSecret = false;
    this.fileInputRef = React.createRef();

    if(localStorage['email']) {
      for(let i = 0;i < this.props.tellers.length;i++) {
        if(this.props.tellers[i]['email'] === localStorage['email']) {
          this.tellerId = i;
          this.hasSharedPub = !(this.props.tellersPubShare[i] === "0x"+"0".repeat(255)+"1");
          this.hasSharedSecret = this.props.ended && (!(this.props.tellersSecret[i] === "0x"+"0".repeat(256)) || this.props.tellersPubShare[i] === "0x"+"0".repeat(255)+"1");
          break;
        }
      }
    }
  }

  showForm = () => {
    if(this.tellerId !== -1 && 
      (this.props.began === false || this.props.ended === true) && 
      ((this.props.began === false && !this.hasSharedPub) || (this.props.ended === true && !this.hasSharedSecret))) {
      return [true, ""];
    }
    else if(this.tellerId === -1) return [false, "You are not a teller"];
    else if(this.props.began === true && this.props.ended === false) return [false, "The election is running"];
    else if(this.props.began === false && this.hasSharedPub) return [false, "You have submitted public share"];
    else return [false, "You have submitted secret"];
  }

  onSubmit = e => {
    e.preventDefault();
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

  calcPubShare = async _ => {
    const result = await fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/elGamalExp", {
      method: 'POST',
      body: JSON.stringify({power: this.state.secret}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      if(res.status === 200) return res.text();
    })
    .then(data => data);
    this.setState({publicShare: result});
  }

  onHash = hash => {
    const link = "https://ropsten.etherscan.io/tx/"+hash;
    this.setState(state => {
      console.log("Got hash", hash);
      state.formStatus = IDLE;
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

  onConfirmed = async (confirmationNumber, receipt) => {
    console.log("[*] Confirmed.", confirmationNumber, receipt);
    const [_tellersPubshare, _tellersSecret] = await Promise.all([getTellersPubShare(this.props.address), getTellersSecret(this.props.address)]);
    this.setState(state => {
      state.formStatus = IDLE;
      state.tellersPubShare = _tellersPubshare;
      state.tellersSecret = _tellersSecret;
      state.msg = (
        <Message positive icon>
          <Icon name='check' />
          <Message.Content>
            <Message.Header>Transaction Success!</Message.Header>
            Refreash this page to check the result
          </Message.Content>
        </Message>
      );
      return state;
    })
  }

  sendPubShare = async _ => {
    if(this.state.publicShare === "" || this.state.privateKey === "") return false;
    this.setState({formStatus: LOADING});
    const signature = await this.signNumber(this.state.publicShare);
    sendElgamalPubShare(this.tellerId, base64ToBytes32(this.state.publicShare, 128), base64ToBytes32(signature, 128), this.props.address, this.onHash, this.onConfirmed);
  }

  sendSecret = async _ => {
    this.setState({formStatus: LOADING});
    let secret = "";
    if(!isNaN(this.state.secret)) {
      secret = hexToBase64(parseInt(this.state.secret).toString(16))      
    } else secret = this.state.secret;
    const signature = await this.signNumber(secret);
    sendElgamalSecret(this.tellerId, base64ToBytes32(secret, 128), base64ToBytes32(signature, 128), this.props.address, this.onHash, this.onConfirmed);
  }

  signNumber = async number => {
    if(this.state.privateKey === "") return false;
    return await fetch((this.props.hasClient?CLIENT_URL:NO_CLIENT_URL)+"/numberSignature", {
      method: 'POST',
      body: JSON.stringify({sigPrivKey: this.state.privateKey, number: number}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      if(res.status === 200) return res.text();
    })
    .then(data => data);
  }

  maxStr = (_str, _max) => {
    if(_str.substring(0, 2) === "0x") {
      let count = 0;
      for(let i = 2;i < (_str.length-1) && _str[i] === "0";i++) count += 1;
      _str = "0x" + _str.substring(2+count);
    }
    return (_str.length > _max)?(_str.substring(0,  _max)+"..."):_str;
  }

  break = (_str, _length) => {
    let output = "0x";
    _str = _str.substring(2);
    let i = 0;
    for(;(i+1)*_length < _str.length;i++) output += _str.substring(i*_length, (i+1)*_length)+"\n";
    output += _str.substring(i*_length);
    return output;
  }

  render() {
    const [show, reason] = this.showForm();
    return (
      <React.Fragment>
        <div style={{marginTop: "2vh"}} />
        <Divider horizontal>
          <Header as='h4'>
            <Icon name='key' />
            Tellers
          </Header>
        </Divider>
        <div style={{marginTop: "2vh"}} />
        <div style={{minHeight: "10vh"}}>
          <Grid textAlign="center">
            <Grid.Column style={{maxWidth: "50vw"}}>
              {!show?
                <p>{reason}</p>
              :
                <React.Fragment>
                  <Header as='h2'>{this.props.began===false?"Send Public Share":"Send Secret"}</Header>
                  <Form loading={this.state.formStatus === LOADING} onSubmit={this.onSubmit}>
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
                    {this.props.began === false?
                      <React.Fragment>
                        <Form.Field>
                          <label>Secret (not required)</label>
                          <Form.Group>
                            <Form.Input width={14} type="number" required={false} id="secret" value={this.state.secret} onChange={e => {this.setState({secret: e.target.value})}} />
                            <Form.Button type="button" content="Calculate Public Share" onClick={this.calcPubShare} />
                          </Form.Group>
                        </Form.Field>
                        <Form.Field required>
                          <label>Public Share</label>
                          <Form.Group>
                            <Form.Input width={14} type="text" required={true} id="pubShare" value={this.state.publicShare} onChange={e => {this.setState({publicShare: e.target.value})}} />
                            <Form.Button positive content="Send" onClick={this.sendPubShare} />
                          </Form.Group>
                        </Form.Field>
                      </React.Fragment>
                    :  
                      <React.Fragment>
                        <Form.Field required>
                          <label>Secret</label>
                          <Form.Group>
                            <Form.Input width={14} type="text" required={true} id="submitSecret" value={this.state.secret} onChange={e => { this.setState({secret: e.target.value}) }} />
                            <Form.Button positive content="Send" onClick={this.sendSecret} />
                          </Form.Group>
                        </Form.Field>
                      </React.Fragment>
                    }
                  </Form>
              </React.Fragment>
              }
              {this.state.msg === ""?
                null
              :
                this.state.msg
              }
              <Button
                content='View Key Sharing Status'
                disabled={this.state.tellersOpen}
                onClick={_ => {this.setState({tellersOpen: true})}}
              />
              <Portal onClose={_ => {this.setState({tellersOpen: false})}} open={this.state.tellersOpen}>
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
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Public Share</Table.HeaderCell>
                        <Table.HeaderCell>Secret</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.props.tellers.map((teller, i) => {
                        return (
                          <Table.Row key={teller.email}>
                            <Table.Cell collapsing>
                              {teller.name}
                            </Table.Cell>
                            <Popup content={<Container><p>{this.break(this.props.tellersPubShare[i], 64)}</p></Container>} trigger={<Table.Cell>{this.maxStr(this.props.tellersPubShare[i], 45)}</Table.Cell>} />
                            <Popup position="top right" content={<Container><p>{this.break(this.props.tellersSecret[i], 64)}</p></Container>} trigger={<Table.Cell>{this.maxStr(this.props.tellersSecret[i], 45)}</Table.Cell>} />
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table>
                  <Button
                    content='Close'
                    negative
                    style={{marginTop: "2vh"}}
                    onClick={_ => {this.setState({tellersOpen: false})}}
                  />
                </Segment>
              </Portal>
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default KeySharing;