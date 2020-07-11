import React, { Component } from "react";
import { Redirect } from "react-router-dom";

const RouteAuthentication = (Component) => {
  const AuthRoute = () => {
    //check if the user has a jwt token
    console.log(window.sessionStorage.secret_token);
    const isAuth = window.sessionStorage.secret_token;
    //if he has, display the requested component
    if (isAuth) {
      return (<Component />);
    }
    //if not, redirect to the homepage
    else {
      return(<Redirect to="/" />);
    }
  };
  return AuthRoute;
};
export default RouteAuthentication;
