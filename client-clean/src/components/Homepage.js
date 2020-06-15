import React from 'react';
import LoginForm from './forms/LoginForm';
const Homepage = ({state}) => {

  if (window.sessionStorage.secret_token != null) {
    /*Display personalized content when logged in*/
    return (

      <div  className="img-homepage">
      </div>
    )
  }
  else {
    /*Display public content not logged in*/
    return (

      <div className="img-homepage">

      </div>
    )
  }
}

export default Homepage
