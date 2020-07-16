import React from "react";
import { Link } from "react-router-dom";
import EventCardDeck from "./EventCardDeck";
import RequestCardDeck from "./RequestCardDeck";
import Button from "react-bootstrap/Button";
import moment from 'moment';
import { MdMailOutline, MdLocationOn, MdPhone, MdLockOutline, MdFavorite, MdFace, MdStarHalf, MdEvent, MdCreditCard } from "react-icons/md";
//profile avatar
import { createAvatarComponent, SrcSource } from 'react-avatar';
const Avatar = createAvatarComponent({ sources: [SrcSource]});


const ProfileDancer = ({state}) => {


  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function(string) {
    return string.toUpperCase();
    });
    return capitalStr;
  }



        return (
          <div className="container d-flex flex-wrap flex-column">

          <Avatar round="50%" size="150" src={state.user.picture} name={state.name} className="img-fluid align-self-center mt-1 mb-3"/>
          <h5 className="mt-2 align-self-center">{capitalize(state.user.name)}</h5>


          <div className="d-flex align-self-center">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <h6 className="ml-3 d-inline-flex align-self-center"><MdFace/></h6>
              <h6 className="ml-1 d-inline-flex align-self-center">{moment().diff(moment(state.user.yearOfBirth, 'YYYY').startOf(), 'years')} years</h6>
              <h6 className="ml-3"><MdLocationOn/></h6>
              <h6 className="ml-1"> {state.user.city}</h6>
              <h6 className="ml-3 d-inline-flex justify-content-center"><MdMailOutline/></h6>
              <h6 className="ml-1">{state.user.email}</h6>
              <h6 className="ml-3 d-inline-flex justify-content-center"><MdStarHalf/></h6>
              <h6 className="ml-1">{state.user.proficiencyLevel}</h6>
            </div>
          </div>

          <div className="d-flex align-self-center">
            <div className="d-flex flex-row align-items-center justify-content-center">
            <MdFavorite className="mr-1" /> {state.user.listOfDanceStyles.map((danceStyle) => ( <span className="mr-1 badge border-pink">{this.capitalize(danceStyle)}</span> ))}
            </div>
          </div>

            <div>

              <h5 className="text-center mt-2">
              <Link
                className="font-weight-bolder text-body text-decoration-none"
                to="/myevents"
              >Your Saved Events </Link>
              </h5>

              <EventCardDeck state={state} />

              <h5 className="text-center mt-2">
              <Link
                className="font-weight-bolder text-body text-decoration-none"
                to="/myrequests"
              >Your Partner Requests</Link>
              </h5>

              <RequestCardDeck state={state} />

            </div>
          </div>

        )
}
export default ProfileDancer;
