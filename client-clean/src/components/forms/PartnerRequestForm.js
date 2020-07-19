import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Popover,
  OverlayTrigger,
  Image,
  Modal,
  ModalTitle,
} from "react-bootstrap";
import {
  MdMailOutline,
  MdPerson,
  MdLocationOn,
  MdPhone,
  MdLockOutline,
  MdFavorite,
  MdFace,
  MdStarHalf,
  MdEvent,
  MdCreditCard,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { GiPartyFlags, GiBodyHeight } from "react-icons/gi";
import Select from "react-select";
import { Link } from "react-router-dom";
import moment from "moment";
import ContactModal from "../parts/ContactModal";

class PartnerRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showContactModal: false,
      showDeletionDialog: false,
    };
  }

  handleCancel = () => {
    this.setState({ showModal: false });
    this.setState({ showContactModal: false });
    this.setState({ showDeletionDialog: false });
  };

  handleContactCancel = () => {
    this.setState({ showContactModal: false });
  };

  handleDeleteCancel = () => {
    this.setState({ showDeletionDialog: false });
  };

  handleShow = () => {
    this.setState({ showModal: true });
  };

  handleContactShow = () => {
    this.setState({ showContactModal: true });
  };

  handleDeleteShow = () => {
    this.setState({ showDeletionDialog: true });
  };

  handleDelete = (requestId) => {
    this.handleCancel();
    this.props.deleteRequest(requestId);
  };

  calculate_age = (yearOfBrith) => {
    var today = new Date();
    var todayNum = Number(today.getFullYear());
    //var birthDate = new Date(yearOfBrith); // left, if we decide to change saving the exact birth date.
    var age_now = today.getFullYear() - yearOfBrith; //birthDate.getFullYear();
    return age_now;
  };

  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
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

  render() {
    const request = this.props.request;
    const user = this.props.request.dancer;
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
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

    // TODO: test if really needed
    const requestDanceStyles = request.listOfDanceStyles ? (
      request.listOfDanceStyles.map((style) => (
        <li>{this.capitalize(style)}</li>
      ))
    ) : (
      <li> You have not entered any dance styles.</li>
    );

    /*
    // Contact Email popover as this is implemented later if there isstill time - Legacy
    const popover = (
      
      <Popover id="popover-basic">
        <Popover.Title as="h3">Contact data of {this.capitalize(user.name)} </Popover.Title>
        <Popover.Content>
          {" "}
          This functionality will be automated soon. For now just contact the{" "}
          {user.name} here: {user.email}{" "}
        </Popover.Content>
      </Popover>
    );*/

    return (
      <div className="form-group" key={request._id}>
        {this.props.profile ? (
          <Card
            id={request._id}
            style={{ width: "15rem" }}
            className="text-center"
          >
            <Card.Body onClick={this.handleShow}>
              {/*using Image instead of Card.Image to round the picture*/}
              <Image
                src={
                  request.event.picture
                    ? request.event.picture
                    : "img/placeholder_1000x600.png"
                }
                alt={request.event.name}
                style={{ width: "180px", height: "171px" }}
                roundedCircle
              />

              <Card.Title> </Card.Title>
              <Card.Text>
                <li className="cart-text list-unstyled">
                  <GiPartyFlags className="align-text-bottom" />{" "}
                  {request.event.title}
                </li>

                <li className="cart-text list-unstyled">
                  <MdLocationOn className="align-text-bottom" />{" "}
                  {request.event.city}
                </li>

                <li className="cart-text list-unstyled">
                  <MdEvent className="align-text-bottom" />
                  {days[new Date(request.event.startDate).getDay()]},{" "}
                  {new Date(request.event.startDate).getDate()}{" "}
                  {months[new Date(request.event.startDate).getMonth()]}{" "}
                  {new Date(request.event.startDate).getFullYear()}
                  {request.event.type === "course" ? (
                    <>
                      {" "}
                      &mdash; {
                        days[new Date(request.event.endDate).getDay()]
                      }, {new Date(request.event.endDate).getDate()}{" "}
                      {months[new Date(request.event.endDate).getMonth()]}{" "}
                      {new Date(request.event.endDate).getFullYear()} (
                      {request.event.interval})
                    </>
                  ) : (
                    ""
                  )}
                </li>
                <li className="cart-text list-unstyled">
                  <MdEvent className="align-text-left" /> Created on:{" "}
                  <label>
                    {moment(request.timestamp).format("dddd D.M.YYYY")}
                  </label>
                </li>
              </Card.Text>
            </Card.Body>

            <div class="card-footer bg-transparent">
              <Link
                onClick={this.handleShow}
                className="ml-auto mr-2 black-link align-text-bottom"
              >
                More Details
                <MdKeyboardArrowRight className="align-text-bottom" />
              </Link>
            </div>
          </Card>
        ) : (
          <Card
            id={request._id}
            style={{ width: "15rem" }}
            className="text-center"
          >
            <Card.Body onClick={this.handleShow}>
              {/*using Image instead of Card.Image to round the picture*/}
              <Image
                src={
                  user.picture
                    ? user.picture
                    : "img/placeholderDancerProfile.png"
                }
                alt={user.name}
                style={{ width: "180px", height: "171px" }}
                roundedCircle
              />
              <Card.Title> </Card.Title>
              <Card.Title> {user.name} </Card.Title>
              <Card.Text>
                <li className="cart-text list-unstyled">
                  <MdFace className="align-text-bottom" />{" "}
                  {this.calculate_age(user.yearOfBirth)}
                </li>

                <li className="cart-text list-unstyled">
                  <MdStarHalf className="align-text-bottom" />{" "}
                  {this.capitalize(user.proficiencyLevel)}
                </li>

                <li className="cart-text list-unstyled">
                  <GiPartyFlags className="align-text-bottom" />{" "}
                  {request.event.title}
                </li>

                <li className="cart-text list-unstyled">
                  <MdLocationOn className="align-text-bottom" />{" "}
                  {request.event.city}
                </li>

                <li className="cart-text list-unstyled">
                  <MdEvent className="align-text-bottom" />
                  {days[new Date(request.event.startDate).getDay()]},{" "}
                  {new Date(request.event.startDate).getDate()}{" "}
                  {months[new Date(request.event.startDate).getMonth()]}{" "}
                  {new Date(request.event.startDate).getFullYear()}
                  {request.event.type === "course" ? (
                    <>
                      {" "}
                      &mdash; {
                        days[new Date(request.event.endDate).getDay()]
                      }, {new Date(request.event.endDate).getDate()}{" "}
                      {months[new Date(request.event.endDate).getMonth()]}{" "}
                      {new Date(request.event.endDate).getFullYear()} (
                      {request.event.interval})
                    </>
                  ) : (
                    ""
                  )}
                </li>
              </Card.Text>
            </Card.Body>

            <div class="card-footer bg-transparent">
              <Link
                onClick={this.handleShow}
                className="ml-auto mr-2 black-link align-text-bottom"
              >
                More Details
                <MdKeyboardArrowRight className="align-text-bottom" />
              </Link>
            </div>
          </Card>
        )}

        <ContactModal
          show={this.state.showContactModal}
          onHide={this.handleContactCancel}
          id={request._id}
          name={user.name}
        />

        <Modal
          show={this.state.showModal}
          onHide={this.handleCancel}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            {" "}
            <Col> </Col>
            <Col>
              <Modal.Title>
                {" "}
                {this.props.profile ? (
                  <Image
                    src={
                      request.event.picture
                        ? request.event.picture
                        : "img/placeholder_1000x600.png"
                    }
                    alt={request.event.name}
                    style={{ width: "180px", height: "171px" }}
                    roundedCircle
                  />
                ) : (
                  <Image
                    src={
                      user.picture
                        ? user.picture
                        : "img/placeholderDancerProfile.png"
                    }
                    alt={user.name}
                    style={{ width: "180px", height: "171px" }}
                    roundedCircle
                  />
                )}
              </Modal.Title>
            </Col>
            <Col></Col>
          </Modal.Header>

          <Modal.Body closeButton>
            <Container fluid>
              {/* Requesting User Information_______________________*/}
              <h4>{user.name}</h4>
              {/* Requesting User - Age Information*/}
              <Row>
                <Col>
                  {" "}
                  <MdFace className="align-text-bottom" />{" "}
                  <label>My age...</label>{" "}
                </Col>
                <Col className="align-text-right">
                  {" "}
                  <label>{this.calculate_age(user.yearOfBirth)} </label>
                </Col>
              </Row>

              {/* Requesting User - Height Information*/}
              <Row>
                <Col>
                  {" "}
                  <GiBodyHeight className="align-text-bottom" />{" "}
                  <label>My height...</label>{" "}
                </Col>

                <Col>
                  {" "}
                  <label>{user.height} cm</label>{" "}
                </Col>
              </Row>

              {/* Requesting User - Proficiency Information*/}
              <Row>
                <Col>
                  {" "}
                  <MdStarHalf className="align-text-bottom" />{" "}
                  <label>My proficiency experience...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>{this.capitalize(user.proficiencyLevel)}</label>{" "}
                </Col>
              </Row>

              {/* User - Style Information*/}
              <Row>
                <Col>
                  {" "}
                  <MdFavorite className="align-text-bottom" />{" "}
                  <label>I usually enjoy to dance...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <ul>
                    {user.listOfDanceStyles ? (
                      user.listOfDanceStyles.map((style) => {
                        return <li>{this.capitalize(style)}</li>;
                      })
                    ) : (
                      <li></li>
                    )}{" "}
                  </ul>{" "}
                </Col>
              </Row>

              {/* Request Information_______________________*/}
              {/* Request  search "headline"*/}
              <Row>
                <label>
                  <b>I am looking for...</b>
                </label>
              </Row>
              {/* Preferred - Gender */}
              <Row>
                <Col>
                  {" "}
                  <MdPerson className="align-text-bottom" />{" "}
                  <label> Gender... </label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>
                    {request.listofGenders.map((gender) => (
                      <li className="cart-text list-unstyled">
                        {this.capitalize(gender)}
                      </li>
                    ))}
                  </label>{" "}
                </Col>
              </Row>

              {/* Preferred - Age Range*/}
              <Row>
                <Col>
                  {" "}
                  <MdFace className="align-text-bottom" />{" "}
                  <label>Age range...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>
                    {" "}
                    {request.prefAgeMin} - {request.prefAgeMax}
                  </label>{" "}
                </Col>
              </Row>

              {/* Preferred - Proficiency Level*/}
              <Row>
                <Col>
                  {" "}
                  <MdStarHalf className="align-text-bottom" />{" "}
                  <label>Dancing proficiency level...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>
                    {request.listOfProficiencyLevels.map((level) => (
                      <li className="cart-text list-unstyled">
                        {this.capitalize(level)}
                      </li>
                    ))}
                  </label>{" "}
                </Col>
              </Row>

              <Row>
                <Col>
                  {" "}
                  <MdFavorite className="align-text-bottom" />{" "}
                  <label>To dance...</label>{" "}
                </Col>
                <Col>
                  <ul>{requestDanceStyles} </ul>
                </Col>
              </Row>

              <Row>
                <Col>
                  <MdEvent className="align-text-bottom" />{" "}
                  <label>For the following event: </label>
                </Col>
                <Col>
                  {request.event ? (
                    <label>
                      <a
                        href={`/events/single/${this.props.request.event._id}`}
                        className="dancevent"
                      >
                        <b>{request.event.title}</b>
                      </a>{" "}
                      on {moment(request.startDate).format("dddd D.M.YYYY")} in{" "}
                      {request.event.city}
                    </label>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>

              {/*Request - Description */}
              <Row>
                <Col>
                  {" "}
                  <label>Desciption: </label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label> {request.description} </label>{" "}
                </Col>
              </Row>

              <Row>
                <Col></Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <MdEvent className="align-text-left" /> Created on:{" "}
            <label>{moment(request.timestamp).format("dddd D.M.YYYY")}</label>
            <Button variant="light" onClick={this.handleCancel}>
              {" "}
              Cancel{" "}
            </Button>
            {!this.props.profile && (
              <Button
                className="btn button-pink"
                onClick={this.handleContactShow}
              >
                Contact
              </Button>
              /*
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button className="btn button-pink"> Contact </Button>
              </OverlayTrigger>*/
            )}
            {this.props.profile && (
              <div>
                <Button variant="danger" onClick={this.handleDeleteShow}>
                  {" "}
                  Delete{" "}
                </Button>{" "}
                {/*<Button variant="primary" onClick={this.handleCancel}>
                  {" "}
                  Update{" "}
                </Button>*/}
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showDeletionDialog}
          onHide={this.handleDeleteCancel}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the request for the{" "}
            <b>{request.event.title} </b>? It will not be visible to users of
            the platform anymore. This cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleDeleteCancel}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                this.handleDelete(request._id);
              }}
            >
              Understood
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PartnerRequestForm;
