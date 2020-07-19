import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";
import CreateRequestForm from "./forms/CreateRequestForm";
import PartnerRequestForm from "./forms/PartnerRequestForm";
import { CardDeck } from "react-bootstrap";
import moment from "moment";
import {
  MdFavorite,
  MdEvent,
  MdFavoriteBorder,
  MdDelete,
  MdCreate,
  MdAccessTime,
} from "react-icons/md";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      interestedIn: false,
      userIsOwner: false,
      partnerRequests: [],
      showDeletionDialog: false,
      showCreateRequestForm: false,
      showPartnerRequestDialog: false,
      popover: {},
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

  componentDidMount = () => {
    var component_scope = this;
    const {
      match: { params },
    } = component_scope.props;

    fetch(`/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        component_scope.setState({ event: data }, () => {
          if (component_scope.state.event.promoCode) {
            this.setState(
              {
                popover: (
                  <Popover id="popover-basic">
                    <Popover.Title as="h3">
                      {component_scope.state.event.promoCode}
                    </Popover.Title>
                    <Popover.Content>
                      <b>{component_scope.state.event.organizer.name}</b>{" "}
                      provides the above discount code. Use it when registering
                      for this event to save a buck.
                    </Popover.Content>
                  </Popover>
                ),
              },
              () => console.log(this.state.popover)
            );
          }
        });
      })
      .then(() => {
        if (component_scope.props.state.savedEvents.length > 0) {
          const savedEventIds = component_scope.props.state.savedEvents.map(
            (savedEvent) => savedEvent._id
          );
          if (savedEventIds.includes(component_scope.state.event._id)) {
            component_scope.setState({ interestedIn: true });
          } else {
            component_scope.setState({ interestedIn: false });
          }
        }
        if (component_scope.props.state.organizedEvents.length > 0) {
          const organizedEventIds = component_scope.props.state.organizedEvents.map(
            (organizedEvent) => organizedEvent._id
          );
          if (organizedEventIds.includes(component_scope.state.event._id)) {
            component_scope.setState({ userIsOwner: true });
          } else {
            component_scope.setState({ userIsOwner: false });
          }
        }
      })
      .catch(console.log);

    // Fetch partner requests for this event from the backend
    if (window.sessionStorage.secret_token != null) {
      fetch(`/events/${params.id}/partnerrequests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + window.sessionStorage.secret_token,
        },
      })
        .then((res) => res.json(res))
        .then(function (res) {
          console.log("partner requests received in Event: ", res);
          component_scope.setState({
            partnerRequests: res,
          });
        })
        .catch((err) => alert(err));
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps != this.props) {
      var component_scope = this;
      if (component_scope.props.state.savedEvents.length > 0) {
        const savedEventIds = component_scope.props.state.savedEvents.map(
          (savedEvent) => savedEvent._id
        );
        if (savedEventIds.includes(component_scope.state.event._id)) {
          component_scope.setState({ interestedIn: true });
        } else {
          component_scope.setState({ interestedIn: false });
        }
      }
      if (component_scope.props.state.organizedEvents.length > 0) {
        const organizedEventIds = component_scope.props.state.organizedEvents.map(
          (organizedEvent) => organizedEvent._id
        );
        if (organizedEventIds.includes(component_scope.state.event._id)) {
          component_scope.setState({ userIsOwner: true });
        } else {
          component_scope.setState({ userIsOwner: false });
        }
      }
    }
  };

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
    this.setState({ showDeletionDialog: false, redirect: "/" });
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

  showCreateRequestForm = () => {
    if (window.sessionStorage.secret_token != null) {
      if (this.props.state.userType === "Dancer") {
        this.setState({ showCreateRequestForm: true });
      } else if (this.props.state.userType === "Organizer") {
        this.setState({ showPartnerRequestDialog: true });
      }
    } else {
      this.setState({ redirect: "/login" });
    }
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
          <div
            className="banner"
            style={{
              background: `url(${this.state.event.picture}) repeat-x center`,
            }}
          />
        ) : (
          <></>
        )}
        <div className="container mt-3">
          <div className="flex-row d-flex flex-wrap justify-content-end align-items-center">
            <div className="col d-flex justify-content-start flex-column">
              <h1>{this.state.event.title}</h1>
              <h2>
                <MdEvent /> {this.days[startDate.getDay()]},{" "}
                {moment(this.state.event.startDate).format("D/M/YYYY")}
                {this.state.event.type === "course" ? (
                  <>
                    {" "}
                    &mdash;{" "}
                    {moment(this.state.event.endDate).format("D/M/YYYY")}
                  </>
                ) : (
                  ""
                )}
              </h2>
              <h2>
                <MdAccessTime />{" "}
                {moment(this.state.event.startDate).format("H:mm")}
              </h2>
            </div>
            <div className="col d-flex flex-column align-items-end">
              {this.state.userIsOwner ? (
                <></>
              ) : this.state.interestedIn ? (
                <Link
                  onClick={() => this.handleUnSave()}
                  className="black-link"
                >
                  <MdFavorite className="" /> Saved
                </Link>
              ) : (
                <Link onClick={() => this.handleSave()} className="black-link">
                  <MdFavoriteBorder className="" /> Save
                </Link>
              )}
              {this.state.userIsOwner ? (
                <>
                  <Link
                    to={`/events/update/${this.props.match.params.id}`}
                    className="black-link"
                  >
                    <MdCreate /> Edit
                  </Link>

                  <Link
                    href="#"
                    onClick={() => this.setState({ showDeletionDialog: true })}
                    className="text-danger mt-2"
                  >
                    <MdDelete /> Delete
                  </Link>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="container d-flex mt-2">
            <div className="col">
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
            </div>
            <div className="col">
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
                    <td className="container d-flex align-items-center flex-wrap">
                      {this.state.event.price
                        ? `${this.state.event.price} EUR`
                        : "free"}
                      {this.state.event.promoCode && this.state.popover ? (
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={this.state.popover}
                        >
                          <Button className="dancevent" variant="link">
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
            </div>
          </div>
          <div className="row mt-4 ml-1 mb-4">
            {this.state.event.description ? this.state.event.description : ""}
          </div>
          {!window.sessionStorage.secret_token ? (
            <p>
              {" "}
              Please {<Link to={{ pathname: "login" }}>login</Link>} to view
              partner requests for this event.
            </p>
          ) : this.state.partnerRequests.length === 0 ? (
            <h4 className="text-center mt-4">
              There are currently no open partner requests for this event.
            </h4>
          ) : (
            <>
              <h4 className="text-center mt-4">
                Open partner requests for this event:
              </h4>
              <CardDeck>
                {this.state.partnerRequests.map((partnerRequest) => {
                  return <PartnerRequestForm request={partnerRequest} />;
                })}
              </CardDeck>
            </>
          )}
          <div className="row justify-content-center">
            <div
              className="btn btn-lg button-pink mt-4"
              onClick={() => this.showCreateRequestForm()}
            >
              Create a partner request
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showPartnerRequestDialog}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            You need to login as a dancer to create a partner request.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => this.setState({ showPartnerRequestDialog: false })}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showDeletionDialog}
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
              variant="outline-dark"
              onClick={() => this.setState({ showDeletionDialog: false })}
            >
              Close
            </Button>
            <Button variant="outline-dark" onClick={this.handleDelete}>
              Understood
            </Button>
          </Modal.Footer>
        </Modal>
        <CreateRequestForm
          show={this.state.showCreateRequestForm}
          onClose={() => this.setState({ showCreateRequestForm: false })}
          event={this.state.event}
        />
      </>
    );
  }
}
export default Event;
