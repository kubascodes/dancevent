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
} from "react-icons/md";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestedIn: false,
      userIsOwner: false,
      redirect: null,
      showDialog: false,
    };
  }

  componentDidMount() {
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

  // On the homepage if an event is unsaved, there is no new component rendered in its place but the old card just receives new props
  // Need to make sure that the interestedIn and userIsOwner properties are set correctly
  componentDidUpdate(prevProps) {
    if (prevProps.event !== this.props.event) {
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
  /*
  handleClose = () => {
    this.setState({ showDialog: false });
  };
  */
  /*
  handleShow = () => {
    this.setState({ showDialog: true });
  };
  */

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <>
        <div className="col-md-4 col-lg-3 mt-4">
          <div className="card event-card shadow-sm">
            <div className="crop-box crop-to-fit">
              <Link to={`/events/single/${this.props.event._id}`}>
                <img
                  src={
                    this.props.event.picture
                      ? this.props.event.picture
                      : "img/placeholder2_1024x365.png"
                  }
                  class="card-img-top"
                  alt="..."
                />
              </Link>
            </div>
            <div class="card-body d-flex flex-column">
              <Link
                to={`/events/single/${this.props.event._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <h5 class="card-title">{this.props.event.title}</h5>
              </Link>
              <li className="cart-text list-unstyled">
                <MdLocationOn /> {this.props.event.location}{" "}
                {this.props.event.city}
              </li>
              <li className="cart-text list-unstyled">
                <MdEvent />{" "}
                {moment(this.props.event.startDate).format("dddd D.M.YYYY")} at{" "}
                {moment(this.props.event.startDate).format("H")}h
              </li>
              <li className="cart-text list-unstyled">
                <MdCreditCard /> {this.props.event.price} EUR
              </li>
              {this.state.interestedIn ? (
                <Button
                  className="text-center mt-auto"
                  variant="success"
                  onClick={() => this.handleUnSave()}
                >
                  <MdFavorite /> Saved
                </Button>
              ) : (
                <Button
                  className="text-center mt-auto"
                  variant="secondary"
                  onClick={() => this.handleSave()}
                >
                  <MdFavorite /> Save in <i>My Events</i>
                </Button>
              )}
              {this.state.userIsOwner ? (
                <Card.Link
                  href="#"
                  onClick={() => this.setState({ showDialog: true })}
                  style={{ color: "#dc2029" }}
                  className="text-center mt-auto"
                >
                  Delete
                </Card.Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showDialog}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            Are you sure you want to delete the event{" "}
            <b>{this.props.event.title}</b>? It will not be visible to users of
            the platform anymore. This cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showDialog: false })}
            >
              Close
            </Button>
            <Button variant="primary" onClick={this.handleDelete}>
              Understood
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default EventCard;
