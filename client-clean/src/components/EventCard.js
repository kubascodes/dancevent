import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { organizer: {} };
  }

  componentDidMount() {
    // Get the organizer corresponding to the event given in the props
    fetch(`/users/${this.props.event.organizer}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ organizer: data });
      })
      .catch(console.log);
  }

  getType = () => {
    let type = this.props.event.type;
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
        type = type;
    }
    return type;
  };

  getDate = () => {
    // TODO: make proper date object from string and use date methods to extract weekday
    let date = this.props.event.startDate.substring(0, 10);
    return date;
  };

  render() {
    return (
      <Card id={this.props.event._id} style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={this.props.event.picture}
          alt={this.props.event.title}
          style={{ objectFit: "cover", width: "286px", height: "180px" }}
        />
        <Card.Body>
          <Card.Title>{this.props.event.title}</Card.Title>
          <Card.Text>
            {this.getType()} {this.getDate()}
          </Card.Text>
          <Card.Text>{this.state.organizer.name}</Card.Text>
          <Link to={`/events/${this.props.event._id}`}>
            <button variant="primary" className="btn btn-outline-dark">
              Go to Event
            </button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}
export default EventCard;
