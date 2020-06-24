import React from "react";
import LoginForm from "./forms/LoginForm";
import Homepage_Banner from "./Homepage_Banner";

const Homepage = ({ state }) => {
  if (window.sessionStorage.secret_token != null) {
    /*Display personalized content when logged in*/
    return (
      <React.Fragment>
        <Homepage_Banner />
        <hr />
        <div className="container">
          <h2 className="">Upcoming Events</h2>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-3"></div>
            <div className="col-3"></div>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    /*Display public content not logged in*/
    return <Homepage_Banner />;
  }
};

export default Homepage;
