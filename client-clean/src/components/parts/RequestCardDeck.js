import React from 'react';
//router
import { Link } from "react-router-dom";
//icons
import { MdMailOutline, MdLocationOn, MdPhone, MdLockOutline, MdFavorite, MdFace, MdStarHalf, MdEvent, MdCreditCard } from "react-icons/md";
//moment
import moment from 'moment';


const RequestCardDeck = ({state}) => {

  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function(string) {
    return string.toUpperCase();
    });
    return capitalStr;
  }


  return (
    <div className="row justify-content-start">

    {state.requests.map((request) => (

        <div className="col-md-4 col-lg-3 mt-4">
        <div className="card event-card shadow-sm">
          <div class="card-body d-flex flex-column">
            <p class="card-title">{request.description}</p>
            <li className="cart-text list-unstyled"><MdFace/> {request.listOfGenders}</li>
            <li className="cart-text list-unstyled"><MdEvent /> Created on: { moment(request.timestamp).format('dddd D.M.YYYY')}</li>
            <li className="cart-text list-unstyled"><MdFace/> {request.listOfProficiencyLevels}</li>
            <MdFavorite className="mr-1" /> {request.listOfDanceStyles.map((danceStyle) => ( <span className="mr-1 badge border-pink">{this.capitalize(danceStyle)}</span> ))}

            <div className="text-center mt-auto">
            <Link
              className="btn button-pink"
              to={"/myrequests"+request._id}
            >Go to partner request</Link>
            </div>
          </div>
        </div>
        </div>


    ))}
    </div>
  )
}

export default RequestCardDeck;
