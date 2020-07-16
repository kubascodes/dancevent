import React from "react";
import { Link, Redirect } from "react-router-dom";
import EventCard from "./EventCard";
import Button from "react-bootstrap/Button";
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

class MyEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedEventsSorted: [],
      organizedEventsSorted: [],
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
          resolve(eventsToDisplay);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  /*
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
            component_scope.fetchOrganizedEvents(res.user.email);
          }

          // We get an array of event-Ids from the user and fetch the event object for each of them -> handleEventFetching only returns when all events are fetched
          component_scope
            .handleEventFetching(res.user.interestedInEvents)
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

                savedEvents: interestedInEventsObjects.filter(
                  (event) => event.startDate.getTime() > now.getTime()
                ),
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
*/
  /*
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
          organizedEvents: organizedEvents.slice(0,4),
          
          DOES NOT WORK FOR ME
          organizedEvents: organizedEvents.filter(
            (singleEvent) =>
              singleEvent.organizer.email === organizerEmail &&
              singleEvent.startDate.getTime() > now.getTime()
          ),
          
        });
      });
  };
*/
  /*
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
*/
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

  componentDidMount = () => {
    if (this.props.state.savedEvents.length > 0) {
      this.handleEventsToDisplay(this.props.state.savedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            savedEventsSorted: eventsToDisplay,
          })
      );
    }
    if (this.props.state.organizedEvents.length > 0) {
      this.handleEventsToDisplay(this.props.state.organizedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            organizedEventsSorted: eventsToDisplay,
          })
      );
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.state.savedEvents !== this.props.state.savedEvents) {
      console.log(prevProps.state.savedEvents);
      console.log(this.props.state.savedEvents);
      this.handleEventsToDisplay(this.props.state.savedEvents).then(
        (eventsToDisplay) => {
          console.log(eventsToDisplay);
          this.setState({
            savedEventsSorted: eventsToDisplay,
          });
        }
      );
    }
    if (prevProps.state.organizedEvents !== this.props.state.organizedEvents) {
      this.handleEventsToDisplay(this.props.state.organizedEvents).then(
        (eventsToDisplay) =>
          this.setState({
            organizedEventsSorted: eventsToDisplay,
          })
      );
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    if (window.sessionStorage.secret_token != null) {
      return (
        <>
          <h1>Hi {this.props.state.name}, these are your events:</h1>
          {this.props.state.userType === "Organizer" ? (
            <div className="container">
              <hr />
              <h2 className="">Events organized by you</h2>
              <div className="row">
                {this.state.organizedEventsSorted.map((event) => {
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
              </div>
              <hr />
            </div>
          ) : (
            <hr />
          )}

          <div className="container">
            <h2 className="">Saved Events</h2>
            <div className="row">
              {this.state.savedEventsSorted.map((event) => {
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
            </div>
            <div className="row">
              <div className="col">
                <Button
                  variant="outline-dark"
                  size="lg"
                  block
                  onClick={() => this.setState({ redirect: "/events" })}
                >
                  {this.props.state.savedEvents.length > 0
                    ? "Search for more events!"
                    : "Nothing to see yet. Click here to search for events!"}
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      this.setState({ redirect: "/" });
    }
  }
}
export default MyEvents;
