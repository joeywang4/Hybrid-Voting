import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon, Loader, Table } from 'semantic-ui-react';
import {BACKEND_URL} from '../../const_val';

const [FAILED, SUCCESS, LOADING] = [0, 1, 2];

class Solved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING
    }
    this.solved = [];
    this.findSolved(this.props.solver);
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      })
    }
  }

  findSolved(solver) {
    fetch(BACKEND_URL+`/records?solver=${solver}`)
    .then(res => {
      if(res.status !== 200) {
        this.setStatus(FAILED);
      }
      else{
        res.json()
        .then(data => {
          this.solved = data;
          this.setStatus(SUCCESS);
        })
      }
    })
    .catch(err => {this.setStatus(FAILED); console.error(err)});
  }

  convertTime = millis => {
    const d = new Date(millis);
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

  render() {
    return (
      <Container>
        <div style={{marginTop: "2vh"}} />
        {
          this.state.status === LOADING
          ?
            <Loader active content="Loading..." />
          :
            this.state.status === FAILED
            ?
              <Header icon>
                <Icon name="bug" />
                <div style={{marginTop: "2vh"}} />
                看來出了點差錯，請您再試一次。
              </Header>
            :
              this.solved.length === 0
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
                        ["Score", "Challenge", "Solved Time"].map(_col => {
                          return <Table.HeaderCell textAlign="center" key={_col}>{_col}</Table.HeaderCell>
                        })
                      }
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      this.solved.map(record => {
                        return (
                          <Table.Row key={record.challenge._id}>
                            <Table.Cell>
                              <Header as="h3" textAlign="center">{record.challenge.score}</Header>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Link to={`/challenge?id=${record.challenge._id}`}>
                                {record.challenge.name}
                              </Link>
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

export default Solved;