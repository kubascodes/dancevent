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
import MyEvents from "./components/MyEvents";

export default class App extends Component {
  state = {
    secret_token: null,
    login: false,
    email: null,
    name: null,
    userType: null,
    profilePicture: null, //TODO
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

  // Fetches the user data that did not come with the login as the login just retrieves email and token
  getUserData = () => {
    var component_scope = this;
    fetch("/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then(function (res) {
        console.log(res);
        component_scope.setState({
          secret_token: window.sessionStorage.secret_token,
          login: true,
          email: res.email,
          name: res.name,
          userType: res.userType,
          profilePicture: res.picture,
        });
      })
      .catch((err) => alert(err));
  };

  logIn = (data) => {
    this.getUserData();
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
  };

  // Propagated up from the EventCard
  deleteEvent = (event) => {
    // Delete the event from the backend
    fetch(`/events/${event._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    // Otherwise each time App.js is re-rendered the state is set to the default values
    if (window.sessionStorage.secret_token != null) {
      this.getUserData();
    }
  };

  render() {
    return (
      <BrowserRouter>
        <NavBar state={this.state} logOut={this.logOut} />
        <div className="container-fluid mt-4 mb-4">
          <Route
            exact
            path="/"
            render={(props) => (
              <Homepage
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
              />
            )}
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
            render={(props) => (
              <Events
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
              />
            )}
          />
          <Route
            path="/events/:id"
            render={(props) => <Event {...props} state={this.state} />}
          />
          <Route
            exact
            path="/dancepartner"
            render={(props) => (
              <FindDancePartnerView {...props} auth_token={this.secret_token} />
            )}
          />
          <Route
            path="/myevents"
            render={(props) => (
              <MyEvents
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}
