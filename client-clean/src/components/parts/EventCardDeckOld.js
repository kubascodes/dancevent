import React from "react";
//router
import { Link } from "react-router-dom";
//icons
import {
  MdMailOutline,
  MdLocationOn,
  MdPhone,
  MdLockOutline,
  MdFavorite,
  MdFace,
  MdStarHalf,
  MdEvent,
  MdCreditCard,
} from "react-icons/md";
//moment
import moment from "moment";

const EventCardDeckOld = ({ state }) => {
  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  return (
    <div className="row justify-content-start">
      {state.events.map((ev) => (
        <div className="col-md-4 col-lg-3 mt-4">
          <div className="card event-card shadow-sm">
            <div className="crop-box crop-to-fit">
              <img src={ev.picture} class="card-img-top" alt="..." />
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{ev.title}</h5>
              <li className="cart-text list-unstyled">
                <MdLocationOn /> {ev.location} {ev.city}
              </li>
              <li className="cart-text list-unstyled">
                <MdEvent /> {moment(ev.startDate).format("dddd D.M.YYYY")} at{" "}
                {moment(ev.startDate).format("H")}h
              </li>
              <li className="cart-text list-unstyled">
                <MdCreditCard /> {ev.price} EUR
              </li>
              <div className="text-center mt-auto">
                <Link
                  className="btn button-pink"
                  to={"/events/single" + ev._id}
                >
                  Go to event
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCardDeckOld;
