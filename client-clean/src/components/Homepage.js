import React from "react";
import LoginForm from "./forms/LoginForm";
import HomepageBanner from "./HomepageBanner";

const Homepage = ({ state }) => {
  if (window.sessionStorage.secret_token != null) {
    /*Display personalized content when logged in*/
    return (
      <React.Fragment>
        <HomepageBanner />
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
    return <HomepageBanner />;
  }
};

export default Homepage;
