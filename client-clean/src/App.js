import React, { Component } from "react";
import { Route, Link, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Homepage from "./components/Homepage";
import Events from "./components/Events";
import Event from "./components/Event";
/*import RegistrationForm from './components/forms/RegistrationForm';*/
import RegistrationFormDancer from "./components/forms/RegistrationFormDancer";
import RegistrationFormOrganizer from "./components/forms/RegistrationFormOrganizer";
import Profile from "./components/forms/Profile";
import LoginForm from "./components/forms/LoginForm";
import FindDancePartnerView from "./components/forms/FindDancePartnerView";

export default class App extends Component {
  state = {
    secret_token: null,
    login: false,
    email: null,
  };

  addUser = (User) => {
    console.log(User);
  };

  updateUser = (User) => {
    console.log(User);
  };
  deleteUser = (User) => {
    console.log(User);
  };

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

  logIn = (data) => {
    this.setState({
      secret_token: data.token,
      email: data.email,
      login: true,
    });
    console.log(this.state);
    console.log("main state");
  };

  logOut = (data) => {
    this.setState({
      secret_token: null,
      email: null,
      login: false,
    });
    window.sessionStorage.removeItem("secret_token");
    console.log(this.state);
    console.log("main state");
    console.log(window.sessionStorage.secret_token);
  };

  render() {
    return (
      <BrowserRouter>
        <NavBar state={this.state} logOut={this.logOut} />
        <div className="container-fluid mt-4 mb-4">
          <Route
            exact
            path="/"
            render={(props) => <Homepage {...props} state={this.state} />}
          />
          <Route
            path="/register/organizer"
            render={(props) => (
              <RegistrationFormOrganizer {...props} state={this.state} />
            )}
          />
          <Route
            path="/profile"
            render={(props) => <Profile {...props} state={this.state} />}
          />
          <Route
            exact
            path="/register/dancer"
            render={(props) => (
              <RegistrationFormDancer {...props} state={this.state} />
            )}
          />
          {/*<Route exact path='/register'render={(props) => <RegistrationForm {...props} auth_token={this.secret_token} />} />*/}
          <Route
            path="/login"
            render={(props) => (
              <LoginForm {...props} state={this.state} logIn={this.logIn} />
            )}
          />
          <Route
            exact
            path="/events"
            render={(props) => <Events {...props} state={this.state} />}
          />
          <Route
            path="/events/:eventId"
            render={(props) => <Event {...props} state={this.state} />}
          />
          <Route
            exact
            path="/dancepartner"
            render={(props) => (
              <FindDancePartnerView {...props} auth_token={this.secret_token} />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}
