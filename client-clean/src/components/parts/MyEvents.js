import React from "react";
import { Redirect } from "react-router-dom";
import EventCardDeck from "./EventCardDeck";

class MyEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPastEvents: true,
      redirect: null,
    };
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    if (window.sessionStorage.secret_token != null) {
      return (
        <>
          <h1 className="text-center">
            Hi {this.props.state.name}, these are your events:
          </h1>
          {this.props.state.userType === "Organizer" ? (
            <div className="container">
              <EventCardDeck
                events={this.props.state.organizedEvents}
                limit="3"
                scope={["organized", "upcoming"]}
                hidePastEvents={() => this.setState({ showPastEvents: false })}
                state={this.props.state}
                onDeleteEvent={this.props.onDeleteEvent}
                onSaveEvent={this.props.onSaveEvent}
                onUnsaveEvent={this.props.onUnsaveEvent}
              />

              <EventCardDeck
                events={this.props.state.organizedEvents}
                limit="3"
                scope={["organized", "past"]}
                hidePastEvents={() => this.setState({ showPastEvents: false })}
                state={this.props.state}
                onDeleteEvent={this.props.onDeleteEvent}
                onSaveEvent={this.props.onSaveEvent}
                onUnsaveEvent={this.props.onUnsaveEvent}
              />

              <hr />
            </div>
          ) : (
            <></>
          )}

          <div className="container">
            <EventCardDeck
              events={this.props.state.savedEvents}
              limit="100"
              scope={["saved", "upcoming"]}
              state={this.props.state}
              onDeleteEvent={this.props.onDeleteEvent}
              onSaveEvent={this.props.onSaveEvent}
              onUnsaveEvent={this.props.onUnsaveEvent}
            />
            <div className="row justify-content-center mt-2">
              <div
                className="btn btn-lg button-pink"
                size="lg"
                block
                onClick={() => this.setState({ redirect: "/events" })}
              >
                {this.props.state.savedEvents.length > 0
                  ? "Search for more events!"
                  : "Nothing to see yet. Click here to search for events!"}
              </div>
            </div>
            {this.state.showPastEvents ? (
              <EventCardDeck
                events={this.props.state.savedEvents}
                limit="100"
                scope={["saved", "past"]}
                state={this.props.state}
                onDeleteEvent={this.props.onDeleteEvent}
                onSaveEvent={this.props.onSaveEvent}
                onUnsaveEvent={this.props.onUnsaveEvent}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      );
    } else {
      this.setState({ redirect: "/" });
    }
  }
}
export default MyEvents;
