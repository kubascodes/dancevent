import React from "react";
import { Redirect } from "react-router-dom";
import HomepageBanner from "./HomepageBanner";
import EventCard from "./EventCard";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedEvents: [],
      organizedEvents: [],
      redirect: null,
    };
  }

  componentDidMount = () => {
    if (window.sessionStorage.secret_token != null) {
      var component_scope = this;
      // Fetch the events the logged in user is interested in
      fetch("/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + window.sessionStorage.secret_token,
        },
      })
        .then((res) => res.json(res))
        .then(function (res) {
          if (res.userType === "Organizer") {
            // The user id is never given to the front-end. In fetchOrganizedEvents the email is used to filter for the events that belong to the currently logged in organizer
            component_scope.fetchOrganizedEvents(res.email);
          }

          // We get an array of event-Ids from the user and fetch the event object for each of them -> handleEventFetching only returns when all events are fetched
          component_scope
            .handleEventFetching(res.interestedInEvents)
            .then((events) => {
              // Only resolved promises of the fetched events end up in here
              let interestedInEventsObjects = [...events];
              // Sort the retrieved events by date (old to new)
              interestedInEventsObjects.sort((a, b) =>
                a.startDate > b.startDate
                  ? 1
                  : a.startDate < b.startDate
                  ? -1
                  : 0
              );
              const now = new Date();
              component_scope.setState({
                // Filter out those events that are over and only take the first 4 out (only those 4 will be shown on the homepage)

                savedEvents: interestedInEventsObjects
                  .filter((event) => event.startDate.getTime() > now.getTime())
                  .slice(0, 3),
              });
            });
        })
        .catch(console.log);
    }
  };

  handleEventFetching = (eventIds) => {
    return new Promise((resolve, reject) => {
      let eventPromises = [];
      // Fetch the event object for each event the logged in user is interested in as a promise
      eventIds.forEach((eventId) => {
        eventPromises.push(fetch(`/events/${eventId}`));
      });
      Promise.all(eventPromises)
        .then((events) => {
          // These events do not have the json format yet
          // the .json() method is asynchronous so once again we wait until all results are turned into json before going on
          let jsonEventPromises = [];
          events.forEach((event) => {
            jsonEventPromises.push(event.json());
          });
          Promise.all(jsonEventPromises).then((jsonEvents) => {
            jsonEvents = this.convertStringToDate(jsonEvents);
            resolve(jsonEvents);
          });
        })
        .catch((err) => reject(err));
    });
  };

  fetchOrganizedEvents = (organizerEmail) => {
    var component_scope = this;
    // Additionally fetch organized events: Fetch all events and filter for those that are organized by the logged in organizer
    fetch("/events")
      .then((res) => res.json())
      .then((events) => component_scope.convertStringToDate(events))
      .then((eventsConverted) => {
        let organizedEvents = [...eventsConverted];
        // Sort the retrieved events by date (old to new)
        organizedEvents.sort((a, b) =>
          a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
        );
        const now = new Date();
        component_scope.setState({
          // Filter out those events that are over and only take the first 4 out (only those 4 will be shown on the homepage)
          organizedEvents: organizedEvents
            .filter(
              (event) =>
                event.organizer.email === organizerEmail &&
                event.startDate.getTime() > now.getTime()
            )
            .slice(0, 3),
        });
      });
  };

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
    component_scope.props.onDeleteEvent(event);
  };

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
                  {this.state.organizedEvents.map((event) => {
                    return (
                      <Col
                        key={event._id}
                        className="d-flex justify-content-center"
                      >
                        <EventCard
                          event={event}
                          state={this.props.state}
                          onDeleteEvent={() => this.onDeleteEvent(event)}
                        />
                      </Col>
                    );
                  })}
                </Row>
                <Button
                  variant="outline-dark"
                  size="lg"
                  block
                  onClick={() => this.setState({ redirect: "/events" })}
                >
                  {this.state.organizedEvents.length > 0
                    ? "Create a new event!"
                    : "Nothing to see yet. Click here to create a new event!"}
                </Button>
              </Container>
            </>
          )}

          <hr />
          <Container>
            <h2 className="">Saved Events</h2>
            <Row>
              {this.state.savedEvents.map((event) => {
                return (
                  <Col
                    key={event._id}
                    className="d-flex justify-content-center"
                  >
                    <EventCard
                      onDeleteEvent={() => this.onDeleteEvent(event)}
                      event={event}
                      state={this.props.state}
                    />
                  </Col>
                );
              })}
            </Row>
            <Row>
              <Col className="col">
                {this.state.savedEvents.length > 0 ? (
                  <Button
                    variant="outline-dark"
                    size="lg"
                    block
                    onClick={() => this.setState({ redirect: "/myevents" })}
                  >
                    Go to <i>My Events</i>
                  </Button>
                ) : (
                  <Button
                    variant="outline-dark"
                    size="lg"
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
