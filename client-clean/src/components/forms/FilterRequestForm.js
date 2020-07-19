import React from "react";
import Select from "react-select";
import cities from "./cities";
import DatePicker from "react-datepicker";
import { Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { SelectStyle } from "../../assets/styles";

class FilterRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      prefAgeMin: 0,
      prefAgeMax: 100,
      gender: "",
      proficiencyLevel: "",
      prefEventDate: "",
      prefDateSelection: "",
      eventType: "",
      danceCategory: "latin",
      danceStyle: "",
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: null,
    };
  }

  //submitFilter = (e) => {
  submitFilterOld = (e) => {
    /*This function is called if the user enters a city and presses enter*/
    e.preventDefault();
    const filterRequests = this.props.requests.filter((request) => {
      return request;
    });
    this.props.filterRequests(this.state);
  };

  onChange = (e) => {
    /*This function is called if the user changes a variable of the filter options*/
    e.preventDefault();

    var allow = true;
    // check that the min in not bigger than the max and the other way around
    if (e.target.name == "prefAgeMin") {
      if (Number(e.target.value) >= Number(this.state.prefAgeMax)) {
        allow = false;
      }
    }
    if (e.target.name == "prefAgeMax") {
      if (Number(e.target.value) <= Number(this.state.prefAgeMin)) {
        allow = false;
      }
    }
    if (allow) {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  //Changes the state for REACT-SELECT inputs
  onChangeCity = (event) => {
    console.log(event);
    this.setState({
      city: event ? event.value : "",
    });
  };

  handleTextDate = (selectedOption, action) => {
    /*this function gets a text like "tomorrow" and evaluates than the start and end date*/
    var today = new Date(new Date().setHours(0, 0, 0, 0));
    if (selectedOption) {
      var startDate;
      var endDate;
      switch (selectedOption.value) {
        case "today":
          startDate = today;
          endDate = today;
          break;
        case "tomorrow":
          startDate = new Date(today.setTime(today.getTime() + 1 * 86400000));
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
          var curr = new Date(); // get current date
          var friday = curr.getDate() - curr.getDay() + 5; // First day is the day of the month - the day of the week
          var sunday = friday + 2; // last day is the first day + 6
          startDate = new Date(today.setDate(friday));
          endDate = new Date(today.setDate(sunday));
          break;
      }
      this.setState({
        startDate: startDate,
        endDate: endDate,
      });
    } else {
      this.setState({
        startDate: today,
        endDate: null,
      });
    }
  };

  // handle Select
  handleChange = (selectedOption, action) => {
    this.setState({
      [action.name]: selectedOption ? selectedOption.value : "",
    });

    /*if(action.name == 'danceCategory'){
        this.setState({
          danceStyle: ''
        })
      }*/
  };

  handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    console.log("new event");
    console.log(danceStyle);
    this.setState({ danceStyle });
    console.log(this.state);
  };

  submitFilter = (e) => {
    /*
        This Method is the called if the user want to update
        the events based on the set filters
        It checks if a option is not in the general case and
        then adds it to the URL
        */

    //otherwivse it would reload the Page
    e.preventDefault();

    //To know if you need a '&' to concat the parameters
    let previous = false;
    let url = "/dancepartner/?";

    // set Filter for dancer belonging to request
    if (this.state.gender != "") {
      url += "listofGendersDancer=" + this.state.gender;
      previous = true;
    }
    if (this.state.prefAgeMin != "") {
      if (previous) {
        url += "&";
      }
      url += "prefAgeMinDancer=" + this.state.prefAgeMin;
      previous = true;
    }
    if (this.state.prefAgeMax != "") {
      if (previous) {
        url += "&";
      }
      url += "prefAgeMaxDancer=" + this.state.prefAgeMax;
      previous = true;
    }
    if (this.state.proficiencyLevel != "") {
      if (previous) {
        url += "&";
      }
      url += "listOfProficiencyLevelsDancer=" + this.state.proficiencyLevel;
      previous = true;
    }
    //beong to the request
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
    // belong to event
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

    if (this.state.eventType != "") {
      if (previous) {
        url += "&";
      }
      url += "type=" + this.state.eventType;
      previous = true;
    }

    //fetch requests from backend
    this.props.getRequests(url);
    console.log(url);
  };
  //Changes the state for calendar inputs
  //type should specify if it is a start- or endDate
  onChangeCalendar = (date, type) => {
    console.log(this);
    this.setState({ [type]: date });
  };

  render() {
    // New Selection Types:
    //gender
    const gender = [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ];

    // Skill level
    const proficiencyLevels = [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ];

    // City - input + autofill

    // Date 1 Option - selection
    const dateSelection = [
      { value: "today", label: "Today" },
      { value: "tomorrow", label: "Tomorrow" },
      { value: "weekend", label: "This Weekend" },
      { value: "week", label: "This Week" },
    ];

    // Dance Styles
    const danceStyleCategory = [
      { value: "all", label: "All Styles" },
      { value: "latin", label: "Latin/Rythm" },
      { value: "standard", label: "Standard/Smooth" },
      { value: "various", label: "Various" },
    ];

    const all = [{ value: "all", label: "All styles" }];

    const latin = [
      { value: "latin", label: "All latin styles" },
      { value: "jive", label: "Jive" },
      { value: "rumba", label: "Rumba" },
      { value: "cha-cha-cha", label: "Cha-Cha-Cha" },
      { value: "samba", label: "Samba" },
      { value: "paso doble", label: "Paso Doble" },
      { value: "bolero", label: "Bolero" },
      { value: "mambo", label: "Mambo" },
      { value: "east coast swing", label: "East Cost Swing" },
    ];
    const standard = [
      { value: "standard", label: "All standard styles" },
      { value: "waltz", label: "Waltz" },
      { value: "viennese waltz", label: "Viennese Waltz" },
      { value: "tango", label: "Tango" },
      { value: "foxtrot", label: "Foxtrot" },
      { value: "quickstep", label: "Quickstep" },
    ];
    const various = [
      { value: "various", label: "All various styles" },
      { value: "salsa", label: "Salsa" },
      { value: "bachata", label: "Bachata" },
      { value: "west coast swing", label: "West Cost Swing" },
      { value: "hustle", label: "Hustle" },
    ];

    // Event Type - Multiple
    const eventType = [
      { value: "ball", label: "Ball" },
      { value: "party", label: "Party" },
      { value: "course", label: "Course" },
      { value: "competition", label: "Competition" },
    ];

    const danceStyle = this.state.danceStyle;

    return (
      <form onSubmit={this.submitFilter}>
        <h4>Filter Requests</h4>

        {/*Gender Type }
        <div className="form-group">
        <label> I am looking for a... </label>
        <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={this.state.gender}
            placeholder={"All genders..."}
            isClearable={true}
            isSearchable={true}
            styles={SelectStyle}
            onChange={this.handleChange}
            name="gender"
            options={gender}
        />
        </div>

          {/* Preferred - Age Range*/}
        <div>
          <label>Age Range: </label>
        </div>
        <div>
          <Row>
            <Col xs={5}>
              <input
                type="number"
                placeholder={this.state.prefAgeMin}
                className="form-control col"
                name="prefAgeMin"
                step="5"
                min="0"
                onChange={this.onChange}
                value={this.state.prefAgeMin}
              />
            </Col>
            <Col>
              <label> - </label>
            </Col>
            <Col xs={5}>
              <input
                type="number"
                placeholder={this.state.prefAgeMax}
                className="form-control col"
                name="prefAgeMax"
                min="0"
                step="5"
                onChange={this.onChange}
                value={this.state.prefAgeMax}
              />
            </Col>
          </Row>
        </div>

        <div class="age-slider">
          <input
            type="range"
            className="custom-range"
            id="prefAgeMin"
            name="prefAgeMin"
            min="0"
            step="5"
            value={this.state.prefAgeMin}
            onChange={this.onChange}
          />

          <input
            type="range"
            className="custom-range"
            id="prefAgeMax"
            name="prefAgeMax"
            min="0"
            step="5"
            value={this.state.prefAgeMax}
            onChange={this.onChange}
          />
        </div>

        {/*Skill-Level Type */}
        <div className="form-group">
          <label> Who is a... </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={this.state.proficiencyLevel}
            placeholder={"All proficiency levels..."}
            isClearable={true}
            isSearchable={true}
            styles={SelectStyle}
            onChange={this.handleChange}
            name="proficiencyLevel"
            options={proficiencyLevels}
          />
        </div>

        {/*City Type*/}
        <div className="form-group">
          <label className="label-bold" htmlFor="city">
            City
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder={"Choose a city..."}
            onChange={this.onChangeCity}
            styles={SelectStyle}
            name="city"
            options={cities}
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
          />
        </div>
        <div className="form-group">
          <label> From...</label>
          <DatePicker
            className="form-control"
            name="startDate"
            selected={this.state.startDate}
            onChange={(date) => this.onChangeCalendar(date, "startDate")}
            selectsStart
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>
        <div className="form-group">
          <label> Till... </label>
          <DatePicker
            className="form-control"
            name="endDate"
            selected={this.state.endDate}
            onChange={(date) => this.onChangeCalendar(date, "endDate")}
            selectsEnd
            dateFormat="MMMM d, yyyy"
            minDate={this.state.startDate}
            placeholderText="Open End"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>

        {/* Dance Style Type */}
        {/*TODO: change*/}
        <div className="form-group">
          <label> To dance... </label>
          <>
            <OverlayTrigger
              key={"right"}
              placement={"right"}
              overlay={
                <Tooltip id={`tooltip-right`}>
                  The category is only for an easier selection below (Only below
                  submitted).
                </Tooltip>
              }
            >
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={this.state.danceCategory}
                placeholder={"Dance style category..."}
                isClearable={true}
                isSearchable={true}
                styles={SelectStyle}
                onChange={this.handleChange}
                name="danceCategory"
                options={danceStyleCategory}
              />
            </OverlayTrigger>
          </>
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

        {/* Event Type */}
        <div className="form-group">
          <label>At a...</label>

          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={this.state.eventType}
            placeholder={"Event Type..."}
            isClearable={true}
            isSearchable={true}
            onChange={this.handleChange}
            name="eventType"
            options={eventType}
            styles={SelectStyle}
          />
        </div>

        {/*    Submit button (if pressed events will be fetched from backend based on set parameters)   */}
        <div class="form-group">
          <input type="submit" className="btn button-pink" value="Submit" />
        </div>
      </form>
    );
  }
}
export default FilterRequest;
