import React from "react";
import FilterRequest from "./FilterRequestForm";
import PartnerRequestForm from "./PartnerRequestForm";

import { Row, Col, Container, CardDeck } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import {SelectStyle} from "../../assets/styles";

class FindDancePartnerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
        sorting: "",
        viewAllRequests: "",
    };
  }




    onChangeCheckbox = (event) => {
        var checkboxName = event.target.name;
        var elements = document.getElementsByName(checkboxName);
        var checked = [];

        //console.log(elements);
        for (var x = 0; x < elements.length; x++) {


            if (elements[x].checked) {
                checked.push(elements[x].value);
            } else {
            }
          }
            if (checked.length < 1) {
                //store empty if nothing
                this.setState({[checkboxName]: ""}, () => {this.getRequests(window.location.pathname)});
                //console.log(this.state);
            } else if (checked.length == 1) {
                //store as a string if only 1 preference
                this.setState({[checkboxName]: checked[0]}, () => {this.getRequests(window.location.pathname)});
                //console.log(this.state);
            } else if (checked.length > 1) {
                //store as an array if multiple preferences

            };
            console.log(this.state.viewAllRequests);
            //this.getRequests(window.location.pathname);
        




    };


    sortingChanged = (selectedOption, action) => {
        /*
            If Events should be sorted based on parameter 'sorting' this function is called
        */

        //set the new state
        this.setState({
            sorting: selectedOption ? selectedOption.value : ""
        });

        //sort after prefered sortingmethods

        //sort date old to new
        if (this.state.sorting == "eventDate") {
            this.state.requests.sort((a, b) =>
                a.event.startDate > b.event.startDate ? 1 : a.event.startDate < b.event.startDate ? -1 : 0
            );
        }
        //sort date new to old
        else if (this.state.sorting == "eventDateDesc") {
            this.state.requests.sort((a, b) =>
                a.event.startDate < b.even5r4t.startDate ? 1 : a.event.startDate > b.event.startDate ? -1 : 0
            );
        }
        //sort date old to new
        if (this.state.sorting == "reqDate") {
            this.state.requests.sort((a, b) =>
                a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0
            );
        }
        //sort date new to old
        else if (this.state.sorting == "reqDateDesc") {
            this.state.requests.sort((a, b) =>
                a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
            );
        }
    };

  componentDidMount() {
    /* The function call is in the buildup and loads all the requests */
    this.getRequests(window.location.pathname);
    //console.log(this.state.requests);
  }


  getRequests = (url) => {

      if(window.sessionStorage.secret_token != null) {
          //TODO: Checkbox - check if right value is send and if the right data comes back (state of requests is updated right)
          /* fetches all requests from the backend*/
          console.log(url);
          console.log(this.state.viewAllRequests);

          if (url == window.location.pathname && this.state.viewAllRequests != "") {
              url += "/?allRequests=" + this.state.viewAllRequests;
          }
          ;
          if (url == "/dancepartner/?" && this.state.viewAllRequests != "") {
              url += "allRequests=" + this.state.viewAllRequests;
          }
          ;
          if (url != "/dancepartner/?" && url == window.location.pathname && this.state.viewAllRequests != "") {
              url += "&allRequests=" + this.state.viewAllRequests;
          }
          ;
      }
      else {
            url = "/loggedout/requests";
      };
      console.log(url);


   console.log(url)
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then((requests) => {
        console.log(requests);
        this.setState({ requests });
        console.log(this.state.requests);
      })
      .catch((err) => alert(err));
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
            <Row >
                <div className="form-group" style={{ marginRight: "auto" }}>
                    <input className="mr-1" type="checkbox" id="viewAllRequests" name="viewAllRequests" value="viewAllRequests" onChange={this.onChangeCheckbox} />
                    <label class="checkbox-inline mr-2">View all Requests (also not matching my profile)</label>
                </div>


                <div style={{ marginLeft: "auto" , width: "15rem"}}>
                    Sorting by:
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={this.state.sorting.value}
                            value={this.state.sorting.value}
                            placeholder={""}
                            isClearable={true}
                            isSearchable={true}
                            styles={SelectStyle}
                            onChange={this.sortingChanged}
                            name="gender"
                            options={[
                                { value: 'eventDate', label: 'Event Date' },
                                { value: 'reqDate', label: 'Request Date' },
                                { value: 'eventDateDesc', label: 'Event Date Desc'},
                                { value: 'reqDateDesc', label: 'Request Date Desc'},
                            ]}
                        />
                </div>

            </Row>

              <Row> { this.state.requests.length ? (
                <CardDeck>
                  {this.state.requests.map((request) => (
                    <PartnerRequestForm
                      request={request}
                      user={request.dancerId}
                      profile={false}
                    />
                  ))}</CardDeck>
    )
        :(
            <p> At the moment there are no open requests that are matching your profile or filter. </p>
        )
        }

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
        </div>
      );
    }
  }
}

export default FindDancePartnerView;
