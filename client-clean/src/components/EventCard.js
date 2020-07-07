import React from "react";
import { Link, Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizer: {},
      interestedInEvents: [],
      interestedIn: false,
      redirect: null,
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
            interestedInEvents: res.interestedInEvents,
          });
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  };

  componentDidMount() {
    var component_scope = this;
    // Get the organizer corresponding to the event given in the props
    fetch(`/users/${component_scope.props.event.organizer}`)
      .then((res) => res.json())
      .then((data) => {
        component_scope.setState({ organizer: data });
      })
      .catch(console.log);

    // Get the events the currently logged in user is interested in and check if the event this EventCard belongs to is in there
    if (window.sessionStorage.secret_token != null) {
      this.fetchInterestedInEvents().then(() => {
        if (this.state.interestedInEvents.includes(this.props.event._id)) {
          this.setState({ interestedIn: true });
        }
      });
    }
  }

  // Currently not in use, not sure if we want that shown here
  getType = () => {
    var component_scope = this;
    let type = component_scope.props.event.type;
    switch (type) {
      case "course":
        type = "dance course";
        break;
      case "ball":
        type = "dance ball";
        break;
      case "party":
        type = "dance party";
        break;
      default:
        alert("Unknown event type passed to EventCard");
    }
    return type;
  };

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

  render() {
    const date = new Date(this.props.event.startDate);
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <Card
        id={this.props.event._id}
        style={{ width: "18rem" }}
        className="m-2"
      >
        <Link to={`/events/${this.props.event._id}`}>
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
            to={`/events/${this.props.event._id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card.Title>{this.props.event.title}</Card.Title>
          </Link>
          <Card.Subtitle className="mb-2 text-muted">
            {this.days[date.getDay()]}, {date.getDate()}{" "}
            {this.months[date.getMonth()]} {date.getFullYear()}
          </Card.Subtitle>
          <Card.Text>by {this.state.organizer.name}</Card.Text>
          {this.state.interestedIn ? (
            <Button variant="success" onClick={() => this.handleUnSave()}>
              Saved
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => this.handleSave()}>
              Save in <i>My Events</i>
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }
}
export default EventCard;
