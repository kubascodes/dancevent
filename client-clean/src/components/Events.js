import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from 'react-select'; 
import EventCard from "./parts/EventCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import cities from './forms/cities'




/*
    TODOs:
    - check for date Range (mostly backend changes)
    - Design
*/

//formats object date into Sting: yyyy-mm-dd
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      togglePopup: false,
      chosenEvent: {},
      events: [],
      eventtype: "all",
      danceStyle: "various",
      danceLevel: "all",
      city: "Munich",
      //startDate: formatDate(Date.now()),
      startDate: new Date(),
      endDate: null,

      sorting: "date",

      danceCategory: 'latin',
      danceStyle: [],
    };
  }

  componentDidMount() {
    /*
    this function is called by react in the build up.
    Thus the events (without optional parameters) are requested
    */
    fetch("/events")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ events: data });
      })
      .catch(console.log);
      console.log(this.state);
  }

  onChange = (event) => {
    /*
        Because we named the inputs to match their
        corresponding values in state, it's
        super easy to update the state
    */
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };
  //Changes the state for calendar inputs
  //type should specify if it is a start- or endDate
  onChangeCalendar = (date, type) => {
    console.log(this)
    this.setState({ [type]: date });
  };


  //Changes the state for REACT-SELECT inputs
  onChangeCity = (event) => {
    console.log(event)
    this.setState({city : event.value})
  }

  handleSelect = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */
    console.log("new event")
    console.log(selectedOption)
    console.log(action)
    this.setState({
        [action.name]: selectedOption ? selectedOption.value : ""
    });
    /*if (action.name == 'danceCategory') {
        this.setState({danceStyle: ''});
    };*/
    console.log(this.state)
}

handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    console.log("new event")
    console.log(danceStyle)
    this.setState({danceStyle});
    console.log(this.state)
}

  sortingChanged = (event) => {
    /*
        If Events should be sorted based on parameter 'sorting' this function is called
    */

    //set the new state
    this.setState({ sorting: event.target.value });

    //sort after prefered sortingmethods

    //sort date old to new
    if (this.state.sorting == "date") {
      this.state.events.sort((a, b) =>
        a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
      );
    }
    //sort date new to old
    else if (this.state.sorting == "dateDesc") {
      this.state.events.sort((a, b) =>
        a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0
      );
    }
  };

  submitFilter = (event) => {
    /*
        This Method is the called if the user want to update
        the events based on the set filters
        It checks if a option is not in the general case and
        then adds it to the URL
        */

    console.log(this.state)

    //otherwise it would reload the Page
    event.preventDefault();

    //To know if you need a '&' to concat the parameters
    let previous = false;
    let url = "/events/?";
    if (this.state.eventtype != "all") {
      url += "type=" + this.state.eventtype;
      previous = true;
    }
    /*if (this.state.danceStyle != "various") {
      if (previous) {
        url += "&";
      }
      url += "listOfDanceStyles=" + this.state.danceStyle;
      previous = true;
    }*/
    if(!this.state.danceStyle.includes('all')){
      if(this.state.danceStyle.length !== 0){
        console.log(this.state.danceStyle)
        var index;
        for(index in this.state.danceStyle){
          console.log(index)
          if(index!==0){
            url += "&";
          }else if(previous){
            url += "&";
          }
          console.log(this.state.danceStyle[index])
          console.log(this.state.danceStyle[index].value)
          url += "listOfDanceStyles=" + this.state.danceStyle[index].value
          console.log(url)
        }
        previous = true;
      }
    }
    if (this.state.danceLevel != "all") {
      if (previous) {
        url += "&";
      }
      url += "listOfProficiencyLevels=" + this.state.danceLevel;
      previous = true;
    }
    if (this.state.city) {
      if (previous) {
        url += "&";
      }
      url += "city=" + this.state.city;
      previous = true;
    }
    if (this.state.startDate) {
      if (previous) {
        url += "&";
      }
      url += "startDate=" + this.state.startDate;
      previous = true;
    }
    if (this.state.endDate) {
      if (previous) {
        url += "&";
      }
      url += "endDate=" + this.state.endDate;
      previous = true;
    }

    //TODO implement in backend:
    //url+='&startDate=' + this.state.startDate

    //fetch events from backend
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ events: data });
      })
      .catch(console.log);
  };

  //maybe for later
  toggleEvent = (event) => {
    this.setState({
      showPopup: !this.state.showPopup,
      chosenEvent: event,
    });
  };

  onDeleteEvent = (event) => {
    var component_scope = this;
    // Interrupting the flow from the EventCard to App.js to ensure immediate rerendering of the Homepage when the deletion in App.js is done
    component_scope.setState({
      events: component_scope.state.events.filter(
        (shownEvent) => shownEvent._id !== event._id
      ),
    });

    // After the Homepage is re-rendered the event is deleted from the backend
    component_scope.props.onDeleteEvent(event);
  };

  render() {
    //possible selector variables
    const latinStyles = [
      "latin",
      "cha-cha-cha",
      "samba",
      "jive",
      "paso doble",
      "boldero",
      "rumba",
      "mambo",
      "east coast swing",
    ];
    const standardStyles = [
      "standard",
      "waltz",
      "viennese waltz",
      "tango",
      "foxtrot",
      "quickstep",
      "hustle",
      "west coast swing",
      "salsa",
      "bachata",
    ];
    const eventLevels = [
      "beginner", "intermediate", "advanced"
    ];


    const danceStyleCategory = [
      {value: 'all', label: 'All Styles'},
      {value: 'latin', label: 'Latin/Rythm'},
      {value: 'standard', label: 'Standard/Smooth'},
      {value: 'various', label: 'Various'},
  ];
  
  const all = [
    {value: 'all', label: 'All styles'}
  ]

  const latin = [
      {value: 'latin', label: 'All latin styles'},
      {value: 'jive', label: 'Jive'},
      {value: 'rumba', label: 'Rumba'},
      {value: 'cha-cha-cha', label: 'Cha-Cha-Cha'},
      {value: 'samba', label: 'Samba'},
      {value: 'paso doble', label: 'Paso Doble'},
      {value: 'bolero', label: 'Bolero'},
      {value: 'mambo', label: 'Mambo'},
      {value: 'east coast swing', label: 'East Cost Swing'},
  ];
  const standard = [
      {value: 'standard', label: 'All standard styles'},
      {value: 'waltz', label: 'Waltz'},
      {value: 'viennese waltz', label: 'Viennese Waltz'},
      {value: 'tango', label: 'Tango'},
      {value: 'foxtrot', label: 'Foxtrot'},
      {value: 'qickstep', label: 'Qickstep'},
  ];
  const various = [
      {value: 'various', label: 'All various styles'},
      {value: 'salsa', label: 'Salsa'},
      {value: 'bachata', label: 'Bachata'},
      {value: 'west coast swing', label: 'West Cost Swing'},
      {value: 'hustle', label: 'Hustle'},
  ];


    



    return (
      <Container fluid>
        <Row>
          {/*    Filter Sidebar   */}
          <Col xs={2} id="sidebar-wrapper">
            <div>
              <h3>Filter Events </h3>
              <form onSubmit={this.submitFilter}>
                {/*    Eventtype   */}
                <div className="form-group">
                  <label className="label-bold">I'm looking for</label>
                  <select
                    className="form-control"
                    name="eventtype"
                    onChange={this.onChange}
                  >
                    <option value="all">All Types</option>
                    <option value="course">Course</option>
                    <option value="ball">Ball</option>
                    <option value="competition">Competition</option>
                    <option value="party">Party</option>
                  </select>
                </div>
                {/*    Dance Style   */}
                <div className="form-group">
                  <label className="label-bold">To dance</label>
                  <select
                    className="form-control"
                    name="danceStyle"
                    onChange={this.onChange}
                  >
                    <option value="various">Various</option>
                    <optgroup label="Latin">
                      {latinStyles.map((danceStyle) => (
                        <option value={danceStyle}>
                          {danceStyle.charAt(0).toUpperCase() +
                            danceStyle.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Standard">
                      {standardStyles.map((danceStyle) => (
                        <option value={danceStyle}>
                          {danceStyle.charAt(0).toUpperCase() +
                            danceStyle.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {/*    Dance Level   */}
                <div className="form-group">
                  <label className="label-bold">Eventlevel</label>
                  <select
                    className="form-control"
                    name="danceLevel"
                    onChange={this.onChange}
                  >
                    <option value="all">All</option>
                    {eventLevels.map((danceStyle) => (
                      <option value={danceStyle}>
                        {danceStyle.charAt(0).toUpperCase() +
                          danceStyle.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                

                <div className="form-group">
              <label className="mr-2 label-bold" htmlFor="listOfProficiencyLevels">Dance style</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Dance style category..."
                  isClearable={true}
                  isSearchable={true}
                  onChange={this.handleSelect}
                  name="danceCategory"
                  options={danceStyleCategory}
                />
                {
                  {
                    'all':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        isMulti={true}
                        placeholder="Dance style..."
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={all}
                      />,
                    'latin':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        isMulti={true}
                        placeholder="Dance style..."
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={latin}
                      />,
                    'standard':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        isMulti={true}
                        placeholder="Dance style..."
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={standard}
                      />,
                    'various':
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleMultiSelect}
                        isMulti={true}
                        placeholder="Dance style..."
                        isClearable={true}
                        isSearchable={true}
                        name="danceStyle"
                        options={various}
                      />

                  }[this.state.danceCategory]
                }
              </div>


                {/*    City   */}

                {/*
                <div className="form-group">
                  <label className="label-bold">City</label>
                  <input
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder={this.state.city}
                    onChange={this.onChange}
                    value={this.city}
                  />
                </div>
                */}

                <div className="form-group">
                  <label className="label-bold" htmlFor="city">City</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder={"Choose a city..."}
                    onChange={this.onChangeCity}
                    name="city"
                    options={cities}
                    
                            />
                </div>

                {/*    Startdate   */}
                {/*<div class="form-group">
                  <label for="start">Start date:</label>
                  <input
                    type="date"
                    id="start"
                    name="startDate"
                    value={this.state.startDate}
                    min={formatDate(Date.now())}
                    max="2022-12-31"
                    onChange={this.onChange}
                  />
                        </div>*/}
                <div className="form-group">
                  <label className="label-bold"> Earliest start date </label>
                  <DatePicker
                    className="form-control"
                    name="startDate"
                    selected={this.state.startDate}
                    onChange={date => this.onChangeCalendar(date, "startDate")}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                  />
                </div>
                <div className="form-group">
                  <label className="label-bold"> Latest start date </label>
                  <DatePicker
                    className="form-control"
                    name="endDate"
                    onChange={date => this.onChangeCalendar(date, "endDate")}
                    dateFormat="MMMM d, yyyy"
                    minDate={this.state.startDate}
                    placeholderText="Insert a date"
                  />
                </div>

                {/*    Submit button (if pressed events will be fetched from backend based on set parameters)   */}
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn btn-outline-dark"
                    value="Submit"
                  />
                </div>
              </form>
            </div>
          </Col>
          {/*    Events Part   */}
          <Col xs={10} id="page-content-wrapper">
            {/*    Sorting Navbar   */}
            <Row>
              <div style={{ marginLeft: "auto" }}>
                Sorting by:
                <select name="sorting" onChange={this.sortingChanged}>
                  <option value="date">Date</option>
                  <option value="dateDesc">Date desc</option>
                </select>
              </div>
            </Row>

            {/*    Event Cards   */}
            <Row>
              {" "}
              { this.state.events.length > 0 ?
                
                this.state.events.map((event) => (
                  <EventCard
                    event={event}
                    state={this.props.state}
                    onDeleteEvent={() => this.onDeleteEvent(event)}
                  />
                ))
                :
                <div>

                  <h3>Events</h3>
                  <p>Appearently, no events are found with your selected Filters.  </p>
                </div>


              }
              {" "}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Events;
