import React from "react";
import { Redirect } from "react-router-dom";
import EventCard from "./EventCard";
import Button from "react-bootstrap/Button";

class MyEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { savedEvents: [], organizedEvents: [], redirect: null };
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
          console.log("User fetched:");
          console.log(res);
          if (res.userType === "Organizer") {
            // At this moment we have access to the user (not the ID though, the ID is nullified in the backend for the POST /profile route).
            component_scope.fetchOrganizedEvents(res._id);
          }

          // We get an array of event-Ids from the user and fetch the event object for each of them -> handleEventFetching only returns when all events are fetched
          component_scope
            .handleEventFetching(res.interestedInEvents)
            .then((events) => {
              // Only resolved promises of the fetched events end up in here
              console.log("Events fetched and turned into json:");
              console.log(events);
              let interestedInEventsObjects = [...events];
              // Sort the retrieved events by date (old to new)
              interestedInEventsObjects.sort((a, b) =>
                a.startDate > b.startDate
                  ? 1
                  : a.startDate < b.startDate
                  ? -1
                  : 0
              );
              console.log("Sorted events:");
              console.log(interestedInEventsObjects);

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

  fetchOrganizedEvents = (organizerId) => {
    var component_scope = this;
    // Additionally fetch organized events: Fetch all events and filter for those that are organized by the logged in organizer
    fetch("/events")
      .then((res) => res.json())
      .then((events) => component_scope.convertStringToDate(events))
      .then((eventsConverted) => {
        console.log(eventsConverted);
        let organizedEvents = [...eventsConverted];
        // Sort the retrieved events by date (old to new)
        organizedEvents.sort((a, b) =>
          a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
        );
        console.log("Sorted events:");
        console.log(organizedEvents);

        const now = new Date();
        component_scope.setState({
          // Filter out those events that are over and only take the first 4 out (only those 4 will be shown on the homepage)
          organizedEvents: organizedEvents
            // TODO: filter event.organizer === organizerID, for this the userID must be fetched from the backend though in POST /profile above
            .filter((event) => event.startDate.getTime() > now.getTime()),
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
                {this.state.organizedEvents.map((event) => {
                  return (
                    <div key={event._id} className="col-4">
                      <EventCard event={event} state={this.props.state} />
                    </div>
                  );
                })}
              </div>
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
              <hr />
            </div>
          ) : (
            <hr />
          )}

          <div className="container">
            <h2 className="">Saved Events</h2>
            <div className="row">
              {this.state.savedEvents.map((event) => {
                return (
                  <div key={event._id} className="col-4">
                    <EventCard event={event} state={this.props.state} />
                  </div>
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
                  {this.state.savedEvents.length > 0
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
