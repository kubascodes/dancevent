import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import EventCard from "./parts/EventCard";
import DatePicker from "react-datepicker";
import {CriticalAlert} from "./helpers/Alert";
import {SelectStyle} from '../assets/styles'

import "react-datepicker/dist/react-datepicker.css";

import cities from "./forms/cities";

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
      city: "",
      //startDate: formatDate(Date.now()),
      startDate: new Date(new Date().setHours(0,0,0,0)),
      endDate: null,

      sorting: "date",

      danceCategory: "latin",
      danceStyle: [],

      showAltert : false,
      errorMessage: "",
    };
  }



  componentDidMount() {
    /*
    this function is called by react in the build up.
    Thus the events (without optional parameters) are requested
    */
   var component_scope = this;
    fetch("/events")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        component_scope.setState({ events: data });
      })
      .catch(err => {
        component_scope.setState({showAltert: true,
                      errorMessage: "Internal Problem. Data could not be fetched from the backend" })
        console.log(err)});
      console.log(this.state);

  }

  // <Select> needs value and label as input
  selectObject = (prop) => (
    { value: prop, label: prop.charAt(0).toUpperCase() + prop.slice(1) }
  )
  selectObjectList = (prop) => (
    prop.map(i => this.selectObject(i))
  )

  hideAlert = () => {this.setState({showAltert : !this.state.showAltert})}

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
    console.log(date);
    this.setState({ [type]: date });
    console.log(this.state)
  };

  //Changes the state for REACT-SELECT inputs
  onChangeCity = (event) => {
    console.log(event);
    this.setState({ 
      city: event ? event.value : "",
    })
      //city: event.value });
    console.log(this.state)
  };

  handleSelect = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */
    this.setState({
      [action.name]: selectedOption ? selectedOption.value : "",
    });
    /*if (action.name == 'danceCategory') {
        this.setState({danceStyle: ''});
    };*/
    console.log(this.state)
    
  }

  handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    console.log("new event");
    console.log(danceStyle);
    this.setState({ danceStyle });
    console.log(this.state);
  };

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

  handleTextDate = (selectedOption, action) => {
    /*this function gets a text like "tomorrow" and evaluates than the start and end date*/
    console.log(selectedOption)
    var today = new Date(new Date().setHours(0,0,0,0));
    if(selectedOption){

        var startDate ;
        var endDate;
        switch(selectedOption.value){
            case "today":
                startDate = today;
                endDate = today;
                break;
            case "tomorrow":
                startDate = new Date(today.setTime(today.getTime() + 1 * 86400000 ));
                endDate = startDate;
                break;
            case "week":
                var curr = today; // get current date
                var monday = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
                var sunday = monday + 6; // last day is the first day + 6
                startDate = new Date(today.setDate(monday));
                endDate = new Date(today.setDate(sunday));
                break;
            case "weekend":
                var curr = new Date; // get current date
                var friday = curr.getDate() - curr.getDay() + 5; // First day is the day of the month - the day of the week
                var sunday = friday + 2; // last day is the first day + 6
                startDate = new Date(today.setDate(friday));
                endDate = new Date(today.setDate(sunday));
                break;

        }
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
    }
    else{
        this.setState({
            startDate: today,
            endDate: null,
        });
    }
}



  submitFilter = (event) => {
    /*
        This Method is the called if the user want to update
        the events based on the set filters
        It checks if a option is not in the general case and
        then adds it to the URL
        */

    console.log(this.state);

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
    if (!this.state.danceStyle.includes("all")) {
      if (this.state.danceStyle.length !== 0) {
        console.log(this.state.danceStyle);
        var index;
        for (index in this.state.danceStyle) {
          console.log(index);
          if (index !== 0) {
            url += "&";
          } else if (previous) {
            url += "&";
          }
          console.log(this.state.danceStyle[index]);
          console.log(this.state.danceStyle[index].value);
          url += "listOfDanceStyles=" + this.state.danceStyle[index].value;
          console.log(url);
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
      //+1 Day that the choosen day is inclusive
      url += "endDate=" + new Date(this.state.endDate.getTime() + 86400000)
      previous = true;
    }

    var component_scope = this;
    //fetch events from backend
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        component_scope.setState({ events: data });
      })
      .catch(err => {
        //Error is not important enough for display
        console.log(err)}
        );
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
    const eventLevels = ["all", "beginner", "intermediate", "advanced"];
    const types = ["all", "course", "ball", "competition", "party"];

    // Date 1 Option - selection
    const dateSelection = [
      { value: 'today', label: 'Today' },
      { value: 'tomorrow', label: 'Tomorrow' },
      { value: 'weekend', label: 'This Weekend' },
      { value: 'week', label: 'This Week' },
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
      {value: 'quickstep', label: 'Quickstep'},
  ];
  const various = [
      {value: 'various', label: 'All various styles'},
      {value: 'salsa', label: 'Salsa'},
      {value: 'bachata', label: 'Bachata'},
      {value: 'west coast swing', label: 'West Cost Swing'},
      {value: 'hustle', label: 'Hustle'},
  ];

    return (
      <div>
      <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage}/>
      <Container fluid>
        <Row>
          {/*    Filter Sidebar   */}
          <Col xs={5} md={4} lg={3} xl={2} id="sidebar-wrapper">
            <div>
              <form onSubmit={this.submitFilter}>
                <h4>Filter Events </h4>
                {/*    Eventtype   */}
                <div className="form-group">
                  <label className="label-bold">I'm looking for a...</label>
                  <Select
                        className="basic-single"
                        placeholder={"Choose a Dance Style..."}
                        onChange={this.handleSelect}
                        name="eventtype"
                        styles={SelectStyle}
                        options={this.selectObjectList(types)}
                  />
                </div>
                
                
                 {/*    Dance Style   */}
                <div className="form-group">
                  <label
                    className="mr-2 label-bold"
                    htmlFor="listOfProficiencyLevels"
                  >
                    To dance
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Dance style category..."
                    isClearable={true}
                    isSearchable={true}
                    onChange={this.handleSelect}
                    name="danceCategory"
                    options={danceStyleCategory}
                    styles={SelectStyle}
                  />
                  {
                    {
                      all: (
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
                          styles={SelectStyle}
                        />
                      ),
                      latin: (
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
                          styles={SelectStyle}
                        />
                      ),
                      standard: (
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
                          styles={SelectStyle}
                        />
                      ),
                      various: (
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
                          styles={SelectStyle}
                        />
                      ),
                    }[this.state.danceCategory]
                  }
                </div>

                 {/*    Dance Level   */}
                 <div className="form-group">
                  <label className="label-bold">Eventlevel</label>

                  <Select
                        className="basic-single"
                        placeholder={"Choose a dance level..."}
                        onChange={this.handleSelect}
                        name="danceLevel"
                        options={this.selectObjectList(eventLevels)}
                        styles={SelectStyle}
                  />
                </div>

                {/*    City   */}

                <div className="form-group">
                  <label className="label-bold" htmlFor="city">
                    City
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder={"Choose a city..."}
                    onChange={this.onChangeCity}
                    name="city"
                    options={cities}
                    styles={SelectStyle}
                    isClearable
                  />
                </div>

                {/* Date Type 1 - selection*/}
                <label className="label-bold"> In the time...</label>
                  <div className="form-group">
                    <label> On... </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={this.state.prefDateSelection}
                      placeholder={"E.g. Tomorrow"}
                      isClearable={true}
                      isSearchable={true}
                      styles={SelectStyle}
                      onChange={this.handleTextDate}
                      name="dateSelection"
                      options={dateSelection}
                      styles={SelectStyle}
                    />
                  </div>
                

                {/*    Startdate   */}
                <div className="form-group">
                  <label> From... </label>
                  <DatePicker
                    className="form-control"
                    name="startDate"
                    selected={this.state.startDate}
                    onChange={(date) =>
                      this.onChangeCalendar(date, "startDate")
                    }
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                  />
                </div>
                {/*    Enddate   */}
                <div className="form-group">
                  <label> Till... </label>
                  <DatePicker
                    className="form-control"
                    name="endDate"
                    selected={this.state.endDate}
                    onChange={(date) => this.onChangeCalendar(date, "endDate")}
                    dateFormat="MMMM d, yyyy"
                    minDate={this.state.startDate}
                    placeholderText="Open End"
                  />
                </div>

                {/*    Submit button (if pressed events will be fetched from backend based on set parameters)   */}
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn button-pink"
                    value="Submit"
                  />
                </div>
              </form>
            </div>
          </Col>
          {/*    Events Part   */}
          <Col xs={7} md={8} lg={9} xl={10} id="page-content-wrapper">
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
              {this.state.events.length > 0 ? (
                this.state.events.map((event) => (
                  <EventCard
                    event={event}
                    state={this.props.state}
                    onDeleteEvent={() => this.onDeleteEvent(event)}
                    onSaveEvent={() => this.props.onSaveEvent(event)}
                    onUnsaveEvent={() => this.props.onUnsaveEvent(event)}
                  />
                ))
              ) : (
                <div>
                  <h3>Events</h3>
                  <p>
                    Appearently, no events are found with your selected Filters.{" "}
                  </p>
                </div>
              )}{" "}
            </Row>
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}
export default Events;
