import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const containerStyle = (imgUrl) => {
  return {
    backgroundSize: "cover",
    backgroundImage: "url(" + imgUrl + ")",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "right",
  };
};

const HomepageBanner = (props) => {
  return (
    <>
      <div
        className="container"
        style={containerStyle("img/dance-course_muted.jpg")}
      >
        {props.userType === "Organizer" ? (
          <>
            <h1 style={{ marginLeft: "50%", marginRight: "2%" }}>
              Have a new dance course coming up?
            </h1>
            <h1 style={{ marginLeft: "50%", marginRight: "2%" }}>
              Create events and attract new customers!
            </h1>
          </>
        ) : (
          <>
            <h1 style={{ marginLeft: "50%", marginRight: "2%" }}>
              Looking for a dance partner for the next ball? Want to find out
              what's happening on Friday night?
            </h1>
            <h1 style={{ marginLeft: "50%", marginRight: "2%" }}>
              Find partners and events and just dance!
            </h1>
          </>
        )}

        {window.sessionStorage.secret_token == null ? (
          <a
            className="btn btn-lg button-pink mt-2"
            href="/login"
            role="button"
            style={{ marginLeft: "70%", marginRight: "2%" }}
          >
            Login to find dance partners
          </a>
        ) : props.userType === "Dancer" ? (
          <a
            className="btn btn-lg button-pink mt-2"
            href="/dancepartner"
            role="button"
            style={{ marginLeft: "75%", marginRight: "2%" }}
          >
            Find dance partners
          </a>
        ) : (
          <a
            className="btn btn-lg button-pink mt-2"
            href="/events/create"
            role="button"
            style={{ marginLeft: "75%", marginRight: "2%" }}
          >
            Create a new event
          </a>
        )}
      </div>
    </>
  );
};
export default HomepageBanner;
