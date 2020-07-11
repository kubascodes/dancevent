import React, { Component } from "react";
import { Redirect } from "react-router-dom";

const RouteRedirect = (Component) => {
  const AuthRoute = () => {
    console.log(Component);
    //check if the user has a jwt token
    const isAuth = window.sessionStorage.secret_token;
    //if he has no secret token, display the requested component (i.e. register user)
    if (!isAuth) {
      return (<Component />);
    }
    //if not, redirect to the homepage
    else {
      return(<Redirect to="/" />);
    }
  };
  return AuthRoute;
};
export default RouteRedirect;
