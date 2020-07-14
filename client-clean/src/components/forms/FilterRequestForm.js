import React from "react";
import Select from 'react-select';
import Form from 'react-bootstrap/Form'

class FilterRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      gender: "",
        proficiencyLevel: "",
      prefEventDate: "",
      prefDateSelection: "",
      eventType: "",
      danceCategory: "",
      danceStyle: "",
      ageOffset:20,
      ageOffsetMin:1,
      ageOffsetMax: 100,

    };
  }

   updatePriceLabels() { //avoids slider overlap
     var sliders = document.querySelectorAll(".price-slider input");
     var val1 = parseInt(sliders[0].value);
     var val2 = parseInt(sliders[1].value);
     if (val1 >= val2) { sliders[0].value = val2 - 3; return; }
     if (val2 <= val1) { sliders[1].value = val1 + 3; return; }
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
    this.setState({
            [e.target.name]: e.target.value
        })
  };

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

    if (this.state.gender != "") {
      url += "listofGenders=" + this.state.gender;
      previous = true;
    }
    if (this.state.proficiencyLevel != "") {
      if (previous) {
        url += "&";
      }
      url += "listOfProficiencyLevels=" + this.state.proficiencyLevel;
      previous = true;
    }
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

    if (this.state.city != "") {
      if (previous) {
        url += "&";
      }
      url += "city=" + this.state.city;
      previous = true;
    }


    //TODO: date, event, age

    //fetch requests from backend
    this.props.getRequests(url);
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

    // Date 2 Option - calender


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
        {/*TODO: Add autofill*/}
        <div>
          <label>In...</label>
          <input
            type="text"
            className="form-control"
            id="city"
            placeholder="Munich"
            name="city"
            onChange={this.onChangeInput}
            value={this.city}
          />
        </div>

        {/* Date Type 1 - selection*/}
        {/* TODO: Multi Selection?*/}
        <div className="form-group">
          <label> On... </label>
          <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={this.state.prefDateSelection}
              placeholder={"Date selection..."}
              isClearable={true}
              isSearchable={true}
              onChange={this.handleChange}
              name="dateSelection"
              options={dateSelection}
          />
        </div>

        {/* Date Type 2 - calender*/}
        {/* TODO*/}

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
