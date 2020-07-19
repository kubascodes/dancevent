import React from "react";
import { Redirect } from "react-router-dom";
import HomepageBanner from "./HomepageBanner";
import EventCardDeck from "./parts/EventCardDeck";

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
          <div className="row justify-content-center">
            <div
              className="btn btn-lg button-pink mt-4"
              onClick={() => this.setState({ redirect: "/myevents" })}
            >
              Go to <i>My Events</i>
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
