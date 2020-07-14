import React from "react";
import {Button, Card, Col, Container, Row, Popover, OverlayTrigger, Image} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import {Link} from "react-router-dom";

class RequestForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    handleCancel = () => {
        this.setState({ showModal: false });
    };


    handleShow = () => {
        this.setState({ showModal: true });
    };

    calculate_age = (yearOfBrith) => {

        var today = new Date();
        var todayNum = Number(today.getFullYear());
        //var birthDate = new Date(yearOfBrith); // left, if we decide to change saving the exact birth date.
        var age_now = today.getFullYear() - yearOfBrith; //birthDate.getFullYear();
        return age_now;
    }



    render() {
        const request = this.props.request;
        const requestDanceStyles = request.listOfDanceStyles ? (
            request.listOfDanceStyles.map((style) =>
            <li>{style}</li>
        )
    ) : (<li> You have not entered any dance styles.</li>
    );

        // Contact Email popover as this is implemented later if there isstill time
        const popover = (
            <Popover id="popover-basic">
                <Popover.Title as="h3">Contact data of {request.dancerId.name} </Popover.Title>
                <Popover.Content> This functionality will be automated soon. For now just contact the {request.dancerId.name} here: {request.counterfeitEmail} </Popover.Content>
            </Popover>
        );

        return (

            <div className="form-group" key={request._id} >
            <Card
        id={request._id}
        style={{ width: "15rem" }}
        className="text-center"
            >
                    <Card.Body onClick={this.handleShow}>
            {/*usinf image instead of Card.Image to round the picture*/}
                        <Image
                            src={
                                request.dancerId.picture
                                ? request.dancerId.picture
                                : "img/placeholderDancerProfile.png"}
                            alt={request.dancerId.name}
                            style={{ width: "180px", height: "171px" }}roundedCircle />
                        <Card.Title> </Card.Title>
                        <Card.Title> {request.dancerId.name} </Card.Title>
                        <Card.Text>{request.listOfProficiencyLevels}</Card.Text>
                    </Card.Body>
                    {/*<Card.Footer>
                                 <Button id="deleteRequest" onClick={()=>{this.props.deleteRequest(request._id)}}>Delete Request</Button>
                             </Card.Footer>*/}
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
                        <Modal.Title >
                            {request.dancerId.name}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Container fluid>
        <Image
        src={
            request.dancerId.picture
                ? request.dancerId.picture
                : "img/placeholderDancerProfile.png"}
        alt={request.dancerId.name}
        style={{ width: "100px", height: "95px" }}roundedCircle />
                        {/* Requesting User Information_______________________*/}

                        {/* Requesting User - Age Information*/}
                        <Row>
                            <Col > <label>My age...</label> </Col>
                            <Col> <label>{this.calculate_age(request.dancerId.yearOfBirth)} </label></Col>
                        </Row>

                        {/* Requesting User - Height Information*/}
                        <Row>
                            <Col > <label>My height...</label> </Col>

                            <Col> <label>{request.dancerId.height} cm</label> </Col>
                        </Row>

                        {/* Requesting User - Proficiency Information*/}
                        <Row>
                            <Col > <label>My proficiency experience...</label> </Col>
                            <Col> <label>{request.dancerId.proficiencyLevel}</label> </Col>
                        </Row>

                        {/* User - Style Information*/}
                        <Row>
                            <Col > <label>I usually enjoy to dance...</label> </Col>
                            <Col> <ul>{request.dancerId.listOfDanceStyles.map((style) => {
                                return <li>{style}</li>
                            })} </ul> </Col>
                        </Row>

                        {/* Request Information_______________________*/}
                        {/* Request  search "headline"*/}
                        <Row>
                                <label>I am looking for...</label>
                        </Row>
                        {/* Preferred - Gender */}
                        <Row>
                            <Col > <label> Gender... </label> </Col>
                            <Col> <label>{request.listofGenders}</label> </Col>
                        </Row>

                        {/* Preferred - Age Range*/}
                        <Row>
                            <Col > <label>Age range...</label> </Col>
                            <Col> <label> {request.prefAgeMin} - {request.prefAgeMax}</label> </Col>
                        </Row>

                        {/* Preferred - Proficiency Level*/}
                        <Row>
                            <Col > <label>Dancing proficiency level...</label> </Col>
                            <Col> <label>{request.listOfProficiencyLevels}</label> </Col>
                        </Row>

                        <Row>
                            <Col > <label>To dance...</label> </Col>
                            <Col>
                                <ul>{requestDanceStyles} </ul>
                            </Col>
                        </Row>

                        {/* City - Event*/}
                        <Row>
                            <Col > <label> In:  </label> </Col>
                            <Col> {/*TODO: add event city*/} </Col>
                        </Row>

                        {/* Preferred - Events
                    //TODO: If rquest only belong to one event: change text
                    //TODO: add event link and display them*/}
                        <Row>
                            <Col > <label>The events I am interested in are: </label> </Col>
                            <Col> {/*TODO: Add events*/}</Col>
                        </Row>

                        {/*Request - Description */}
                        <Row>
                            <Col> <label>Desciption: </label> </Col>
                            <Col> <label> {request.description} </label> </Col>
                        </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCancel}> Cancel </Button>
                        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                            <Button variant="primary"> Contact </Button>
                        </OverlayTrigger>
                    </Modal.Footer>
                </Modal>

            </div>


        );

    }

}

export default RequestForm;
