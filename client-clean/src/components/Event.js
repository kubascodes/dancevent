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

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      interestedIn: false,
      interestedInEvents: [],
      redirect: null,
      partnerRequests: [],
      userIsOwner: false,
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
    const {
      match: { params },
    } = this.props;

    fetch(`/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ event: data });
      })
      .then(() => {
        // Define the popover and the partnerRequestElement
        this.popover = (
          <Popover id="popover-basic">
            <Popover.Title as="h3">{this.state.event.promoCode}</Popover.Title>
            <Popover.Content>
              <b>{this.state.event.organizer.name}</b> provides the above
              discount code. Use it when registering for this event to save a
              buck.
            </Popover.Content>
          </Popover>
        );
      })
      .then(() => {
        // Get the events the currently logged in user is interested in and check if this event is in there
        if (window.sessionStorage.secret_token != null) {
          this.fetchInterestedInEvents().then(() => {
            if (this.state.interestedInEvents.includes(this.state.event._id)) {
              this.setState({ interestedIn: true });
            }
          });
        }
      })
      .catch(console.log);
    // TODO: Fetch partner requests for this event from the backend
  }

  // The first time the Event component is rendered it receives the blank prop "state" from App.js. This prop changes with the componentDidMount of App.js
  // This prop "state" includes the email of the current user which must be checked to decide if the update button will be shown for this event
  // So in componenDidUpdate a change of the props is awaited
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.state !== this.props.state) {
      if (this.props.state.email === this.state.event.organizer.email) {
        this.setState({ userIsOwner: true });
        // Now we know that we can show the update button (similar to the delete button in the EventCard)
      }
    }
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
              component_scope.state.event._id,
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
            (item) => item !== component_scope.state.event._id
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
            src={`/${this.state.event.picture}`}
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
                        ? this.state.event.listOfDanceStyles.join(", ")
                        : "not available"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>This event is for:</b>
                    </td>
                    <td>
                      {this.state.event.listOfProficiencyLevels
                        ? this.state.event.listOfProficiencyLevels.join(", ") +
                          " dancers"
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
      </>
    );
  }
}
export default Event;
