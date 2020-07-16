import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const HomepageBanner = () => {
  return (
    <Container>
      <h1 className="text-center">Find dance partners, events, and schools!</h1>
      <hr />
      <Row className="">
        <Col>
          <Image
            src="img/dance-partners_800x800.jpg"
            rounded
            fluid
            alt="dance partners"
          />
        </Col>
        <Col>
          <Image
            src="img/dance-party_800x800.jpg"
            rounded
            fluid
            alt="dance party"
          />
        </Col>
        <Col>
          <Image
            src="img/dance-course_800x800.jpg"
            rounded
            fluid
            alt="dance course"
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="col-4 text-center">
          <span className="">
            Looking for a dance partner for the next ball?
          </span>
        </Col>
        <Col className="col-4 text-center">
          <span className="">So what's happening on Friday night?</span>
        </Col>
        <Col className="col-4 text-center">
          <span className="">
            If you're new to dancing, it's easy to learn!
          </span>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="col-4 text-center">
          <Link to="/dancepartner">
            <Button className="button-pink" size="lg">
              Find a partner
            </Button>
          </Link>
        </Col>
        <Col className="col-4 text-center">
          <Link to="/events">
            <Button className="button-pink" size="lg">
              Find upcoming events
            </Button>
          </Link>
        </Col>
        <Col className="col-4 text-center">
          <Button className="button-pink" size="lg">
            Find a dance school
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default HomepageBanner;
