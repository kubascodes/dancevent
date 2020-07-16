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
import EventCardDeck from "./EventCardDeck";

class MyEvents extends React.Component {
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
      return (
        <>
          <h1>Hi {this.props.state.name}, these are your events:</h1>
          {this.props.state.userType === "Organizer" ? (
            <div className="container">
              <hr />
              <h2 className="">Events organized by you</h2>

              <EventCardDeck
                events={this.props.state.organizedEvents}
                limit="3"
                state={this.props.state}
                onDeleteEvent={this.props.onDeleteEvent}
                onSaveEvent={this.props.onSaveEvent}
                onUnsaveEvent={this.props.onUnsaveEvent}
              />
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

              <hr />
            </div>
          ) : (
            <hr />
          )}

          <div className="container">
            <h2 className="">Saved Events</h2>
            <EventCardDeck
              events={this.props.state.savedEvents}
              limit="3"
              state={this.props.state}
              onDeleteEvent={this.props.onDeleteEvent}
              onSaveEvent={this.props.onSaveEvent}
              onUnsaveEvent={this.props.onUnsaveEvent}
            />
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
