import React from "react";
import { Route, Link, BrowserRouter } from "react-router-dom";
import { createAvatarComponent, SrcSource, IconSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource, IconSource] });

const NavBar = ({ state, logOut }) => {
  /*
  const handleLogout = (event) => {
    console.log("clicked logout");
    window.sessionStorage.removeItem("secret_token");
  };
  */
  const componentDidMount = (state) => {
    // Otherwise each time App.js is re-rendered the state is set to the default values
    console.log(state);
  };

  /*When you're logged in, display a different NavBar*/
  if (state.secret_token) {
    return (
      <div className="navBar">
        <nav
          id="navBar"
          className="navbar navbar-expand d-md-flex d-inline-flex align-items-center container-fluid border-bottom-pink pink-background shadow-sm"
        >
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav">
              <li className="nav-item nav-link  text-secondary ">
                <Link
                  className="font-weight-bolder dancevent text-decoration-none"
                  to="/"
                >
                  Dancevent
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/events"
                >
                  Events
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/dancepartner"
                >
                  Dance Partners
                </Link>
              </li>
              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/myevents"
                >
                  My Events
                </Link>
              </li>
              <li className="nav-item nav-link text-secondary text-decoration-none">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/events/create"
                >
                  Create Event
                </Link>
              </li>
              {/**  // Request can only be created from an event page
              <li className="nav-item nav-link text-secondary text-decoration-none">
                  <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/createrequest" >
                  Create Request
              </Link>
              </li>
              */}
            </ul>

            <ul className="nav navbar-nav ml-auto flex-row justify-content-start flex-nowrap">
              <li className="nav-item nav-link text-secondary text-decoration-none">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/profile"
                >
                  <Avatar
                    round="50%"
                    size="30"
                    src={state.profilePicture}
                    name={state.name}
                    color={Avatar.getRandomColor("sitebase", [
                      "#f0f0fc",
                      "#f8bfa8",
                      "#e3dcf1",
                    ])}
                    className="align-middle"
                  />
                </Link>
              </li>

              <li
                className="nav-item nav-link text-secondary align-middle"
                onClick={logOut}
              >
                <Link
                  className="font-weight-bolder text-body text-decoration-none align-middle"
                  to="/"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  } else {
    /*When you're not logged in, display a public NavBar*/
    return (
      <div className="navBar">
        <nav className="navbar navbar-expand container-fluid border-bottom-pink pink-background shadow-sm">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav">
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder dancevent text-decoration-none"
                  to="/"
                >
                  Dancevent
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/events"
                >
                  Events
                </Link>
              </li>
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/dancepartner"
                >
                  Dance Partners
                </Link>
              </li>

              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/login"
                >
                  My Events
                </Link>
              </li>
              {/**  // Request can only be created from an event page
              <li className="nav-item nav-link text-secondary text-decoration-none">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/createrequest"
                >
                  Create Request
                </Link>
              </li>
              */}
            </ul>

            <ul className="nav navbar-nav ml-auto flex-row justify-content-start flex-nowrap">
              <li className="nav-item nav-link text-secondary">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
};

export default NavBar;
