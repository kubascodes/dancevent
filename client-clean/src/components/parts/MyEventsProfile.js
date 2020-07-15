import React from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import Button from "react-bootstrap/Button";
import moment from 'moment';
import { MdMailOutline, MdLocationOn, MdPhone, MdLockOutline, MdFavorite, MdFace, MdStarHalf, MdEvent, MdCreditCard } from "react-icons/md";
//profile avatar
import { createAvatarComponent, SrcSource } from 'react-avatar';
const Avatar = createAvatarComponent({ sources: [SrcSource]});


class MyEventsProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function(string) {
    return string.toUpperCase();
    });
    return capitalStr;
  }


  render() {
      if (this.props.state.user.userType ==="Organizer") {
        return (
          <div>
            <h5 className="text-center mt-2">
            <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/myevents"
            >Your Hosted Events</Link>
            </h5>

            <div className="row justify-content-start">

            {this.props.state.events.map((ev) => (

                <div className="col-md-4 col-lg-3 mt-4">
                <div className="card event-card shadow-sm">
                  <div className="crop-box crop-to-fit">
                  <img src={ev.picture} class="card-img-top" alt="..." />
                  </div>
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{ev.title}</h5>
                    <li className="cart-text list-unstyled"><MdLocationOn /> {ev.location} {ev.city}</li>
                    <li className="cart-text list-unstyled"><MdEvent /> { moment(ev.startDate).format('dddd D.M.YYYY')} at { moment(ev.startDate).format('H')}h</li>
                    <li className="cart-text list-unstyled"><MdCreditCard /> {ev.price} EUR</li>
                    <div className="text-center mt-auto">
                    <Link
                      className="btn button-pink"
                      to={"/events/single"+ev._id}
                    >Go to event</Link>
                    </div>
                  </div>
                </div>
                </div>


            ))}
            </div>
          </div>
        )
      }
      else if (this.props.state.user.userType ==="Dancer") {
        return (
          <div>

            <h5 className="text-center mt-2">
            <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/myevents"
            >Your Saved Events </Link>
            </h5>

            <div className="row justify-content-start">

            {this.props.state.events.map((ev) => (

                <div className="col-md-4 col-lg-3 mt-4">
                <div className="card event-card shadow-sm">
                  <div className="crop-box crop-to-fit">
                  <img src={ev.picture} class="card-img-top" alt="..." />
                  </div>
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{ev.title}</h5>
                    <li className="cart-text list-unstyled"><MdLocationOn /> {ev.location} {ev.city}</li>
                    <li className="cart-text list-unstyled"><MdEvent /> { moment(ev.startDate).format('dddd D.M.YYYY')} at { moment(ev.startDate).format('H')}h</li>
                    <li className="cart-text list-unstyled"><MdCreditCard /> {ev.price} EUR</li>
                    <div className="text-center mt-auto">
                    <Link
                      className="btn button-pink"
                      to={"/events/single"+ev._id}
                    >Go to event</Link>
                    </div>
                  </div>
                </div>
                </div>


            ))}
            </div>

            <h5 className="text-center mt-2">
            <Link
              className="font-weight-bolder text-body text-decoration-none"
              to="/myrequests"
            >Your Partner Requests</Link>
            </h5>

            <div className="row justify-content-start">

            {this.props.state.requests.map((request) => (

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


          </div>


        )
      }
  }
}


export default MyEventsProfile;
