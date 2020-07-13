 import React from "react";
import { Link, Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestedInEvents: [],
      interestedIn: false,
      redirect: null,
      showDialog: false,
    };
  }

  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  fetchInterestedInEvents = () => {
    var component_scope = this;
    return new Promise((resolve, reject) => {
      fetch("/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + window.sessionStorage.secret_token,
        },
      })
        .then((res) => res.json(res))
        .then(function (res) {
          component_scope.setState({
            interestedInEvents: res.user.interestedInEvents,
          });
          resolve(res);
        })
        .catch((err) => reject(err));
    });
    console.log(this.state);
    console.log(this.props.event);
  };

  componentDidMount() {
    // Get the events the currently logged in user is interested in and check if the event this EventCard belongs to is in there
    if (window.sessionStorage.secret_token != null) {
      this.fetchInterestedInEvents().then(() => {
        if (this.state.interestedInEvents.includes(this.props.event._id)) {
          this.setState({ interestedIn: true });
        }
      });
    }
  }

  handleSave = () => {
    var component_scope = this;
    if (window.sessionStorage.secret_token != null) {
      component_scope.setState({ interestedIn: true });
      // Refresh the state from the backend
      component_scope.fetchInterestedInEvents().then(() => {
        // Add the event to interestedInEvents in the state
        component_scope.setState(
          {
            interestedInEvents: [
              ...component_scope.state.interestedInEvents,
              component_scope.props.event._id,
            ],
          },
          // Callback of setState so it definitely pushes the newest state
          () => {
            // Push that new state to the backend
            fetch("/profile/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Bearer " + window.sessionStorage.secret_token,
              },
              body: JSON.stringify([
                {
                  propName: "interestedInEvents",
                  value: component_scope.state.interestedInEvents,
                },
              ]),
            })
              .then((res) => res.json(res))
              .catch((err) => console.log(err));
          }
        );
      });
    } else {
      this.setState({ redirect: "/login" });
    }
  };

  handleUnSave = () => {
    var component_scope = this;
    component_scope.setState({ interestedIn: false });
    // Refresh the state from the backend
    component_scope.fetchInterestedInEvents().then(() => {
      // Remove the event from interestedInEvents in the state
      component_scope.setState(
        {
          interestedInEvents: component_scope.state.interestedInEvents.filter(
            (item) => item !== component_scope.props.event._id
          ),
        },
        () => {
          // Push that new state to the backend
          fetch("/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: "Bearer " + window.sessionStorage.secret_token,
            },
            body: JSON.stringify([
              {
                propName: "interestedInEvents",
                value: component_scope.state.interestedInEvents,
              },
            ]),
          })
            .then((res) => res.json(res))
            .catch((err) => alert(err));
        }
      );
    });
  };

  handleDelete = () => {
    this.handleClose();
    // This is propagated up to App.js where the actual deletion is happening. This way the EventCard can easily be removed from the Component containing it.
    this.props.onDeleteEvent();
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  };
  handleShow = () => {
    this.setState({ showDialog: true });
  };

  render() {
    const date = new Date(this.props.event.startDate);
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <>
        <Card
          id={this.props.event._id}
          style={{ width: "18rem" }}
          className="m-2"
        >
          <Link to={`/events/single/${this.props.event._id}`}>
            <Card.Img
              variant="top"
              src={
                this.props.event.picture
                  ? this.props.event.picture
                  : "img/placeholder2_1024x365.png"
              }
              alt={this.props.event.title}
              style={{ objectFit: "cover", width: "286px", height: "180px" }}
            />
          </Link>
          <Card.Body>
            <Link
              to={`/events/single/${this.props.event._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Card.Title>{this.props.event.title}</Card.Title>
            </Link>
            <Card.Subtitle className="mb-2 text-muted">
              {this.days[date.getDay()]}, {date.getDate()}{" "}
              {this.months[date.getMonth()]} {date.getFullYear()}
            </Card.Subtitle>
            <Card.Text>by {this.props.event.organizer.name}</Card.Text>
            {this.state.interestedIn ? (
              <Button
                className="m-2"
                variant="success"
                onClick={() => this.handleUnSave()}
              >
                Saved
              </Button>
            ) : (
              <Button
                className="m-2"
                variant="secondary"
                onClick={() => this.handleSave()}
              >
                Save in <i>My Events</i>
              </Button>
            )}
            {this.props.state.email === this.props.event.organizer.email ? (
              <Card.Link
                href="#"
                onClick={this.handleShow}
                style={{ color: "#dc2029" }}
                className=""
              >
                Delete
              </Card.Link>
            ) : (
              <></>
            )}
          </Card.Body>
        </Card>
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
            <Button variant="secondary" onClick={this.handleClose}>
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
