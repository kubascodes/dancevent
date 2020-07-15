import React from 'react';
//authentication component
import RouteAuthentication from '../../services/RouteAuthentication';
//events components
import MyEventsProfile from "../parts/MyEventsProfile";
// request component
import MyRequests from "../forms/MyRequests";
//moment
import moment from 'moment';
//icons
import { MdMailOutline, MdLocationOn, MdPhone, MdLockOutline, MdFavorite, MdFace, MdStarHalf } from "react-icons/md";
//profile avatar
import { createAvatarComponent, SrcSource } from 'react-avatar';
const Avatar = createAvatarComponent({ sources: [SrcSource]});


class Profile extends React.Component {

  // this constructor needs care. Session state should be inherited from parent.
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loaded: false,
      requests: null,
      events: null
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
      context.setState({user: res.user, events: res.events, requests: res.requests});
      context.setState({loaded: true});
    })
    .catch(err => alert(err));
  }

  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function(string) {
    return string.toUpperCase();
    });
    return capitalStr;
  }

  render() {

    if (this.state.loaded) {

      if (this.state.user.userType === "Dancer") {
        return (

          <div className="container d-flex flex-wrap flex-column">

          <Avatar round="50%" size="150" src={this.state.user.picture} name={this.state.name} className="img-fluid align-self-center mt-1 mb-3"/>
          <h5 className="mt-2 align-self-center">{this.capitalize(this.state.user.name)}</h5>


          <div className="d-flex align-self-center">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <h6 className="ml-3 d-inline-flex align-self-center"><MdFace/></h6>
              <h6 className="ml-1 d-inline-flex align-self-center">{moment().diff(moment(this.state.user.yearOfBirth, 'YYYY').startOf(), 'years')} years</h6>
              <h6 className="ml-3"><MdLocationOn/></h6>
              <h6 className="ml-1"> {this.state.user.city}</h6>
              <h6 className="ml-3 d-inline-flex justify-content-center"><MdMailOutline/></h6>
              <h6 className="ml-1">{this.state.user.email}</h6>
              <h6 className="ml-3 d-inline-flex justify-content-center"><MdStarHalf/></h6>
              <h6 className="ml-1">{this.state.user.proficiencyLevel}</h6>
            </div>
          </div>

          <div className="d-flex align-self-center">
            <div className="d-flex flex-row align-items-center justify-content-center">
            <MdFavorite className="mr-1" /> {this.state.user.listOfDanceStyles.map((danceStyle) => ( <span className="mr-1 badge border-pink">{this.capitalize(danceStyle)}</span> ))}
            </div>
          </div>

          <div>
          <MyEventsProfile props={this.props} state={this.state} />
          </div>
        

          </div>


          )
      }

      else if (this.state.user.userType === "Organizer") {
        return (

          <div className="container d-flex flex-wrap flex-column">
            <div className="crop-box crop-to-fit">
              <Avatar round="50%" size="150" src={this.state.user.picture} name={this.state.name} className="align-self-center mt-1 mb-3" id="crop-avatar"/>
            </div>
          <h5 className="mt-2 align-self-center">{this.capitalize(this.state.user.name)}</h5>


          <p className="text-center profile-margin">
          {this.state.user.description}
          </p>

          <div className="d-flex align-self-center">
            <div className="d-flex flex-row">
              <h6 className=""><MdLocationOn/></h6>
              <h6 className="ml-1">{this.state.user.street} {this.state.user.city}</h6>
              <h6 className="ml-3"><MdMailOutline/></h6>
              <h6 className="ml-1">{this.state.user.publicEmail}</h6>
              <h6 className="ml-3"><MdPhone/></h6>
              <h6 className="ml-1">{this.state.user.phone}</h6>
            </div>
          </div>

          <hr></hr>

          <MyEventsProfile props={this.props} state={this.state} />

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
