import React, { useState } from "react";
import { Link } from "react-router-dom";
//import EventCardDeckOld from "./EventCardDeckOld";
import EventCardDeck from "./EventCardDeck";
import RequestCardDeck from "./RequestCardDeck";
import Button from "react-bootstrap/Button";
import moment from "moment";
import {
  MdMailOutline,
  MdLocationOn,
  MdPhone,
  MdLockOutline,
  MdFavorite,
  MdFace,
  MdStarHalf,
  MdEvent,
  MdCreditCard,
} from "react-icons/md";
//profile avatar
import { createAvatarComponent, SrcSource, IconSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource, IconSource] });

const ProfileDancer = (props) => {
  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  return (
    <div className="container d-flex flex-wrap flex-column">

    <Link to={{ pathname: '/edit/dancer', state: props.state.user }} style={{textDecoration: "none"}}>
    <Button variant="outline-dark" className="d-flex ml-auto">Edit
    </Button>
    </Link>

      <Avatar
        round="50%"
        size="150"
        src={props.state.user.picture}
        name={props.state.name}
        className="img-fluid align-self-center mt-1 mb-3"
      />
      <h5 className="mt-2 align-self-center">
        {capitalize(props.state.user.name)}
      </h5>

      <div className="d-flex align-self-center">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <h6 className="ml-3 d-inline-flex align-self-center">
            <MdFace className="align-text-bottom" />
          </h6>
          <h6 className="ml-1 d-inline-flex align-self-center">
            {moment().diff(
              moment(props.state.user.yearOfBirth, "YYYY").startOf(),
              "years"
            )}{" "}
            years
          </h6>
          <h6 className="ml-3">
            <MdLocationOn className="align-text-bottom" />
          </h6>
          <h6 className="ml-1"> {props.state.user.city}</h6>
          <h6 className="ml-3 d-inline-flex justify-content-center">
            <MdMailOutline className="align-text-bottom" />
          </h6>
          <h6 className="ml-1">{props.state.user.email}</h6>
          <h6 className="ml-3 d-inline-flex justify-content-center">
            <MdStarHalf className="align-text-bottom" />
          </h6>
          <h6 className="ml-1">{props.state.user.proficiencyLevel}</h6>
        </div>
      </div>

      <div className="d-flex align-self-center">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <MdFavorite className="mr-1 align-text-bottom" />{" "}
          {props.state.user.listOfDanceStyles.map((danceStyle) => (
            <span className="mr-1 badge border-pink">
              {capitalize(danceStyle)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h5 className="text-center mt-2">
          <Link
            className="font-weight-bolder text-body text-decoration-none"
            to="/myevents"
          >
            Your Saved Events{" "}
          </Link>
        </h5>

        <EventCardDeck
          events={props.stateProps.savedEvents}
          limit="5"
          state={props.stateProps}
          onDeleteEvent={(event) => props.onDeleteEvent(event)}
          onSaveEvent={(event) => props.onSaveEvent(event)}
          onUnsaveEvent={(event) => props.onUnsaveEvent(event)}
        />
        {/**
        <EventCardDeckOld state={props.state} />
*/}
        <h5 className="text-center mt-2">
          <Link
            className="font-weight-bolder text-body text-decoration-none"
            to="/myrequests"
          >
            Your Partner Requests
          </Link>
        </h5>

        <RequestCardDeck state={props.state} />
      </div>
    </div>
  );
};
export default ProfileDancer;
