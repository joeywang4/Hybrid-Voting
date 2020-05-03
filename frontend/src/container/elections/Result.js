import React from 'react';
import { Header, Icon, Divider, Grid, Table, Popup, Container, Button, Loader, List, Segment, Portal } from 'semantic-ui-react';
import { getBallotsCount, getMessage, getSignature, VerifySignature } from '../../contract/election';
import { bytes32ToHex } from '../../contract/util';
import { BACKEND_URL } from '../../config';

const [SUCCESS, LOADING, IDLE] = [0, 1, 2];

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      validateStatus: [],
      validation: [],
      decryptStatus: [],
      sigOpen: false,
      sigId: 0
    }
    this.ballots = [];
    this.keyShared = props.ended;
    for(let i = 0;i < props.tellersPubShare.length;i++) {
      this.keyShared = this.keyShared && (!(props.tellersSecret[i] === "0x"+"0".repeat(256)) || this.props.tellersPubShare[i] === "0x"+"0".repeat(255)+"1");
    }
    this.getBallots();
  }

  decryptBallot = async _id => {
    this.setState(state => {
      state.decryptStatus[_id] = LOADING;
      return state;
    })
    return await fetch(BACKEND_URL+`/decryptBallot?address=${this.props.address}&ballotId=${_id}`)
    .then(res => {
      if(res.status !== 200) {
        return -1;
      }
      else{
        return res.json();
      }
    })
    .then(data => {
      this.ballots[_id].choice = data.choice;
      this.setState(state => {
        state.decryptStatus[_id] = IDLE;
        return state;
      })
      return data.choice;
    })
    .catch(err => {
      // this.setState({status: ERROR});
      console.error(err);
    });
  }

  getBallots = async () => {
    const address = this.props.address;
    const count = await getBallotsCount(this.props.address).then(data => data);
    for(let i = 0;i < count;i++) {
      let [_message, _signature, _validator] = await Promise.all([getMessage(i, address), getSignature(i, address),  [0,0,0,0,0,0]]);
      this.ballots.push({message: bytes32ToHex(_message), signature: bytes32ToHex(_signature), validator: _validator, choice: -1});
    }
    for(let i = 0;i < this.props.ballots.length;i++) {
      const id = this.props.ballots[i].ballotId;
      const choice = this.props.ballots[i].choice;
      this.ballots[id].choice = choice;
    }
    this.setState(state => {
      state.status = IDLE;
      state.validateStatus = this.ballots.map(_ => IDLE);
      state.decryptStatus = this.ballots.map(_ => IDLE);
      state.validation = this.ballots.map(ballot => this.encodeValidator(ballot.validator));
      return state;
    });
  }

  encodeValidator = validator => {
    let output = "";
    for(let _val of validator) output = output.concat(_val.toString());
    return output;
  }

  decodeValidator = encoded => {
    let output = [];
    for(let i = 0;i < encoded.length;i++) output.push(parseInt(encoded[i]));
    return output;
  }

  validateBallot = async (id, stage) => {
    const onHash = hash => {
      this.setState(state => {
        console.log("Got hash", hash);
        state.validateStatus[id] = LOADING;
        return state;
      })
    }
    const onConfirmed = async (confirmationNumber, receipt) => {
      console.log("[*] Confirmed.", confirmationNumber, receipt);
      const newValidator = [0,0,0,0,0,0];
      this.setState(state => {
        state.validateStatus[id] = SUCCESS;
        state.validation[id] = this.encodeValidator(newValidator);
        return state;
      })
    }
    VerifySignature(id, stage, this.props.address, onHash, onConfirmed);
  }

  handleOpenSig = id => {
    this.setState(state => {
      state.sigOpen = true;
      state.sigId = id;
      return state;
    })
  }

  handleCloseSig = () => {
    this.setState(state => {
      state.sigOpen = false;
      return state;
    })
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
    return (
      <React.Fragment>
        <div style={{marginTop: "2vh"}} />
        <Divider horizontal>
          <Header as='h4'>
            <Icon name='info' />
            Result
          </Header>
        </Divider>
        <div style={{marginTop: "2vh"}} />
        <div style={{minHeight: "10vh"}}>
          {this.state.status===IDLE?<Grid textAlign="center">
            <Grid.Column>
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Ballot</Table.HeaderCell>
                    <Table.HeaderCell>Signature</Table.HeaderCell>
                    <Table.HeaderCell>Validation</Table.HeaderCell>
                    <Table.HeaderCell collapsing>Choice</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(this.state.status !== IDLE)?null:this.ballots.map((ballot, id) => {
                    let validateProcess = this.decodeValidator(this.state.validation[id]).reduce((_sum, validated) => validated===2?_sum+1:_sum, 0);
                    return (
                      <Table.Row key={id}>
                        {/* Ballot */}
                        <Popup 
                          content={<Container><p>{this.break(ballot.message, 64)}</p></Container>}
                          trigger={<Table.Cell>{this.maxStr(ballot.message, 20)}</Table.Cell>}
                        />
                        
                        {/* Signature */}
                        <Table.Cell selectable onClick={_ => {this.handleOpenSig(id)}}>
                          {this.maxStr(ballot.signature, 20)}
                        </Table.Cell>
                        
                        {/* Validation */}
                        <Table.Cell>
                          {validateProcess === ballot.validator.length?<Icon color="green" name="check" />:
                            <React.Fragment>
                              <Popup
                                position="top center"
                                content={<List>{this.decodeValidator(this.state.validation[id]).map((verified, _idx) => <List.Item key={`stage${id}-${_idx+1}`} content={`Stage${_idx+1}: ${verified===2?"ok":(verified===1?"failed":"?")}`} />)}</List>}
                                trigger={<p>{`${(validateProcess/ballot.validator.length)*100}%`}</p>}
                              />
                              <Button loading={this.state.validateStatus[id]===LOADING} size="tiny" positive onClick={_ => {this.validateBallot(id, Math.floor(validateProcess/3))}}>Validate</Button>
                              {this.state.validateStatus[id]===SUCCESS?<Icon color="green" name="check" />:null}
                            </React.Fragment>
                          }
                        </Table.Cell>
                        
                        {/* Choice */}
                        <Table.Cell>
                          {ballot.choice === -1?
                            <Button disabled={!this.keyShared || validateProcess !== ballot.validator.length} loading={this.state.decryptStatus[id]===LOADING} negative onClick={_ => {this.decryptBallot(id)}}>
                              Decrypt
                            </Button>
                          :
                            <span>
                              {Math.log2(ballot.choice)<this.props.choices.length?this.props.choices[Math.log2(ballot.choice)]:"Abstain"}
                            </span>
                          }
                        </Table.Cell>
                      </Table.Row> 
                  )})}
                  <Portal onClose={_ => {this.handleCloseSig()}} open={this.state.sigOpen}>
                    <Segment
                      textAlign="center"
                      style={{
                        left: "10%",
                        width: "80%",
                        top: "15vh",
                        maxHeight: "60%",
                        position: "fixed",
                        zIndex: 1000,
                        overflow: "auto"
                      }}
                    >
                      <Container><p>{this.ballots.length>0?this.break(this.ballots[this.state.sigId].signature, 64):""}</p></Container>
                      <Button
                        content='Close'
                        negative
                        onClick={this.handleCloseSig}
                      />
                    </Segment>
                  </Portal>
                </Table.Body>
              </Table>
              {this.state.msg?this.state.msg:null}
            </Grid.Column>
          </Grid>
          :<Loader active inline />}
        </div>
      </React.Fragment>
    );
  }
}

export default Result;