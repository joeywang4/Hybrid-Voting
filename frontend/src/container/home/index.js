import React from 'react';
import { Container, Header, Icon, Divider, Message } from 'semantic-ui-react';

class Home extends React.Component {
  render() {
    return (
      <Container>
        <div style={{marginTop: '2vh'}} />
        <Header as='h2' icon textAlign='center'>
          <Icon name='info' circular />
          <Header.Content>Information</Header.Content>
        </Header>
        <Divider />
        <div>
          {
            [
              "歡迎光臨"
            ].map(msg => {
              return <Message floating key={msg}>{msg}</Message>
            })
          }
        </div>
      </Container>
    );
  }
}

export default Home