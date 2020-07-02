import React from "react";
import FilterRequest from "./FilterRequestForm";
import RequestForm from "./PartnerRequestForm";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class FindDancePartnerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Dancer connection, Event Connection
      dancerId: {}, //Dancer name and details needed
      eventList: [],
      requestDescription: null,
      ageOffset: null,
      prefGender: null,
      proficiencyLevel: [],
      city: null,
      date: null, //+timestamp of request?
      togglePopup: false,
      sorting: "date",
      requests: [],
    };
  }

  componentDidMount() {
    /* The function call is in the buildup and loads all the requests */
    console.log(this.props);
    this.getRequests();
  }

  //TODO: depend on filter options
  getRequests = () => {
    /* fetches all requests from the backend*/
    var secret_token = window.sessionStorage.secret_token;

    fetch("/dancepartner/request", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + secret_token,
      },
    })
      .then((res) => res.json(res))
      .then((requests) => {
        this.setState({requests});
      })
      .catch((err) => alert(err));
  };


  deleteRequest = (requestId) => {
    /*delete requests: takes the Id of the request that should be deleted and deletes it*/

    var secret_token = window.sessionStorage.secret_token;

    try{
      fetch("/dancepartner/request/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + secret_token,
        },
        body: JSON.stringify({id: requestId})
      })
          .then((res) => res.json(res))
          .then(function (res) {
            console.log(res);
          })
          .catch((err) => alert(err));
    }catch(err){
      console.log(err);
    }
    this.getRequests();
  }

  onChange = (e) => {
    e.preventDefault();
  };

  filterRequests = (requests) => {
    this.setState({
      requests,
    });
    console.log("filteres requests" + requests);
  };


  // to get dancers preferences for later           ----Old not used
  // for now: get all dancer from backend
  // return dancer data of the dancer to the log
  /*getDancer = () => {
    var secret_token = window.sessionStorage.secret_token;
    var component_scope = this; // this.setState didn't worked somehow thstd

    fetch("/dancepartner", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + secret_token,
      },
    })
      .then((res) => res.json(res))
      .then(function (res) {
        component_scope.setState({
          dataDancer: [...res],
        });
      })
      .catch((err) => alert(err));
  };*/


  // display requests, filtered
  //TODO: make dependent on filter option
  //TODO: sort requests
  render() {

    const sortSelect = ["date"];

    //when logged in display requests
    if (window.sessionStorage.secret_token != null){
      return (

          <Container fluid>
            <Row>
              {/*Filter Sidebar*/}
              <Col xs={2} id="side-wrapper">
                <FilterRequest
                    filterRequests={this.filterRequests}
                    requests={this.state.requests}
                />
              </Col>
              {/*RequestPart*/}
              <Col>
                {/*SortingNavbar*/}
                <Row>
                  <div style={{ marginLeft: "auto" }}>
                    Sorted by:
                    <select
                        className="form-control"
                        name="sort"
                        onChange={this.onChange}
                    >
                      <optgroup label="Descanding">
                        {sortSelect.map((sortSelect) => (
                            <option value={"descanding" + sortSelect}>
                              {"Desc " +
                              sortSelect.charAt(0).toUpperCase() +
                              sortSelect.slice(1)}
                            </option>
                        ))}
                      </optgroup>
                      <optgroup label="Ascanding">
                        {sortSelect.map((sortSelect) => (
                            <option value={"ascanding" + sortSelect}>
                              {"Asc " +
                              sortSelect.charAt(0).toUpperCase() +
                              sortSelect.slice(1)}
                            </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </Row>
                {/*InsertRequests*/}
                <Row>
                  <RequestForm requests={this.state.requests} deleteRequest={this.deleteRequest}/>
                </Row>
              </Col>
            </Row>
          </Container>
      );

    }
    else{ //when not logged in, show only how many requests are open and add a link to the login page

      return(
          <div className="container">
            <h3>Dance Partner</h3>
            <p>Currently there are <b>{this.state.requests.length} requests</b> open.</p>
            <p>Please {<Link to={{pathname:'login'}}>login</Link>} to see all the open requests.</p>
            {/* Alternative to link:
            <Button onClick={()=>{{this.props.history.push('/login')}}}>Login</Button>*/}
          </div>
      );
    }


  }
}

export default FindDancePartnerView;
