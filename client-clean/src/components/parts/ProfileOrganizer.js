import React from "react";
import { Link } from "react-router-dom";
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

const ProfileOrganizer = (props) => {
  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  return (
    <div className="container d-flex flex-wrap flex-column">
      <Link to={{ pathname: '/edit/organizer', state: props.state.user }} style={{textDecoration: "none"}}>
      <Button variant="outline-dark" className="d-flex ml-auto">Edit
      </Button>
      </Link>

      <div className="crop-box crop-to-fit">
        <Avatar
          round="50%"
          size="150"
          src={props.state.user.picture}
          name={props.state.name}
          className="align-self-center mt-1 mb-3"
          id="crop-avatar"
        />
      </div>
      <h5 className="mt-2 align-self-center">
        {capitalize(props.state.user.name)}
      </h5>

      <p className="text-center profile-margin">
        {props.state.user.description}
      </p>

      <div className="d-flex align-self-center">
        <div className="d-flex flex-row">
          <h6 className="">
            <MdLocationOn />
          </h6>
          <h6 className="ml-1">
            {props.state.user.street}, {props.state.user.city}
          </h6>
          <h6 className="ml-3">
            <MdMailOutline />
          </h6>
          <h6 className="ml-1">{props.state.user.publicEmail}</h6>
          <h6 className="ml-3">
            <MdPhone />
          </h6>
          <h6 className="ml-1">{props.state.user.phone}</h6>
        </div>
      </div>

      <div>
        <h5 className="text-center mt-2">
          <Link
            className="font-weight-bolder text-body text-decoration-none"
            to="/myevents"
          >
            Your Hosted Events
          </Link>
        </h5>

        <EventCardDeck
          events={props.stateProps.organizedEvents}
          limit="5"
          state={props.stateProps}
          onDeleteEvent={(event) => props.onDeleteEvent(event)}
          onSaveEvent={(event) => {
            console.log(event);
            props.onSaveEvent(event);
          }}
          onUnsaveEvent={(event) => props.onUnsaveEvent(event)}
        />
        {/**
        <EventCardDeckOld state={state} />
*/}
      </div>
    </div>
  );
};
export default ProfileOrganizer;
