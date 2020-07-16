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
        <React.Fragment>
          {this.props.state.userType === "Dancer" ? (
            <HomepageBanner />
          ) : (
            <>
              <Container>
                <h1>Hi {this.props.state.name}, welcome to dancevent!</h1>
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
              </Container>
            </>
          )}

          <hr />
          <Container>
            <h2 className="">Your Saved Events</h2>
            <EventCardDeck
              events={this.props.state.savedEvents}
              limit="3"
              state={this.props.state}
              onDeleteEvent={this.props.onDeleteEvent}
              onSaveEvent={this.props.onSaveEvent}
              onUnsaveEvent={this.props.onUnsaveEvent}
            />
            <Row>
              <Col className="col">
                {this.props.state.savedEvents.length > 0 ? (
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
