import React from 'react';
import { Header, Icon, Divider, Grid, Table, Popup, Container, Button, Loader, List, Segment, Portal } from 'semantic-ui-react';
import { getBallotsCount, getMessage, getSignature, getValidator, VerifySignature, VerifyAll } from '../../contract/election';
import { bytes32ToHex } from '../../contract/util';

const [SUCCESS, LOADING, IDLE] = [0, 1, 2];

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      validateStatus: [],
      validation: [],
      sigOpen: []
    }
    this.ballots = [];
    this.keyShared = props.ended;
    for(let i = 0;i < props.tellersPubShare.length;i++) {
      this.keyShared = this.keyShared && (!(props.tellersSecret[i] === "0x"+"0".repeat(256)) || this.props.tellersPubShare[i] === "0x"+"0".repeat(255)+"1");
    }
    this.getBallots();
  }

  getBallots = async () => {
    const address = this.props.address;
    const count = await getBallotsCount(this.props.address).then(data => data);
    for(let i = 0;i < count;i++) {
      let [_message, _signature, _validator] = await Promise.all([getMessage(i, address), getSignature(i, address),  getValidator(i, address)]);
      this.ballots.push({message: bytes32ToHex(_message), signature: bytes32ToHex(_signature), validator: _validator});
    }
    this.setState(state => {
      state.status = IDLE;
      state.validateStatus = this.ballots.map(_ => IDLE);
      state.sigOpen = this.ballots.map(_ => false);
      state.validation = this.ballots.map(ballot => ballot.validator);
      return state;
    });
  }

  validateBallot = async (id, stage=NaN) => {
    const onHash = hash => {
      this.setState(state => {
        console.log("Got hash", hash);
        state.validateStatus[id] = LOADING;
        return state;
      })
    }
    const onConfirmed = (confirmationNumber, receipt) => {
      console.log("[*] Confirmed.", confirmationNumber, receipt);
      this.setState(state => {
        state.validateStatus[id] = SUCCESS;
        return state;
      })
    }
    if(!isNaN(stage)) VerifySignature(id, stage, this.props.address, onHash, onConfirmed);
    else VerifyAll(id, this.props.address, this.onHash, this.onConfirmed);
  }

  handleOpenSig = id => {
    this.setState(state => {
      state.sigOpen[id] = true;
      return state;
    })
  }

  handleCloseSig = id => {
    this.setState(state => {
      state.sigOpen[id] = false;
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
                    let validateProcess = this.state.validation[id].reduce((_sum, validated) => validated?_sum+1:_sum, 0);
                    return (
                      <Table.Row key={id}>
                        <Popup 
                          content={<Container><p>{this.break(ballot.message, 64)}</p></Container>}
                          trigger={<Table.Cell>{this.maxStr(ballot.message, 20)}</Table.Cell>}
                        />
                        <Table.Cell selectable onClick={_ => {this.handleOpenSig(id)}}>
                          <Portal onClose={_ => {this.handleCloseSig(id)}} open={this.state.sigOpen[id]}>
                            <Segment
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
                              <Container><p>{this.break(ballot.signature, 64)}</p></Container>
                            </Segment>
                          </Portal>
                          {this.maxStr(ballot.signature, 20)}
                        </Table.Cell>
                        <Table.Cell>
                          {validateProcess === ballot.validator.length?<Icon color="green" name="check" />:
                            <React.Fragment>
                              <Popup
                                position="top center"
                                content={<List>{this.state.validation[id].map((verified, _idx) => <List.Item key={`stage${id}-${_idx+1}`} content={`Stage${_idx+1}: ${verified?"ok":"?"}`} />)}</List>}
                                trigger={<p>{`${(validateProcess/ballot.validator.length)*100}%`}</p>}
                              />
                              <Button size="tiny" positive onClick={_ => {this.validateBallot(id, validateProcess)}}>Validate</Button>
                              {this.state.validateStatus[id]===LOADING?<Loader inline active />:null}
                              {this.state.validateStatus[id]===SUCCESS?<Icon color="green" name="check" />:null}
                            </React.Fragment>
                          }
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                      </Table.Row> 
                  )})}
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