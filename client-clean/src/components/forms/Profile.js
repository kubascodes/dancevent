import React from 'react';
import { Redirect } from 'react-router-dom';
import RouteAuthentication from '../../services/RouteAuthentication';

//TODO we'd want to use composition to define forms
//1. Form Component
//2. Input Component
//3. Submit Btn Component

class Profile extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loaded: false,
    };
    this.getUserData(); //we call the server for user information

  }

  getUserData() {
    const context = this; //binding context to current this context
    fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + window.sessionStorage.secret_token
      }
    })
    .then(res => res.json(res))
    .then(function(res){
      console.log(res);
      context.setState({user: res});
      context.setState({loaded: true});
    })
    .catch(err => alert(err));

  }

  render() {

    if (this.state.loaded) {

      if (this.state.user.userType === "Dancer") {
        return (

          <div>
          <img width="42" height="42" src={this.state.user.picture} />
          <p>Name: {this.state.user.name}</p>
          <p>Email: {this.state.user.email}</p>
          <p>City: {this.state.user.city}</p>
          <p>Year Of Birth: {this.state.user.yearOfBirth}</p>
          <p>Proficiency Level: {this.state.user.proficiencyLevel}</p>
          <p>User Type: {this.state.user.userType}</p>
          <p>Events: {this.state.user.interestedInEvents}</p>
          <p>Dance Styles: {this.state.user.listOfDanceStyles}</p>
          </div>

          )
      }

      else if (this.state.user.userType === "Organizer") {
        return (

          <div>
          <img width="42" height="42" src={this.state.user.picture} />
          <p>Name: {this.state.user.name}</p>
          <p>Email: {this.state.user.email}</p>
          <p>Public Email: {this.state.user.publicEmail}</p>
          <p>Phone: {this.state.user.phone}</p>
          <p>Street: {this.state.user.street}</p>
          <p>City: {this.state.user.city}</p>
          <p>Year Of Birth: {this.state.user.yearOfBirth}</p>
          <p>User Type: {this.state.user.userType}</p>
          </div>

          )
      }


    }

    else {
      return (
        <div>
        <p>Loading...</p>
        </div>
      )
    }


  }

}

export default RouteAuthentication(Profile);
