import React from "react";
import FilterRequest from "./FilterRequestForm";
import PartnerRequestForm from "./PartnerRequestForm";

import { Row, Col, Container, CardDeck } from "react-bootstrap";
import { Link } from "react-router-dom";

class FindDancePartnerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
    };
  }

  componentDidMount() {
    /* The function call is in the buildup and loads all the requests */
    this.getRequests(window.location.pathname);
    //console.log(this.state.requests);
  }


  getRequests = (url) => {
    /* fetches all requests from the backend*/

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then((requests) => {
        this.setState({ requests });
        //console.log(this.state.requests);
      })
      .catch((err) => alert(err));
  };

  deleteRequest = (requestId) => {
    /*delete requests: takes the Id of the request that should be deleted and deletes it*/

    var secret_token = window.sessionStorage.secret_token;

    try {
      fetch("/dancepartner/request/delete", {
        //fetch("/dancepartner/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + secret_token,
        },
        body: JSON.stringify({ id: requestId }),
      })
        .then((res) => res.json(res))
        .catch((err) => alert(err));
    } catch (err) {
      console.log(err);
    }

    this.getRequests(window.location.pathname);
  };

  onChange = (e) => {
    e.preventDefault();
  };

  filterRequests = (requests) => {
    this.setState({
      requests,
    });
  };

  // display requests, filtered
  //TODO: make dependent on filter option
  //TODO: sort requests
  render() {
    const sortSelect = ["date"];

    //when logged in display requests
    if (window.sessionStorage.secret_token != null) {
      return (
        <Container fluid>
          <Row>
            {/*Filter Sidebar*/}
            <Col xs={2} id="side-wrapper">
              <FilterRequest
                filterRequests={this.filterRequests}
                requests={this.state.requests}
                getRequests={this.getRequests}
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

              <Row>
                <CardDeck>
                  {this.state.requests.map((request) => (
                    <PartnerRequestForm
                      request={request}
                      user={request.dancerId}
                      profile={false}
                    />
                  ))}
                </CardDeck>
              </Row>
            </Col>
          </Row>
        </Container>
      );
    } else {
      //when not logged in, show only how many requests are open and add a link to the login page

      return (
        <div className="container">
          <h3>Dance Partner</h3>
          <p>
            Currently there are <b>{this.state.requests.length} requests</b>{" "}
            open.
          </p>
          <p>
            Please {<Link to={{ pathname: "login" }}>login</Link>} to see all
            the open requests.
          </p>
          {/* Alternative to link:
            <Button onClick={()=>{{this.props.history.push('/login')}}}>Login</Button>*/}
        </div>
      );
    }
  }
}

export default FindDancePartnerView;
