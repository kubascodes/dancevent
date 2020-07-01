import React from "react";
import HomepageBanner from "./HomepageBanner";
import EventCard from "./EventCard";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingEvents: [],
    };
  }

  /** 
  componentWillMount = () => {
    // Fetch the events the logged in user is interested in
    if (window.sessionStorage.secret_token !== null) {
      fetch("/users/")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.setState({ events: data });
        })
        .catch(console.log);
    }
  };
  */
  render() {
    if (
      window.sessionStorage.secret_token !== null &&
      window.sessionStorage.secret_token !== undefined
    ) {
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
  }
}

export default Homepage;
