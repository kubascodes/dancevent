import React, { Component } from 'react';
import NavBar from './components/NavBar';
import Homepage from './components/Homepage';
/*import RegistrationForm from './components/forms/RegistrationForm';*/
import RegistrationFormDancer from './components/forms/RegistrationFormDancer';
import FindDancePartnerForm from './components/forms/FindDancePartnerView';
import RegistrationFormOrganizer from './components/forms/RegistrationFormOrganizer';
import LoginForm from './components/forms/LoginForm';
import { Route, Link, BrowserRouter } from 'react-router-dom';

export default class App extends Component {

  state = {
    users: [],
    secret_token: null,
    login: false,
    username: ''
  }

  addUser = (User) => {
    console.log(User);
  }

  updateUser = (User) => {
    console.log(User);
  }
  deleteUser = (User) => {
    console.log(User);
  }
  /*
  componentDidMount() {
    if (window.sessionStorage.secret_token) {
      this.setState({
        login: true,
        username: null,
        secret_token: window.sessionStorage.secret_token,
      })
    }
    else {
      this.setState({
        login: false,
        username: null,
        secret_token: null
      })
    }
  }
  */

  auth_token = (data) => {
    this.setState({
      secret_token: data
    });
    console.log(this.state);
    console.log("main state");
  }

  render() {
    return (
          <BrowserRouter>
          <NavBar state={this.state}/>
          <div className="container-fluid mt-4 mb-4">
          <Route exact path='/'render={(props) => <Homepage {...props} state={this.state} auth_token={this.auth_token} secret_token={this.state.secret_token} />} />
          <Route path='/register/organizer'render={(props) => <RegistrationFormOrganizer {...props} auth_token={this.secret_token} />} />
          <Route exact path='/register/dancer'render={(props) => <RegistrationFormDancer {...props} auth_token={this.secret_token} />} />
          {/*<Route exact path='/register'render={(props) => <RegistrationForm {...props} auth_token={this.secret_token} />} />*/}
          <Route path='/login'render={(props) => <LoginForm {...props} auth_token={this.auth_token} />} />
          <Route exact path='/dancepartner'render={(props) => <FindDancePartnerForm {...props} auth_token={this.secret_token} />} />
          </div>
          </BrowserRouter>



    );
  }
}
