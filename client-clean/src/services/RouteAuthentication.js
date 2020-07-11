import React, { Component } from "react";
import { Redirect } from "react-router-dom";

const RouteAuthentication = (Component, props) => {
  const AuthRoute = (props) => {
    console.log(props);
    //check if the user has a jwt token
    const isAuth = window.sessionStorage.secret_token;
    //if he has, display the requested component
    if (isAuth) {
      return (<Component {...props} />);
    }
    //if not, redirect to the homepage
    else {
      return(<Redirect to="/" {...props} />);
    }
  };
  return AuthRoute;
};
export default RouteAuthentication;
