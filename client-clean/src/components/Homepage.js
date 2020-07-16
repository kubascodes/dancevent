import React from "react";
import { Link, Redirect } from "react-router-dom";
import HomepageBanner from "./HomepageBanner";
import EventCard from "./parts/EventCard";
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
      savedEventsShortened: [],
      organizedEventsShortened: [],
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

  /*
  onDeleteEvent = (event) => {
    
    var component_scope = this;
    // Interrupting the flow from the EventCard to App.js to ensure immediate rerendering of the Homepage when the deletion in App.js is done
    component_scope.setState({
      organizedEvents: component_scope.state.organizedEvents.filter(
        (organizedEvent) => organizedEvent._id !== event._id
      ),
      savedEvents: component_scope.state.savedEvents.filter(
        (savedEvent) => savedEvent._id !== event._id
      ),
    });
    

    // After the Homepage is re-rendered the event is deleted from the backend
    this.props.onDeleteEvent(event);
  };
  */

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
          eventsToDisplay.length = Math.min(eventsToDisplay.length, 3);
          resolve(eventsToDisplay);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  componentDidMount = () => {
    if (this.props.state.savedEvents.length > 0) {
      this.handleEventsToDisplay(this.props.state.savedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            savedEventsShortened: eventsToDisplay,
          })
      );
    }
    if (this.props.state.organizedEvents.length > 0) {
      this.handleEventsToDisplay(this.props.state.organizedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            organizedEventsShortened: eventsToDisplay,
          })
      );
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.state.savedEvents !== this.props.state.savedEvents) {
      this.handleEventsToDisplay(this.props.state.savedEvents).then(
        (eventsToDisplay) => {
          this.setState({
            savedEventsShortened: eventsToDisplay,
          });
        }
      );
    }
    if (prevProps.state.organizedEvents !== this.props.state.organizedEvents) {
      this.handleEventsToDisplay(this.props.state.organizedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            organizedEventsShortened: eventsToDisplay,
          })
      );
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    if (window.sessionStorage.secret_token != null) {
      /*Display personalized content when logged in*/
      return (
        <React.Fragment>
          {this.props.state.userType === "Dancer" ? (
            <HomepageBanner />
          ) : (
            <>
              <Container>
                <h1>Hi {this.props.state.name}, welcome to dancevent!</h1>
                <h2 className="">Events organized by you</h2>
                <Row>
                  {this.state.organizedEventsShortened.map((event) => {
                    return (
                      <EventCard
                        event={event}
                        state={this.props.state}
                        onDeleteEvent={() => this.props.onDeleteEvent(event)}
                        onSaveEvent={() => this.props.onSaveEvent(event)}
                        onUnsaveEvent={() => this.props.onUnsaveEvent(event)}
                      />
                    );
                  })}
                  <div className="col-md-4 col-lg-3 mt-4">
                    <div className="card event-card shadow-sm">
                      <div className="crop-box crop-to-fit">
                        <Link to={"/events/create"}>
                          <img
                            src="img/placeholder2_1024x365.png"
                            class="card-img-top"
                            alt="..."
                          />
                        </Link>
                      </div>
                      <div class="card-body d-flex flex-column">
                        <Link
                          to={"/events/create"}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <h5 class="card-title">Create a new event!</h5>
                        </Link>
                        <li className="cart-text list-unstyled">
                          <MdLocationOn /> [location]
                        </li>
                        <li className="cart-text list-unstyled">
                          <MdEvent /> [DD.MM.YYY]
                        </li>
                        <li className="cart-text list-unstyled">
                          <MdCreditCard /> [price]
                        </li>
                        <div className="text-center mt-auto"></div>
                      </div>
                    </div>
                  </div>
                </Row>
              </Container>
            </>
          )}

          <hr />
          <Container>
            <h2 className="">Saved Events</h2>
            <Row>
              {this.state.savedEventsShortened.map((event) => {
                return (
                  <EventCard
                    event={event}
                    state={this.props.state}
                    onDeleteEvent={() => this.onDeleteEvent(event)}
                    onSaveEvent={() => this.props.onSaveEvent(event)}
                    onUnsaveEvent={() => this.props.onUnsaveEvent(event)}
                  />
                );
              })}
            </Row>
            <Row>
              <Col className="col">
                {this.state.savedEventsShortened.length > 0 ? (
                  <Button
                    className="button-pink"
                    size="md"
                    block
                    onClick={() => this.setState({ redirect: "/myevents" })}
                  >
                    Go to <i>My Events</i>
                  </Button>
                ) : (
                  <Button
                    className="button-pink"
                    size="md"
                    block
                    onClick={() => this.setState({ redirect: "/events" })}
                  >
                    Nothing to see yet. Click here to search for events!
                  </Button>
                )}
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    } else {
      /*Display public content not logged in*/
      return <HomepageBanner />;
    }
  }
}

export default Homepage;
