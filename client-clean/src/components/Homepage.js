import React from "react";
import { Link, Redirect } from "react-router-dom";
import HomepageBanner from "./HomepageBanner";
import EventCard from "./parts/EventCard";
import EventCardDeck from "./parts/EventCardDeck";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    if (window.sessionStorage.secret_token != null) {
      /*Display personalized content when logged in*/
      return (
        <>
          <h1 className="text-center mb-4">
            Hi {this.props.state.name}, welcome to dancevent!
          </h1>
          <HomepageBanner userType={this.props.state.userType} />
          <hr />
          <div className="container">
            {this.props.state.userType === "Organizer" ? (
              <>
                <EventCardDeck
                  events={this.props.state.organizedEvents}
                  limit="3"
                  scope={["organized", "upcoming"]}
                  state={this.props.state}
                  onDeleteEvent={this.props.onDeleteEvent}
                  onSaveEvent={this.props.onSaveEvent}
                  onUnsaveEvent={this.props.onUnsaveEvent}
                />
              </>
            ) : (
              <></>
            )}
            <EventCardDeck
              events={this.props.state.savedEvents}
              limit="4"
              scope={["saved", "upcoming"]}
              state={this.props.state}
              onDeleteEvent={this.props.onDeleteEvent}
              onSaveEvent={this.props.onSaveEvent}
              onUnsaveEvent={this.props.onUnsaveEvent}
            />
            <div className="row justify-content-center">
              {this.props.state.savedEvents.length > 0 ? (
                <></>
              ) : (
                <div
                  className="btn button-pink"
                  size="md"
                  block
                  onClick={() => this.setState({ redirect: "/events" })}
                >
                  Nothing to see yet. Click here to search for events!
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else {
      /*Display public content not logged in*/
      return <HomepageBanner />;
    }
  }
}

export default Homepage;
