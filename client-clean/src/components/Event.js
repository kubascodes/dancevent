import React from "react";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { event: {} };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    fetch(`/events/${params.eventId}`)
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
        {/**TODO: check whether there is a picture attached to the event and display it here */}
        <h1>{this.state.event.title}</h1>
      </>
    );
  }
}
export default Event;
