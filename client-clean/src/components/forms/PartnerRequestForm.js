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
  MdCreditCard, MdKeyboardArrowRight,
} from "react-icons/md";
import {GiPartyFlags, GiBodyHeight} from "react-icons/gi";
import Select from "react-select";
import { Link } from "react-router-dom";
import moment from "moment";

class PartnerRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  handleCancel = () => {
    this.setState({ showModal: false });
  };

  handleShow = () => {
    this.setState({ showModal: true });
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
      request.listOfDanceStyles.map((style) => <li>{style}</li>)
    ) : (
      <li> You have not entered any dance styles.</li>
    );

    // Contact Email popover as this is implemented later if there isstill time
    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Contact data of {user.name} </Popover.Title>
        <Popover.Content>
          {" "}
          This functionality will be automated soon. For now just contact the{" "}
          {user.name} here: {user.email}{" "}
        </Popover.Content>
      </Popover>
    );

    return (
      <div className="form-group" key={request._id}>
        <Card
          id={request._id}
          style={{ width: "15rem" }}
          className="text-center"
        >
          <Card.Body onClick={this.handleShow}>
            {/*using Image instead of Card.Image to round the picture*/}
            <Image
              src={
                user.picture ? user.picture : "img/placeholderDancerProfile.png"
              }
              alt={user.name}
              style={{ width: "180px", height: "171px" }}
              roundedCircle
            />
            <Card.Title> </Card.Title>
            <Card.Title> {user.name} </Card.Title>
            <Card.Text>
              <li className="cart-text list-unstyled">
        <MdFace className="align-text-bottom" />{this.calculate_age(user.yearOfBirth)}
               </li>
              <li className="cart-text list-unstyled">
        <MdStarHalf className="align-text-bottom" />{request.listOfProficiencyLevels}
               </li>
                <li className="cart-text list-unstyled">
                <GiPartyFlags className="align-text-bottom"/> {request.event.title}
                </li>
        <li className="cart-text list-unstyled">
        <MdLocationOn className="align-text-bottom"/> {request.event.city}
        </li>
              <li className="cart-text list-unstyled">
                <MdEvent className="align-text-bottom" />
                {days[new Date(request.event.startDate).getDay()]}, {new Date(request.event.startDate).getDate()}{" "}
                  {months[new Date (request.event.startDate).getMonth()]} {new Date (request.event.startDate).getFullYear()}
                  {request.event.type === "course" ? (
                      <>
                      {" "}
                      &mdash; {days[new Date(request.event.endDate).getDay()]}, {new Date(request.event.endDate).getDate()}{" "}
                    {months[new Date(request.event.endDate).getMonth()]} {new Date(request.event.endDate).getFullYear()} (
                      {request.event.interval})
                  </>
                  ) : (
                      ""
                  )}
              </li>
            </Card.Text>
            {/*TODO: Add event location*/}
            {/*TODO: Add event date*/}
          </Card.Body>
    <div class="card-footer bg-transparent">
        <Link onClick={this.handleShow} className="ml-auto mr-2 black-link align-text-bottom">More Details<MdKeyboardArrowRight className="align-text-bottom" /></Link>
          {/*<Card.Footer>
                                 <Button id="deleteRequest" onClick={()=>{this.props.deleteRequest(request._id)}}>Delete Request</Button>
                             </Card.Footer>*/}
                             </div>
        </Card>

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
            <Modal.Title>
        <Row>
        <Col>
                <Image
                src={
                  user.picture
                      ? user.picture
                      : "img/placeholderDancerProfile.png"
                }
                alt={user.name}
                style={{ width: "100px", height: "95px" }}
                roundedCircle
                />
                    </Col>
                    <Col>
                {user.name}
        </Col>
        </Row>
                </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container fluid>
              {/* Requesting User Information_______________________*/}

              {/* Requesting User - Age Information*/}
              <Row>
                <Col>
                  {" "}
    <MdFace className="align-text-bottom" />{" "}<label>My age...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>{this.calculate_age(user.yearOfBirth)} </label>
                </Col>
              </Row>

              {/* Requesting User - Height Information*/}
              <Row>
                <Col>
                  {" "}
    <GiBodyHeight className="align-text-bottom"/>  {" "}<label>My height...</label>{" "}
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
    <MdStarHalf className="align-text-bottom" />{" "}<label>My proficiency experience...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>{user.proficiencyLevel}</label>{" "}
                </Col>
              </Row>

              {/* User - Style Information*/}
              <Row>
                <Col>
                  {" "}
    <MdFavorite className="align-text-bottom"/>{" "}<label>I usually enjoy to dance...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <ul>
                    {user.listOfDanceStyles ? ( user.listOfDanceStyles.map((style) => {
                      return <li>{style}</li>;
                    })) : (<li></li>)
                    }{" "}
                  </ul>{" "}
                </Col>
              </Row>

              {/* Request Information_______________________*/}
              {/* Request  search "headline"*/}
              <Row>
                <label>I am looking for...</label>
              </Row>
              {/* Preferred - Gender */}
              <Row>
                <Col>
                  {" "}
    <MdPerson className="align-text-bottom" />{" "}<label> Gender... </label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>{request.listofGenders}</label>{" "}
                </Col>
              </Row>

              {/* Preferred - Age Range*/}
              <Row>
                <Col>
                  {" "}
    <MdFace className="align-text-bottom" />{" "}<label>Age range...</label>{" "}
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
    <MdStarHalf className="align-text-bottom" />{" "}<label>Dancing proficiency level...</label>{" "}
                </Col>
                <Col>
                  {" "}
                  <label>{request.listOfProficiencyLevels}</label>{" "}
                </Col>
              </Row>

              <Row>
                <Col>
                  {" "}
    <MdFavorite className="align-text-bottom"/>{" "}<label>To dance...</label>{" "}
                </Col>
                <Col>
                  <ul>{requestDanceStyles} </ul>
                </Col>
              </Row>

    <Row>
    <Col>
    {" "}
    <GiPartyFlags className="align-text-bottom"/>  {" "}<label>At: </label>{" "}
    </Col>
    <Col> {request.event.title}</Col>
    </Row>

              {/* City - Event*/}
              <Row>
                <Col>
                  {" "}
    <MdLocationOn className="align-text-bottom"/><label> In: </label>{" "}
                </Col>
                <Col> {request.event.city} </Col>
              </Row>

              {/* Preferred - Events
                    //TODO: If rquest only belong to one event: change text
                    //TODO: add event link and display them*/}
              <Row>
                <Col>
                  {" "}
    <MdEvent className="align-text-bottom"/> {" "}<label>On: </label>{" "}
                </Col>
                <Col><label>
    {days[new Date(request.event.startDate).getDay()]}, {new Date(request.event.startDate).getDate()}{" "}
    {months[new Date (request.event.startDate).getMonth()]} {new Date (request.event.startDate).getFullYear()}
    {request.event.type === "course" ? (
        <>
        {" "}
        &mdash; {days[new Date(request.event.endDate).getDay()]}, {new Date(request.event.endDate).getDate()}{" "}
      {months[new Date(request.event.endDate).getMonth()]} {new Date(request.event.endDate).getFullYear()} (
        {request.event.interval})
    </>
    ) : (
        ""
    )}
    </label></Col>
              </Row>
              <Row>
              <Col>
              {" "}
    <MdEvent className="align-text-bottom"/> {" "} <label>Time: </label>{" "}
              </Col>
              <Col> {this.convertTime24to12(
                        new Date(request.event.startDate).getHours(),
          new Date(request.event.startDate).getMinutes()
      )}{" "}
        <>&mdash;</>{" "}
          {this.convertTime24to12(
              new Date(request.event.endDate).getHours(),
              new Date(request.event.endDate).getMinutes()
          )}</Col>
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
                <Col>

                </Col>

              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
    <MdEvent className="align-text-left" /> Created on:{" "}
    {moment(request.timestamp).format("dddd D.M.YYYY")}
            <Button variant="secondary" onClick={this.handleCancel}>
              {" "}
              Cancel{" "}
            </Button>
            {!this.props.profile && (
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button variant="primary"> Contact </Button>
              </OverlayTrigger>
            )}
            {/*this.props.profile && (
              <div>
                <Button
                  variant="danger"
                  onClick={() => {
                    this.handleDelete(request._id);
                  }}
                >
                  {" "}
                  Delete{" "}
                </Button>{" "}
                <Button variant="primary" onClick={this.handleCancel}>
                  {" "}
                  Update{" "}
                </Button>
              </div>
                )*/}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default PartnerRequestForm;
