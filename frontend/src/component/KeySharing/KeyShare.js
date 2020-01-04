import React from 'react'
import { Loader, Header, Icon } from 'semantic-ui-react'
import {BACKEND_URL} from '../../const_val';

// Stages
const [GEN_POINTS, CALC_N, CALC_V, PUBLISH_SECRET] = [0, 1, 2, 3];
const [LOADING, SUCCESS, ERROR] = [0, 1, 2];

class KeyShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: LOADING,
      stage: -1
    }
    fetch(BACKEND_URL+"/getKeySharing?electionID="+this.props.electionID)
    .then(res => {
      if(res.status === 200) {
        res.json()
        .then(data => {
          state.stage = data.stage;
          this.setState(state => {
            state.status = SUCCESS;
            return state;
          })
        })
      }
    });
  }

  render() {
    if(this.state.status === LOADING) {
      return (
        <Loader>Loading</Loader>
      )
    }

    const errMsg = (
      <Header icon>
        <Icon name="bug" />
        <div style={{marginTop: "2vh"}} />
        看來出了點差錯，請您再試一次
      </Header>
    );
    
    if(this.state.status === SUCCESS) {
      if(this.state.stage === GEN_POINTS) return <div></div>;
      else if(this.state.stage === CALC_N) return <div></div>;
      else if(this.state.stage === CALC_V) return <div></div>;
      else if(this.state.stage === PUBLISH_SECRET) return <div></div>;
      else {
        console.log("Key Sharing Stage ERROR!");
        return errMsg;
      }
    }

    return errMsg;
  }
}

export default KeyShare;