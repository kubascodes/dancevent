import React from "react";
import { Route, Link, BrowserRouter } from "react-router-dom";

const NavBar = ({ state }) => {
  const handleLogout = (event) => {
    console.log("clicked logout");
    window.sessionStorage.removeItem("secret_token");
  };

  /*When you're logged in, display a different NavBar*/
  if (window.sessionStorage.secret_token != null) {
    return (
      <div className="navBar">
        <nav
          id="navBar"
          className="navbar navbar-expand navbar-light container-fluid border-black border-bottom shadow-sm bg-white"
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
                  className="font-weight-bolder text-decoration-none"
                  to="/"
                >
                  Homepage
                </Link>
              </li>
              {/* This Link is currently not shown, not sure what's the problem */}
              <li className="nav-item nav-link">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/events"
                >
                  Events
                </Link>
              </li>
              {/*
          <li className="nav-item nav-link "><Link className="font-weight-bolder text-body text-decoration-none" to="/register">Register</Link></li>
          */}
              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/register/organizer"
                >
                  Register Organizer
                </Link>
              </li>
              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/register/dancer"
                >
                  Register Dancer
                </Link>
              </li>
              <li className="nav-item nav-link text-secondary text-decoration-none">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav navbar-right">
              <li
                className="nav-item nav-link text-secondary "
                onClick={handleLogout}
              >
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
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
        <nav className="navbar navbar-expand navbar-light container-fluid border-bottom border-black shadow-sm bg-white">
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
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/"
                >
                  Homepage
                </Link>
              </li>
              {/*
          <li className="nav-item nav-link "><Link className="font-weight-bolder text-body text-decoration-none" to="/register">Register</Link></li>
          */}
              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/register/organizer"
                >
                  Register Organizer
                </Link>
              </li>
              <li className="nav-item nav-link ">
                <Link
                  className="font-weight-bolder text-body text-decoration-none"
                  to="/register/dancer"
                >
                  Register Dancer
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav navbar-right">
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
