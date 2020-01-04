import React from 'react'
import { Grid, Form, Button, Message, Icon, Header, TextArea, Table, Menu, Loader, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { createElection } from '../../contract/electionMaster'
import { BACKEND_URL } from '../../const_val';

const [IDLE, BUSY, ERROR] = [0, 1, 2];
const tableRows = 3;
const tableCols = 3;

/*
TODOs
- Add restrictions
- Connect to web3
*/

class CreateElection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: "",
      msg: "",
      createState: IDLE,
      choices: [],
      usersState: BUSY,
      votersPage: 1,
      voters: {},
      tellersPage: 1,
      tellers: {},
      redirect: false
    }
    this.title = "";
    this.description = "";
    this.beginDate = 0;
    this.beginTime = 0;
    this.endDate = 0;
    this.endTime = 0;
    this.users = [];

    this.getUsers();
  }

  getUsers() {
    fetch(BACKEND_URL+"/users")
    .then(res => {
      if(res.status !== 200) {
        this.setState({usersState: ERROR});
      }
      else{
        res.json()
        .then(data => {
          this.users = data;
          let voters = {};
          this.users.forEach(user => {
            voters[user.email] = false;
          });
          let tellers = {};
          this.users.forEach(user => {
            tellers[user.email] = false;
          })
          this.setState({usersState: IDLE, voters, tellers});
        })
      }
    })
    .catch(err => {
      this.setState({usersState: ERROR});
      console.error(err);
    });
  }

  handleUserClicked(email, selectedDict) {
    selectedDict[email] = !selectedDict[email];
    this.setState(state => state);
  }

  setPage(name, page) {
    if(name === "voters") this.setState({votersPage: page});
    else if(name === "tellers") this.setState({tellersPage: page});
  }

  nextPage(name) {
    let num = 999;
    if(name === "voters") num = this.state.votersPage;
    else if(name === "tellers") num = this.state.tellersPage;
    if(num+1 <= Math.ceil(this.users.length/(tableRows*tableCols))) {
      this.setPage(name, num+1);
    }
  }

  prevPage(name) {
    let num = -1;
    if(name === "voters") num = this.state.votersPage;
    else if(name === "tellers") num = this.state.tellersPage;
    if(0 < num-1) {
      this.setPage(name, num-1);
    }
  }

  genUsersTable(pageIdx, selectedDict, name) {
    let rows = [];
    for(let i = 0;i < tableRows;i++) {
      let row = [];
      for(let j = 0;j < tableCols;j++) {
        let userIdx = (pageIdx-1)*(tableRows*tableCols) + i*tableCols + j;
        let user = this.users[userIdx];
        if(userIdx < this.users.length) {
          row.push(
            <Table.Cell 
              key={name+user.email} 
              positive={selectedDict[user.email]} 
              style={{cursor: "pointer"}}
              onClick={e => this.handleUserClicked(user.email, selectedDict)}
            >
              <Header as='h4' color={selectedDict[user.email]?"green":"black"}>
                <Header.Content>
                  {user.name}
                  <Header.Subheader>{user.email}</Header.Subheader>
                </Header.Content>
              </Header>
            </Table.Cell>
          )
        }
        else {
          row.push(
            <Table.Cell key={"nullcell"+(i*tableCols+j).toString()}>
              <Header as='h4'><Header.Content><Header.Subheader></Header.Subheader></Header.Content></Header>
            </Table.Cell>
          )
        }
      }
      rows.push(
        <Table.Row key={name+i.toString()}>
          {row}
        </Table.Row>
      )
    }
    return (
      <Table fixed celled>
        <Table.Body>
          {rows}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              <Menu size="mini" floated='right' pagination>
                <Menu.Item as='a' onClick={_ => this.prevPage(name)} icon>
                  <Icon name='chevron left' />
                </Menu.Item>
                {[...Array(Math.ceil(this.users.length / (tableCols*tableRows))).keys()].map(page => {
                  return (
                    <Menu.Item key={name+"page"+(page+1).toString()} onClick={_ => this.setPage(name, page+1)} as='a'>
                      {page+1}
                    </Menu.Item>
                  )
                })}
                <Menu.Item as='a' onClick={_ => this.nextPage(name)} icon>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }

  onSubmit(e) {
    this.setState({createState: BUSY});
    console.log("State: isbusy", this.state.createState);
    e.preventDefault();
    const [title, description] = [this.title, this.description];
    const [begin, end] =  [Date.parse(this.beginDate + " " + this.beginTime)/1000, Date.parse(this.endDate + " " + this.endTime)/1000];
    const choices = this.state.choices;
    let [voters, tellers] = [[], []];
    for(let [user, selected] of Object.entries(this.state.voters)) {
      if(selected) voters.push(user);
    }
    for(let [user, selected] of Object.entries(this.state.tellers)) {
      if(selected) tellers.push(user);
    }

    const onHash = hash => {
      const link = "https://ropsten.etherscan.io/tx/"+hash;
      this.setState(state => {
        console.log("Got hash", hash);
        state.createState = IDLE;
        state.msg = (
          <React.Fragment>
            <Icon name='circle notched' loading />
            <Message.Content>
              <Message.Header>Transaction Processing</Message.Header>
              Check your transaction <a href={link} target="_blank" rel="noopener noreferrer">here</a>
            </Message.Content>
          </React.Fragment>
        )
        return state;
      })
    }

    const onConfirmed = (confirmationNumber, receipt) => {
      const link = "/elections"
      this.setState(state => {
        state.createState = IDLE;
        state.msg = (
          <React.Fragment>
            <Icon name="check" />
            <Message.Content>
              <Message.Header>Creation Success!</Message.Header>
              Check your election <Link to={link}>here</Link>
            </Message.Content>
          </React.Fragment>
        );
        return state;
      })
    }
    
    createElection(title, description, begin, end, choices, onHash, onConfirmed);
  }

  render() {
    return (
      <Grid textAlign="center" style={{marginTop: "2vh"}}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as='h2' icon textAlign='center'>
            <Icon name='plus' circular />
            <Header.Content>Create Election</Header.Content>
          </Header>
          <Form onSubmit={e => this.onSubmit(e)} loading={this.state.createState === BUSY}>
            <Form.Field>
              <label>Title</label>
              <Form.Input type="text" required={true} placeholder="e.g. My Cool Election" id="title" onChange={e => { this.title = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <Form.Input type="textarea" required={true} placeholder="Add some description..." control={TextArea} id="description" onChange={e => { this.description = e.target.value }} />
            </Form.Field>
            <Form.Field>
              <label>Time Range</label>
              <Form.Group widths="equal">
                <Form.Input type="date" required={true} id="dateBegin" onChange={e => { this.beginDate = e.target.value }} />
                <Form.Input type="time" required={true} id="timeBegin" onChange={e => { this.beginTime = e.target.value }} />
              </Form.Group>
              <label style={{textDecoration: "none", marginBottom: "1em"}}>to</label>
              <Form.Group widths="equal">
                <Form.Input type="date" required={true} id="dateEnd" onChange={e => { this.endDate = e.target.value }} />
                <Form.Input type="time" required={true} id="timeEnd" onChange={e => { this.endTime = e.target.value }} />
              </Form.Group>
            </Form.Field>
            <Form.Field>
              <label>Choices</label>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center" collapsing>Id</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" colSpan={2}>Name</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {this.state.choices.map((choice, id) => {
                  return (
                    <Table.Row key={"row"+id.toString()}>
                      <Table.Cell collapsing verticalAlign="middle">{(id+1).toString()}</Table.Cell>
                      <Table.Cell>
                        <Input value={this.state.choices[id]} onChange={e => {
                          const text = e.target.value;
                          this.setState(state => {
                            state.choices[id] = text;
                            return state;
                          })
                        }} />
                      </Table.Cell>
                      <Table.Cell verticalAlign="middle" collapsing>
                        <Icon name="close" style={{cursor: "pointer"}} onClick={_ => {
                          this.setState(state => {
                            state.choices.splice(id, 1);
                            return state;
                          })
                        }} />
                      </Table.Cell>
                    </Table.Row>
                  );})}
                </Table.Body>
                
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center" colSpan={3} style={{cursor: "pointer"}} onClick={_ => {
                      this.setState(state => {
                        state.choices.push("");
                        return state;
                      })
                    }}>
                      <Icon name="plus" />Add Choice
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Form.Field>
            <Form.Field>
              <label>Voters</label>
              {this.state.usersState === IDLE?this.genUsersTable(this.state.votersPage, this.state.voters, "voters"):<Loader>Loading</Loader>}
            </Form.Field>
            <Form.Field>
              <label>Tellers</label>
              {this.state.usersState === IDLE?this.genUsersTable(this.state.tellersPage, this.state.tellers, "tellers"):<Loader>Loading</Loader>}
            </Form.Field>
            {this.state.err
              ?
              <Message negative>{this.state.err}</Message>
              :
              null
            }
            {this.state.msg
              ?
              <Message positive icon>{this.state.msg}</Message>
              :
              null
            }
            <Button color="green" type="submit">
              Create
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default CreateElection;