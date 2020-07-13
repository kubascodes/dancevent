import React from "react";
import { Redirect } from "react-router-dom";
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


  render() {
      if (this.props.state.user.userType ==="Organizer") {
        return (
          <div>
            <h5 className="text-center mt-2">Your Hosted Events</h5>

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
                    <a href="#" class="btn button-pink">Go to event</a>
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

            <h5 className="text-center mt-2">Your Saved Events</h5>

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
                    <a href="#" class="btn button-pink">Go to event</a>
                    </div>
                  </div>
                </div>
                </div>


            ))}
            </div>

            <h5 className="text-center mt-2">Your Partner Requests</h5>



          </div>


        )
      }
  }
}


export default MyEventsProfile;
