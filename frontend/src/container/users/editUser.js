import React from 'react';
import { Button, Form, Message, Divider, Header, Icon, Grid } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import {BACKEND_URL} from '../../config';

const [FAILED, SUCCESS, LOADING, NAMEERROR, PWDERROR, WAITING] = [0, 1, 2, 3, 4, 5];

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: WAITING,
      redirect: false,
      nameErrorHeader: "",
      nameErrorContent: "",
      pwdErrorHeader: "",
      pwdErrorContent: ""
    }
    this.name = "";
    this.oldPwd = "";
    this.newPwd = "";
    this.newPwd2 = "";
    //this.getUser();
  }

  setStatus(_status) {
    if(this.state.status !== _status) {
      this.setState(state => {
        state.status = _status;
        return state;
      })
    }
  }

  onInputChange = e => {
    this.setStatus(WAITING);
    if(e.target.id === "name") this.name = e.target.value;
    else if(e.target.id === "oldPwd") this.oldPwd = e.target.value;
    else if(e.target.id === "newPwd") this.newPwd = e.target.value;
    else if(e.target.id === "newPwd2") this.newPwd2 = e.target.value;
  }

  onFormSubmit = e => {
    e.preventDefault();
    if(this.oldPwd.length !== 0 || this.newPwd.length !== 0 || this.newPwd2.length !== 0) {
      if(this.oldPwd.length === 0 || this.newPwd.length === 0 || this.newPwd2.length === 0) {
        this.setState(state => {
          state.status = PWDERROR;
          state.pwdErrorHeader = "修改密碼錯誤";
          state.pwdErrorContent = "欄位不得為空";
          return state;
        })
        return false;
      }
      if(this.newPwd !== this.newPwd2) {
        this.setState(state => {
          state.status = PWDERROR;
          state.pwdErrorHeader = "修改密碼錯誤";
          state.pwdErrorContent = "新密碼輸入不一致";
          return state;
        })
        return false;
      }
    }
    else if(this.name.length === 0) {
      this.setState(state => {
        state.status = PWDERROR;
        state.pwdErrorHeader = "修改資料錯誤";
        state.pwdErrorContent = "欄位不得為空";
        return state;
      })
      return false;
    }
    this.updateUser();
  }

  updateUser() {
    this.setStatus(LOADING);
    fetch(BACKEND_URL+`/auth/update`, {
      method: "POST",
      body: JSON.stringify({name: this.name, oldPwd: this.oldPwd, newPwd: this.newPwd}),
      headers: new Headers({
        'authorization': localStorage['token'],
        'content-type': "application/json"
      })
    })
    .then(res => {
      if(res.status === 401) {
        res.text()
        .then(text => {
          if(text === "Not logged in") {
            this.setStatus(FAILED);
          }
          else {
            this.setState(state => {
              state.status = PWDERROR;
              state.pwdErrorHeader = "修改密碼錯誤";
              state.pwdErrorContent = "舊密碼錯誤";
              return state;
            })
          }
        })
      }
      else if(res.status === 400) {
        res.text()
        .then(text => {
          if(text === "User exists") {
            this.setState(state => {
              state.status = NAMEERROR;
              state.nameErrorHeader = "修改名稱失敗";
              state.nameErrorContent = "此使用者名稱已被使用";
              return state;
            })
          }
          else {
            this.setState(state => {
              state.status = PWDERROR;
              state.pwdErrorHeader = "修改失敗";
              state.pwdErrorContent = "輸入資料有誤";
              return state;
            })
          }
        })
      }
      else if(res.status !== 200) {
        this.setStatus(FAILED);
      }
      else{
        this.setStatus(SUCCESS);
        if(localStorage['token']) localStorage.removeItem('token');
        if(localStorage['name']) localStorage.removeItem('name');
        if(localStorage['email']) localStorage.removeItem('email');
        window.setTimeout(() => {
          this.setState(state => {
            state.redirect = true;
            return state;
          })
        }, 1000);
      }
    })
    .catch(err => {this.setStatus(FAILED); console.error(err)});
  }

  render() {
    if(this.state.status === FAILED){
      return (
        <Header icon>
          <Icon name="bug" />
          <div style={{marginTop: "2vh"}} />
          看來出了點差錯，請您再試一次
        </Header>
      )
    }

    return (
      <Grid
        textAlign='center'
      >
        <Grid.Column
          style={{ maxWidth: "30vw" }}
        >
          <Form
            success={this.state.status === SUCCESS}
            loading={this.state.status === LOADING}
            error={this.state.status === NAMEERROR || this.state.status === PWDERROR}
            onSubmit={this.onFormSubmit}
          >
            <Form.Input id="name" onChange={this.onInputChange} label="Update Name" placeholder="New Name" />
            {
              this.state.status === NAMEERROR
              ?
                <Message
                  error
                  header={this.state.nameErrorHeader}
                  content={this.state.nameErrorContent}
                />
              :null
            }
            <Divider horizontal>
              <Header size="tiny" content="OR Update Password" />
            </Divider>
            <Form.Input id="oldPwd" onChange={this.onInputChange} type="password" label="Old Password" placeholder="Your Password" />
            <Form.Input id="newPwd" onChange={this.onInputChange} type="password" label="New Password" placeholder="New Password" />
            <Form.Input id="newPwd2" onChange={this.onInputChange} type="password" label="Confirm Password" placeholder="Confirm Password" />
            {
              this.state.status === PWDERROR
              ?
                <Message
                  error
                  header={this.state.pwdErrorHeader}
                  content={this.state.pwdErrorContent}
                />
              :null
            }
            {
              this.state.status === SUCCESS
              ?
                <Message
                  success
                  header="修改成功！"
                  content="資料修改成功，請重新登入"
                />
              :
                null
            }
            {
              this.state.redirect
              ?
                <Redirect to="/redirect/login" />
              :
                null
            }
            <Button>Submit</Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default EditUser;
