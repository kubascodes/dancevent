import React from "react";
import { Link, Redirect } from "react-router-dom";
//import HomepageBanner from "./HomepageBanner";
import EventCard from "./EventCard";
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

class EventCardDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsShortened: [],
      redirect: null,
    };
  }

  convertStringToDate = (events) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert the startDate-String for each event into an actual Date object
        events.forEach((event) => {
          event.startDate = new Date(event.startDate);
        });
        resolve(events);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Filter the received savedEvents and organizedEvents to only show upcoming ones
  handleEventsToDisplay = (events) => {
    const now = new Date();
    return new Promise((resolve, reject) => {
      try {
        this.convertStringToDate(events).then((convertedEvents) => {
          let eventsToDisplay = convertedEvents.filter(
            (convertedEvent) => convertedEvent.startDate > now
          );
          eventsToDisplay.sort((a, b) =>
            a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
          );

          // Only 3 events are displayed on the homepage
          eventsToDisplay.length = Math.min(
            eventsToDisplay.length,
            parseInt(this.props.limit)
          );
          resolve(eventsToDisplay);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  componentDidMount = () => {
    if (this.props.events.length > 0) {
      this.handleEventsToDisplay(this.props.events).then((eventsToDisplay) =>
        this.setState({
          eventsShortened: eventsToDisplay,
        })
      );
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      if (prevProps.state.events !== this.props.events) {
        this.handleEventsToDisplay(this.props.events).then(
          (eventsToDisplay) => {
            this.setState({
              eventsShortened: eventsToDisplay,
            });
          }
        );
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    if (window.sessionStorage.secret_token != null) {
      /*Display personalized content when logged in*/
      return (
        <div className="row justify-content-start">
          {this.state.eventsShortened.map((event) => {
            return (
              <EventCard
                key={event._id}
                event={event}
                state={this.props.state}
                onDeleteEvent={() => this.props.onDeleteEvent(event)}
                onSaveEvent={() => {
                  this.props.onSaveEvent(event);
                }}
                onUnsaveEvent={() => this.props.onUnsaveEvent(event)}
              />
            );
          })}
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default EventCardDeck;
