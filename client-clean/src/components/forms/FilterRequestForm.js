import React from "react";
import Select from 'react-select';
import cities from './cities';
import DatePicker from "react-datepicker";


class FilterRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "Munich",
        prefAgeMin: 0,
        prefAgeMax: 100,
      gender: "",
        proficiencyLevel: "",
      prefEventDate: "",
      prefDateSelection: "",
      eventType: "",
      danceCategory: "",
      danceStyle: "",
      //ageOffset:20,
      //ageOffsetMin:1,
      //ageOffsetMax: 100,
        startDate: new Date(),
        endDate: null,

    };
  }


  //TODO: write Submit
  //TODO: handle city
  //TODO: check filter => return filtered array
  //TODO: handle reset all
  //submitFilter = (e) => {
  submitFilterOld = (e) => {
    /*This function is called if the user enters a city and presses enter*/
    e.preventDefault();
    const filterRequests = this.props.requests.filter((request) => {
      return request;
    });
    this.props.filterRequests(this.state); //TODO: change
  };

  onChange = (e) => {
    /*This function is called if the user changes a variable of the filter options*/
    e.preventDefault();

      var allow = true;
      // check that the min in not bigger than the max and the other way around
      if (e.target.name == "prefAgeMin") {
          if (e.target.value >= this.state.prefAgeMax) {
              allow = false;
          }
      }
      if (e.target.name == "prefAgeMax") {
          if (e.target.value <= this.state.prefAgeMin) {
              allow = false;
          }
      };
      if (allow) {
          this.setState({[e.target.name]: e.target.value});
      };
  };

    //Changes the state for REACT-SELECT inputs
    onChangeCity = (event) => {
        console.log(event)
        this.setState({city : event.value})
    }

    handleTextDate = (selectedOption, action) => {
        /*this function gets a text like "tomorrow" and evaluates than the start and end date*/
        if(selectedOption){

            var startDate ;
            var endDate;
            switch(selectedOption.value){
                case "today":
                    startDate = new Date();
                    endDate = startDate;
                    break;
                case "tomorrow":
                    startDate = new Date(new Date().setTime( new Date().getTime() + 1 * 86400000 ));
                    endDate = startDate;
                    break;
                case "week":
                    var curr = new Date; // get current date
                    var monday = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
                    var sunday = monday + 6; // last day is the first day + 6
                    startDate = new Date(new Date().setDate(monday));
                    endDate = new Date(new Date().setDate(sunday));
                    break;
                case "weekend":
                    var curr = new Date; // get current date
                    var friday = curr.getDate() - curr.getDay() + 5; // First day is the day of the month - the day of the week
                    var sunday = friday + 2; // last day is the first day + 6
                    startDate = new Date(new Date().setDate(friday));
                    endDate = new Date(new Date().setDate(sunday));
                    break;

            }
            this.setState({
                startDate: startDate,
                endDate: endDate
            });
        }
        else{
            this.setState({
                startDate: new Date(),
                endDate: null,
            });
        }
    }


    // handle Select
  handleChange = (selectedOption, action) => {

      this.setState({
        [action.name]: selectedOption ? selectedOption.value : ""
      });

      if(action.name == 'danceCategory'){
        this.setState({
          danceStyle: ''
        })
      }

  }

  handleChangeMSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    this.setState({danceStyle});
  }

  submitFilter = (e) => {
    /*
        This Method is the called if the user want to update
        the events based on the set filters
        It checks if a option is not in the general case and
        then adds it to the URL
        */

    //otherwise it would reload the Page
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
    if (this.state.danceCategory != "") {
      if (previous) {
        url += "&";
      }
      url += "listOfDanceStyles=" + this.state.danceCategory;
      previous = true;
      if (this.state.danceStyle != "") {
        if(previous){
            const style = this.state.danceStyle ? this.state.danceStyle.map(style => style.value) : "";
            if (style){
                style.map((styles) => (
                    url += "&listOfDanceStyles=" + styles
                ));
            }
        }}
    }

    /*if (this.state.city != "") {
      if (previous) {
        url += "&";
      }
      url += "city=" + this.state.city;
      previous = true;
    }*/
      console.log(url);


    //TODO: date, event, age

    //fetch requests from backend
    this.props.getRequests(url);
  };
    //Changes the state for calendar inputs
    //type should specify if it is a start- or endDate
    onChangeCalendar = (date, type) => {
        console.log(this)
        this.setState({ [type]: date });
    };

  render() {

    // New Selection Types:
    //gender
    const gender = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female'},
        { value: 'other', label: 'Other'},
    ];

    // Age - slider //TODO: add age slider


    // Skill level
    const proficiencyLevels = [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ];

    // City - input + autofill

    // Date 1 Option - selection
    const dateSelection = [
      { value: 'today', label: 'Today' },
      { value: 'tomorrow', label: 'Tomorrow' },
      { value: 'weekend', label: 'This Weekend' },
      { value: 'week', label: 'This Week' },
    ];

    // Dance Styles
      const danceStyleCategory = [
          {value: 'latin', label: 'Latin/Rythm'},
          {value: 'standard', label: 'Standard/Smooth'},
          {value: 'various', label: 'Various'},
      ];

      const latin = [
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
          {value: 'waltz', label: 'Waltz'},
          {value: 'viennese waltz', label: 'Viennese Waltz'},
          {value: 'tango', label: 'Tango'},
          {value: 'foxtrot', label: 'Foxtrot'},
          {value: 'qickstep', label: 'Qickstep'},
      ];
      const various = [
          {value: 'salsa', label: 'Salsa'},
          {value: 'bachata', label: 'Bachata'},
          {value: 'west coast swing', label: 'West Cost Swing'},
          {value: 'hustle', label: 'Hustle'},
      ];

    // Event Type - Multiple
    const eventType = [
      { value: 'ball', label: 'Ball' },
      { value: 'party', label: 'Party' },
      { value: 'course', label: 'Course' },
      { value: 'competition', label: 'Competition' },
    ];

    const danceStyle = this.state.danceStyle;

    return (
      <form onSubmit={this.submitFilter}>
        <h4>Filter Requests</h4>

        {/*Gender Type // TODO (optional): clear unspecified*/}
        <div className="form-group">
        <label> I am looking for a... </label>
        <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={this.state.gender}
            placeholder={"All genders..."}
            isClearable={true}
            isSearchable={true}
            onChange={this.handleChange}
            name="gender"
            options={gender}
        />
        </div>

        {/*Age Slider */}
        {/*TODO add
        */}

          {/* Preferred - Age Range*/}
          <div>
            <label>Age Range: {this.state.prefAgeMin} - {this.state.prefAgeMax} </label>
          </div>

          <div class="age-slider">
              <input type="range" className="custom-range" id="prefAgeMin" name="prefAgeMin"
                  min="0" max="100" step="5"
                  value={this.state.prefAgeMin}
                  onChange={this.onChange}/>

              <input type="range" className="custom-range" id="prefAgeMax" name="prefAgeMax"
                min="0" max="100" step="5"
                value={this.state.prefAgeMax}
                onChange={this.onChange}/>
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
              onChange={this.handleChange}
              name="proficiencyLevel"
              options={proficiencyLevels}
          />
        </div>

        {/*City Type*/}
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

        {/* Date Type 1 - selection*/}
        {/* TODO: Multi Selection?*/}
  <label className="label-bold"> In the time...</label>
        <div className="form-group">
          <label> On... </label>
          <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={this.state.prefDateSelection}
              placeholder={"Date selection..."}
              isClearable={true}
              isSearchable={true}
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
                          onChange={date => this.onChangeCalendar(date, "startDate")}
                          selectsStart
                          dateFormat="MMMM d, yyyy"
                          minDate={new Date()}
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                      />
                  </div>
                  <div className="form-group">
                        <label > Till...  </label>
                        <DatePicker
                          className="form-control"
                          name="endDate"
                        selected={this.state.endDate}
                          onChange={date => this.onChangeCalendar(date, "endDate")}
                          selectsEnd
                          dateFormat="MMMM d, yyyy"
                          minDate={this.state.startDate}
                        placeholderText="Select a end date"
                        startDate={this.state.startDate}
                         endDate={this.state.endDate}
                        />
                    </div>

        {/* Dance Style Type */}
        {/*TODO: change*/}
        {/*TODO: add secound*/}
        <div className="form-group">
          <label> To dance... </label>
          <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={this.state.danceCategory}
              placeholder={"Dance style category..."}
              isClearable={true}
              isSearchable={true}
              onChange={this.handleChange}
              name="danceCategory"
              options={danceStyleCategory}
          />
          {
            {
              'latin':
                  <Select
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={this.handleChangeMSelect}
                  defaultValue={''}
                  value={danceStyle}
                  isMulti = {true}
                  placeholder={"Dance style..."}
                  isClearable={true}
                  isSearchable={true}
                  name="danceStyle"
                  options={latin}
                  /> ,
              'standard':
                  <Select
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={this.handleChangeMSelect}
                  defaultValue={''}
                  value={danceStyle}
                  isMulti = {true}
                  placeholder={"Dance style..."}
                  isClearable={true}
                  isSearchable={true}
                  name="danceStyle"
                  options={standard}
                  /> ,
              'various':
                  <Select
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={this.handleChangeMSelect}
                  defaultValue={''}
                  value={danceStyle}
                  isMulti = {true}
                  placeholder={"Dance style..."}
                  isClearable={true}
                  isSearchable={true}
                  name="danceStyle"
                  options={various}
                />

            }[this.state.danceCategory]
          }
        </div>

        {/* Event Type */}
        {/*TODO: change*/}
        {/*<div className="form-group">
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
          />
        </div>*/}

        {/*    Submit button (if pressed events will be fetched from backend based on set parameters)   */}
        <div class="form-group">
          <input
              type="submit"
              class="btn btn-outline-dark"
              value="Submit"
          />
        </div>

      </form>
    );
  }
}
export default FilterRequest;
