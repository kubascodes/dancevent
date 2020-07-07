import React from "react";
import Image from "react-bootstrap/Image";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { event: {} };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    fetch(`/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ event: data });
      })
      .catch(console.log);
  }

  render() {
    return (
      <>
        {this.state.event.picture ? (
          <Image
            src={this.state.event.picture}
            alt={this.state.event.title}
            fluid
          />
        ) : (
          <span></span>
        )}
        <h1>{this.state.event.title}</h1>
      </>
    );
  }
}
export default Event;
