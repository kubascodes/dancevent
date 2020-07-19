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
      showComponent: true,
      showExampleCard: false,
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
    var context = this;
    context.setState({ showExampleCard: false });
    const scope = this.props.scope; // Decide whether upcoming or past events are shown
    const now = new Date();
    return new Promise((resolve, reject) => {
      try {
        context.convertStringToDate(events).then((convertedEvents) => {
          let eventsToDisplay = [];
          if (scope.includes("past")) {
            eventsToDisplay = convertedEvents.filter(
              (convertedEvent) => convertedEvent.startDate < now
            );
            if (eventsToDisplay.length === 0) {
              context.setState({ showComponent: false });
            }
            eventsToDisplay.sort((a, b) =>
              a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0
            );
          } else {
            eventsToDisplay = convertedEvents.filter(
              (convertedEvent) => convertedEvent.startDate > now
            );
            eventsToDisplay.sort((a, b) =>
              a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
            );
            if (
              scope.includes("organized") &&
              scope.includes("upcoming") &&
              context.props.state.exampleEvent
            ) {
              console.log(context.props.state.exampleEvent);
              context.setState({ showExampleCard: true });
            }
          }

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

    if (
      window.sessionStorage.secret_token != null &&
      this.state.showComponent
    ) {
      /*Display personalized content when logged in*/
      return (
        <>
          <h4 className="text-center mt-4">
            {this.props.scope.includes("organized") &&
            this.props.scope.includes("upcoming") ? (
              <Link
                className="font-weight-bolder text-body text-decoration-none"
                to="/myevents"
              >
                Upcoming Events Hosted By You
              </Link>
            ) : this.props.scope.includes("organized") &&
              this.props.scope.includes("past") ? (
              "Past Events Hosted By You"
            ) : this.props.scope.includes("saved") &&
              this.props.scope.includes("upcoming") ? (
              <Link
                className="font-weight-bolder text-body text-decoration-none"
                to="/myevents"
              >
                {this.props.state.userType === "Organizer"
                  ? "Saved Upcoming Events"
                  : "Upcoming Events"}
              </Link>
            ) : this.props.state.userType === "Organizer" ? (
              "Saved Past Events"
            ) : (
              "Past Events"
            )}
          </h4>
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
                  isExample={false}
                />
              );
            })}
            {this.state.showExampleCard && this.props.state.exampleEvent ? (
              <EventCard
                event={this.props.state.exampleEvent}
                state={this.props.state}
                onDeleteEvent={() => console.log("Cannot be deleted")}
                onSaveEvent={() => console.log("Cannot be saved")}
                onUnsaveEvent={() => console.log("Cannot be unsaved")}
                isExample={true}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      );
    } else {
      return <></>;
    }
  }
}

export default EventCardDeck;
