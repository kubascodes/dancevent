import React, { Component } from "react";
import { Route, Link, BrowserRouter } from "react-router-dom";
import NavBar from "./components/parts/NavBar";
import Homepage from "./components/Homepage";
import Events from "./components/Events";
import Event from "./components/Event";
/*import RegistrationForm from './components/forms/RegistrationForm';*/
import RegistrationFormDancer from "./components/forms/RegistrationFormDancer";
import RegistrationFormOrganizer from "./components/forms/RegistrationFormOrganizer";
import Profile from "./components/pages/Profile";
import LoginForm from "./components/forms/LoginForm";
import FindDancePartnerView from "./components/forms/FindDancePartnerView";
import EventCreationForm from "./components/forms/EventCreationForm";
import MyEvents from "./components/parts/MyEvents";
import CreateRequest from "./components/forms/CreateRequest";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret_token: null,
      login: false,
      email: null,
      name: null,
      userType: null,
      profilePicture: null, //TODO
      savedEvents: [],
      organizedEvents: [],
    };
  }

  addUser = (User) => {
    console.log(User);
  };

  updateUser = (User) => {
    console.log(User);
  };
  deleteUser = (User) => {
    console.log(User);
  };

  fetchUserEvents = () => {
    var context = this;
    // Fetch events the user is intereste in and/or organizes
    // Ideally the get /profile route would fetch it all so we just need one request
    fetch("/profile/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then((res) => {
        console.log(res);
        context.setState({ savedEvents: res.interestedInEvents });
        if (res.userType === "Organizer") {
          context.setState({ organizedEvents: res.organizedEvents });
        }
      })
      .catch((err) => alert(err));
  };

  // Fetches the user data that did not come with the login as the login just retrieves email and token
  getUserData = () => {
    // Fetch standard user info
    var context = this;
    fetch("/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then(function (res) {
        context.setState({
          secret_token: window.sessionStorage.secret_token,
          login: true,
          email: res.email,
          name: res.name,
          userType: res.userType,
          profilePicture: res.picture,
        });
      })
      .catch((err) => alert(err));

    this.fetchUserEvents();
  };

  logIn = (data) => {
    this.setState({
      secret_token: data.secret_token,
      email: data.email,
      login: data.login,
      name: data.name,
      userType: data.userType,
      profilePicture: data.profilePicture,
    });
    //add secret token to session storage
    window.sessionStorage.setItem("secret_token", data.secret_token);
    this.fetchUserEvents();
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
    var component_scope = this;

    component_scope.setState({
      organizedEvents: component_scope.state.organizedEvents.filter(
        (organizedEvent) => organizedEvent._id !== event._id
      ),
      savedEvents: component_scope.state.savedEvents.filter(
        (savedEvent) => savedEvent._id !== event._id
      ),
    });
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

  // Propagated up from the EventCard
  saveEvent = (event) => {
    var component_scope = this;
    component_scope.setState(
      {
        savedEvents: [...component_scope.state.savedEvents, event],
      },
      () => {
        // Push that new state to the backend
        fetch("/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + window.sessionStorage.secret_token,
          },
          body: JSON.stringify([
            {
              propName: "interestedInEvents",
              value: component_scope.state.savedEvents,
            },
          ]),
        })
          .then((res) => res.json(res))
          .catch((err) => console.log(err));
      }
    );
  };

  // Propagated up from the EventCard
  unsaveEvent = (event) => {
    var component_scope = this;
    component_scope.setState(
      {
        savedEvents: component_scope.state.savedEvents.filter(
          (item) => item._id !== event._id
        ),
      },
      () => {
        // Push that new state to the backend
        fetch("/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + window.sessionStorage.secret_token,
          },
          body: JSON.stringify([
            {
              propName: "interestedInEvents",
              value: component_scope.state.savedEvents,
            },
          ]),
        })
          .then((res) => res.json(res))
          .catch((err) => console.log(err));
      }
    );
  };

  componentDidMount = () => {
    // Otherwise each time App.js is re-rendered the state is set to the default values
    if (!!window.sessionStorage.secret_token) {
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
                onSaveEvent={this.saveEvent}
                onUnsaveEvent={this.unsaveEvent}
              />
            )}
          />
          <Route
            path="/register/organizer"
            render={(props) => (
              <RegistrationFormOrganizer
                {...props}
                logIn={this.logIn}
                state={this.state}
              />
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
              <RegistrationFormDancer
                {...props}
                logIn={this.logIn}
                state={this.state}
              />
            )}
          />

          <Route
            exact
            path="/login"
            render={(props) => <LoginForm {...props} logIn={this.logIn} />}
          />

          <Route
            exact
            path="/events"
            render={(props) => (
              <Events
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
                onSaveEvent={this.saveEvent}
                onUnsaveEvent={this.unsaveEvent}
              />
            )}
          />
          <Route
            path="/events/single/:id"
            render={(props) => (
              <Event
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
                onSaveEvent={this.saveEvent}
                onUnsaveEvent={this.unsaveEvent}
              />
            )}
          />

          <Route
            exact
            path="/dancepartner"
            render={(props) => (
              <FindDancePartnerView {...props} auth_token={this.secret_token} />
            )}
          />
          <Route
            exact
            path="/events/create"
            render={(props) => (
              <EventCreationForm {...props} auth_token={this.secret_token} />
            )}
          />
          <Route
            path="/events/update/:id"
            render={(props) => (
              <EventCreationForm
                update
                {...props}
                auth_token={this.secret_token}
              />
            )}
          />
          <Route
            path="/myevents"
            render={(props) => (
              <MyEvents
                {...props}
                state={this.state}
                onDeleteEvent={this.deleteEvent}
                onSaveEvent={this.saveEvent}
                onUnsaveEvent={this.unsaveEvent}
              />
            )}
          />
          <Route
            exact
            path="/createrequest"
            render={(props) => (
              <CreateRequest {...props} auth_token={this.secret_token} />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}
