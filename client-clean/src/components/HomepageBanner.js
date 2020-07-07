import React from "react";
import { Link } from "react-router-dom";

const HomepageBanner = () => {
  return (
    <div className="container img-homepage">
      <h1 className="text-center">Find dance partners, events, and schools!</h1>
      <hr />
      <div className="row">
        <div className="col-4">
          <img
            src="img/dance-partners_800x800.jpg"
            alt="dance partners"
            className="img-fluid"
          />
        </div>
        <div className="col-4">
          <img
            src="img/dance-party_800x800.jpg"
            alt="dance party"
            className="img-fluid"
          />
        </div>
        <div className="col-4">
          <img
            src="img/dance-course_800x800.jpg"
            alt="dance course"
            className="img-fluid"
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-4 text-center">
          <span className="">
            Looking for a dance partner for the next ball?
          </span>
        </div>
        <div className="col-4 text-center">
          <span className="">So what's happening on Friday night?</span>
        </div>
        <div className="col-4 text-center">
          <span className="">
            If you're new to dancing, it's easy to learn!
          </span>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-4 text-center">
          <Link to="/dancepartner">
            <button className="btn btn-secondary btn-lg">Find a partner</button>
          </Link>
        </div>
        <div className="col-4 text-center">
          <Link to="/events">
            <button className="btn btn-secondary btn-lg">
              Find upcoming events
            </button>
          </Link>
        </div>
        <div className="col-4 text-center">
          <button className="btn btn-secondary btn-lg">
            Find a dance school
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomepageBanner;
