import React from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { CriticalAlert } from "../helpers/Alert";

class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      showAltert: false,
      errorMessage: "",
    };
  }

  hideAlert = () => {
    this.setState({ showAltert: !this.state.showAltert });
  };

  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };

  pushEvent = (event) => {
    event.preventDefault();

    //saving the auth token
    const token = window.sessionStorage.secret_token;
    const body = {
      id: this.props.id,
      text: this.state.message,
    };

    console.log(body);

    fetch("/request/contact", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json; charset=utf-8",
      },
      //body must be stringify to be readable by backend
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((res) => {
        this.setState({ message: "" });
        this.props.onHide();
      })
      .catch((err) => {
        this.setState({
          showAltert: true,
          errorMessage: "Error occured while sending to server.",
        });
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <CriticalAlert
          show={this.state.showAltert}
          change={this.hideAlert}
          text={this.state.errorMessage}
        />
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header>
            <Modal.Title>Contact {this.props.name}</Modal.Title>
          </Modal.Header>
          <form
            className="form-group"
            id="ContactForm"
            onSubmit={this.pushEvent}
          >
            <Modal.Body>
              <Row>
                <Col>
                  Write a short text for {this.props.name}. We will send{" "}
                  {this.props.name} this text via email and add your email so
                  you can be conntacted.
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      name="message"
                      id="description"
                      onChange={this.onChangeInput}
                      value={this.state.message}
                      rows="4"
                      required
                    />
                  </div>
                </Col>
              </Row>
              <Row></Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={this.props.onHide}>
                {" "}
                Cancel{" "}
              </Button>
              <div className="form-group">
                <input
                  type="submit"
                  className="btn button-pink"
                  value="Contact"
                />
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default ContactModal;
