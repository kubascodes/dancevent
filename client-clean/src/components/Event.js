import React from "react";
import { Redirect } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      interestedIn: false,
      userIsOwner: false,
      partnerRequests: [],
      showDialog: false,
      redirect: null,
    };
  }

  popover = null;

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

  componentDidMount() {
    var component_scope = this;
    const {
      match: { params },
    } = component_scope.props;

    fetch(`/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        component_scope.setState({ event: data });
      })
      .then(() => {
        // Define the popover
        component_scope.popover = (
          <Popover id="popover-basic">
            <Popover.Title as="h3">
              {component_scope.state.event.promoCode}
            </Popover.Title>
            <Popover.Content>
              <b>{component_scope.state.event.organizer.name}</b> provides the
              above discount code. Use it when registering for this event to
              save a buck.
            </Popover.Content>
          </Popover>
        );
        if (component_scope.props.state.savedEvents.length > 0) {
          const savedEventIds = component_scope.props.state.savedEvents.map(
            (savedEvent) => savedEvent._id
          );
          if (savedEventIds.includes(component_scope.state.event._id)) {
            component_scope.setState({ interestedIn: true });
          }
        }
        if (component_scope.props.state.organizedEvents.length > 0) {
          const organizedEventIds = component_scope.props.state.organizedEvents.map(
            (organizedEvent) => organizedEvent._id
          );
          if (organizedEventIds.includes(component_scope.state.event._id)) {
            component_scope.setState({ userIsOwner: true });
          }
        }
      })
      .catch(console.log);

    // TODO: Fetch partner requests for this event from the backend
  }

  handleSave = () => {
    var component_scope = this;
    if (window.sessionStorage.secret_token != null) {
      component_scope.setState({ interestedIn: true });
      // Add the event to the savedEvents state in App.js and push the new state to the backend
      this.props.onSaveEvent(this.state.event);
    } else {
      this.setState({ redirect: "/login" });
    }
  };

  handleUnSave = () => {
    var component_scope = this;
    component_scope.setState({ interestedIn: false });

    // Remove the event from the savedEvents state in App.js and push the new state to the backend
    this.props.onUnsaveEvent(this.state.event);
  };

  handleDelete = () => {
    this.setState({ showDialog: false, redirect: "/" });
    // This is propagated up to App.js where the actual deletion is happening. This way the EventCard can easily be removed from the Component containing it.
    this.props.onDeleteEvent(this.state.event);
  };

  convertTime24to12 = (time24h, minutes) => {
    const AmOrPm = time24h >= 12 ? "PM" : "AM";
    const hours = time24h % 12 || 12;
    let time12 = "";
    if (minutes === 0) {
      time12 = hours + " " + AmOrPm;
    } else {
      time12 = hours + ":" + minutes + " " + AmOrPm;
    }
    return time12;
  };

  createPartnerRequest = () => {
    // TODO
  };

  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  render() {
    const startDate = new Date(this.state.event.startDate);
    const endDate = new Date(this.state.event.endDate);
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <>
        {this.state.event.picture ? (
          <Image
            src={this.state.event.picture}
            alt={this.state.event.title}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "300px",
            }}
          />
        ) : (
          <></>
        )}
        <Container className="mt-3">
          <Row>
            <Col xs={9}>
              <h1>{this.state.event.title}</h1>
              <h5>dance {this.state.event.type}</h5>
              <h2>
                {this.days[startDate.getDay()]}, {startDate.getDate()}{" "}
                {this.months[startDate.getMonth()]} {startDate.getFullYear()}
                {this.state.event.type === "course" ? (
                  <>
                    {" "}
                    &mdash; {this.days[endDate.getDay()]}, {endDate.getDate()}{" "}
                    {this.months[endDate.getMonth()]} {endDate.getFullYear()} (
                    {this.state.event.interval})
                  </>
                ) : (
                  ""
                )}
              </h2>
              <h3>
                {this.convertTime24to12(
                  startDate.getHours(),
                  startDate.getMinutes()
                )}{" "}
                <>&mdash;</>{" "}
                {this.convertTime24to12(
                  endDate.getHours(),
                  endDate.getMinutes()
                )}
              </h3>
            </Col>
            <Col className="text-center">
              {this.state.interestedIn ? (
                <Button
                  className="float-right m-4"
                  variant="success"
                  onClick={() => this.handleUnSave()}
                >
                  Saved
                </Button>
              ) : (
                <Button
                  className="float-right m-4"
                  variant="secondary"
                  onClick={() => this.handleSave()}
                >
                  Save in <i>My Events</i>
                </Button>
              )}
              {this.state.userIsOwner ? (
                <Button
                  className="float-right m-4"
                  variant="danger"
                  onClick={() => this.setState({ showDialog: true })}
                >
                  Delete Event
                </Button>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table>
                <tbody>
                  <tr>
                    <td>
                      <b>Organizer:</b>
                    </td>
                    <td>
                      {this.state.event.organizer
                        ? this.state.event.organizer.name
                        : "not available"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Dance Styles:</b>
                    </td>
                    <td>
                      {this.state.event.listOfDanceStyles
                        ? this.state.event.listOfDanceStyles
                            .map((danceStyle) => {
                              return this.capitalize(danceStyle);
                            })
                            .join(", ")
                        : "not available"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>This event is for:</b>
                    </td>
                    <td>
                      {this.state.event.listOfProficiencyLevels
                        ? this.state.event.listOfProficiencyLevels
                            .map((profLevel) => {
                              return this.capitalize(profLevel);
                            })
                            .join(", ") + " dancers"
                        : "not available"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <Table>
                <tbody>
                  <tr>
                    <td>
                      <b>City:</b>
                    </td>
                    <td>
                      {this.state.event
                        ? this.state.event.city
                        : "not available"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Location:</b>
                    </td>
                    <td>
                      {this.state.event
                        ? this.state.event.location
                        : "not available"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Price:</b>
                    </td>
                    <td>
                      {this.state.event.price
                        ? this.state.event.price === 0
                          ? "free"
                          : this.state.event.price + " €"
                        : "not available"}
                      {this.state.event.promoCode ? (
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={this.popover}
                        >
                          <Button className="ml-4" variant="link">
                            Get a discount code
                          </Button>
                        </OverlayTrigger>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="mt-4 ml-1 mb-4">
            {this.state.event.description ? this.state.event.description : ""}
          </Row>
          {window.sessionStorage.secret_token ? (
            <>
              <h3>
                Open partner requests for this event: TODO: Create Partner
                Request Event Cards and link them here
              </h3>
              <Button variant="light" onClick={this.createPartnerRequest}>
                Create a partner request
              </Button>
              {this.state.partnerRequests.map((partnerRequest) => {
                // Partner Request card
              })}
            </>
          ) : (
            ""
          )}
        </Container>
        <Modal
          show={this.state.showDialog}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            Are you sure you want to delete the event{" "}
            <b>{this.state.event.title}</b>? It will not be visible to users of
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
export default Event;
