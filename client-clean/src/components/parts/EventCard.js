import React from "react";
import { Link, Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
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
  MdFavoriteBorder,
  MdTrendingFlat,
  MdKeyboardArrowRight,
  MdDelete,
  MdCreate,
  MdAccessTime,
} from "react-icons/md";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestedIn: false,
      userIsOwner: false,
      redirect: null,
      showDialog: false,
      isHovered: false,
    };
  }

  componentDidMount() {
    if (this.props.event) {
      if (this.props.state.savedEvents.length > 0) {
        const savedEventIds = this.props.state.savedEvents.map(
          (savedEvent) => savedEvent._id
        );
        if (savedEventIds.includes(this.props.event._id)) {
          this.setState({ interestedIn: true });
        }
      }
      if (this.props.state.organizedEvents.length > 0) {
        const organizedEventIds = this.props.state.organizedEvents.map(
          (organizedEvent) => organizedEvent._id
        );
        if (organizedEventIds.includes(this.props.event._id)) {
          this.setState({ userIsOwner: true });
        }
      }
    }
  }

  // On the homepage if an event is unsaved, there is no new component rendered in its place but the old card just receives new props
  // Need to make sure that the interestedIn and userIsOwner properties are set correctly
  componentDidUpdate(prevProps) {
    if (prevProps.event != this.props.event) {
      if (this.props.event) {
        if (this.props.state.savedEvents.length > 0) {
          const savedEventIds = this.props.state.savedEvents.map(
            (savedEvent) => savedEvent._id
          );
          if (savedEventIds.includes(this.props.event._id)) {
            this.setState({ interestedIn: true });
          }
        }
        if (this.props.state.organizedEvents.length > 0) {
          const organizedEventIds = this.props.state.organizedEvents.map(
            (organizedEvent) => organizedEvent._id
          );
          if (organizedEventIds.includes(this.props.event._id)) {
            this.setState({ userIsOwner: true });
          }
        }
      }
    }
  }

  handleSave = () => {
    var component_scope = this;
    if (window.sessionStorage.secret_token != null) {
      component_scope.setState({ interestedIn: true });
      // Add the event to the savedEvents state in App.js and push the new state to the backend
      this.props.onSaveEvent();
    } else {
      this.setState({ redirect: "/login" });
    }
  };

  handleUnSave = () => {
    var component_scope = this;
    component_scope.setState({ interestedIn: false });

    // Remove the event from the savedEvents state in App.js and push the new state to the backend
    this.props.onUnsaveEvent();
  };

  handleDelete = () => {
    this.setState({ showDialog: false });
    // This is propagated up to App.js where the actual deletion is happening. This way the EventCard can easily be removed from the Component containing it.
    this.props.onDeleteEvent();
  };

  render() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    if (this.props.isExample) {
      return (
        <div className="col-md-4 col-lg-3 mt-4">
          <div
            className="event-card example-card shadow-sm"
            onMouseOver={() => this.setState({ isHovered: true })}
            onMouseLeave={() => this.setState({ isHovered: false })}
          >
            <img
              src={"img/placeholder_639x365.png"}
              alt="..."
              className="card-img-top"
            />

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{this.props.state.name}'s new event</h5>
              <li className="list-unstyled">
                <MdLocationOn className="align-text-bottom" />{" "}
                {this.props.state.city ? this.props.state.city : "Munich"}
              </li>
              <li className="list-unstyled">
                <MdEvent className="align-text-bottom" />{" "}
                {moment(tomorrow).format("D/M/YYYY")}
              </li>
              <li className="list-unstyled">
                <MdAccessTime className="align-text-bottom" />{" "}
                {moment(tomorrow).format("H:mm")}
              </li>
              {this.state.isHovered && (
                <a
                  className="btn button-pink mt-2"
                  href="/events/create"
                  size="sm"
                >
                  Create a new event!
                </a>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="col-md-4 col-lg-3 mt-4">
            <div className="event-card shadow-sm">
              <img
                src={
                  this.props.event.picture
                    ? this.props.event.picture
                    : "img/placeholder_639x365.png"
                }
                alt="..."
                className="card-img-top"
              />

              <div class="card-body d-flex flex-column">
                <Link
                  to={`/events/single/${this.props.event._id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <h5 class="card-title">{this.props.event.title}</h5>
                </Link>
                <li className="list-unstyled">
                  <MdLocationOn className="align-text-bottom" />{" "}
                  {this.props.event.location}
                  {", "}
                  {this.props.event.city}
                </li>
                <li className="list-unstyled">
                  <MdEvent className="align-text-bottom" />{" "}
                  {moment(this.props.event.startDate).format("D/M/YYYY")}
                </li>
                <li className="list-unstyled">
                  <MdAccessTime className="align-text-bottom" />{" "}
                  {moment(this.props.event.startDate).format("H:mm")}
                </li>
                <li className="list-unstyled">
                  <MdCreditCard className="align-text-bottom" />{" "}
                  {this.props.event.price
                    ? `${this.props.event.price} EUR`
                    : "free"}
                </li>
              </div>
              <div class="card-footer bg-transparent">
                <div className="row">
                  {this.props.state.userType === "Organizer" &&
                  this.state.userIsOwner ? (
                    <>
                      <Link
                        to={`/events/update/${this.props.event._id}`}
                        className="ml-2 black-link align-text-bottom"
                      >
                        <MdCreate className="align-text-bottom" /> Edit
                      </Link>
                      <Card.Link
                        href="#"
                        onClick={() => this.setState({ showDialog: true })}
                        className="ml-auto mr-2 align-text-bottom text-danger"
                      >
                        <MdDelete className="align-text-bottom" /> Delete
                      </Card.Link>
                    </>
                  ) : this.state.interestedIn ? (
                    <>
                      <Link
                        onClick={() => this.handleUnSave()}
                        className="ml-2 black-link align-text-bottom"
                      >
                        <MdFavorite className="align-text-bottom" /> Saved
                      </Link>
                      <Link
                        to={`/events/single/${this.props.event._id}`}
                        className="ml-auto mr-2 black-link align-text-bottom"
                      >
                        More Details
                        <MdKeyboardArrowRight className="align-text-bottom" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        onClick={() => this.handleSave()}
                        className="ml-2 black-link align-text-bottom"
                      >
                        <MdFavoriteBorder className="align-text-bottom" /> Save
                      </Link>
                      <Link
                        to={`/events/single/${this.props.event._id}`}
                        className="ml-auto mr-2 black-link align-text-bottom"
                      >
                        More Details
                        <MdKeyboardArrowRight className="align-text-bottom" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={this.state.showDialog}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              Are you sure you want to delete the event{" "}
              <b>{this.props.event.title}</b>? It will not be visible to users
              of the platform anymore. This cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-dark"
                onClick={() => this.setState({ showDialog: false })}
              >
                Close
              </Button>
              <Button variant="outline-dark" onClick={this.handleDelete}>
                Understood
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }
}
export default EventCard;
