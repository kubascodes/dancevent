import React from 'react';
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import cities from './cities'
import ProgressBar from 'react-bootstrap/ProgressBar'
import "react-datepicker/dist/react-datepicker.css";
import {SelectStyle} from '../../assets/styles';

import ProcessImage from '../../services/imageProcessing';

import { Image, Button, Container, Row, Col, Table } from "react-bootstrap";

import { CriticalAlert } from "../helpers/Alert";


/*
*   This Component is for Creating and Updating Events
*   if props.update is set Component will prefill Fields
*/
class EventCreationForm extends React.Component {
  
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {
      //Event attributes
      title: null,
      type: "course",
      description: "",
      startDate: new Date(),
      //Current date + 20 days
      endDate: new Date().setDate((new Date()).getDate() + 10),
      city: "Munich",
      location: null,
      listOfDanceStyles: [],
      listOfProficiencyLevels: [],
      price: null,
      promoCode: null,
      picture: null,
      interval: "once",

      //attributes used for Class
      pictureChange: false,
      danceCategory: 'latin',
      danceStyle: [],

      showAltert: false,
      errorMessage: "",
      redirect: null,
      //upload
      uploadProgress: 0,
      hiddenProgress: true,
    };
  }

  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //When update: fetch event from backend
  componentDidMount() {
    if (this.props.update) {
      //to get the param ID specified in the URL
      const {
        match: { params },
      } = this.props;

      const component_scope = this;

      fetch(`/events/${params.id}`)
        .then((res) => res.json())
        .then((data) => {

          //remove the supercategories
          var dancstyles = [];
          var danceCategory = null;
          var style;
          for (style of data.listOfDanceStyles) {
            if (!["latin", "standard", "various"].includes(style)) {
              dancstyles.push({ value: style, label: style });
            } else {
              danceCategory = style;
            }
          }

          //Set the loaded data to state
          component_scope.setState({
            title: data.title,
            type: data.type,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.startDate),
            city: data.city,
            location: data.location,
            listOfDanceStyles: data.listOfDanceStyles,
            listOfProficiencyLevels: data.listOfProficiencyLevels,
            price: data.price,
            promoCode: data.promoCode,
            picture: data.picture,

            danceCategory: danceCategory,
            danceStyle: dancstyles,


          })
          if (this.state.course === "course") {
            component_scope.setState({
              interval: data.interval
            })
          }

        })
        .catch(err => {
          component_scope.setState({
            showAltert: true,
            errorMessage: "Existing data could not be loaded"
          })
          console.log(err)
        });
    }
  }

  // <Select> needs value and label as input
  selectObject = (prop) => (
    { value: prop, label: prop.charAt(0).toUpperCase() + prop.slice(1) }
  )
  selectObjectList = (prop) => (
    prop.map(i => this.selectObject(i))
  )
  
  hideAlert = () => { this.setState({ showAltert: !this.state.showAltert }) }

  //upload progress bar
  setUploadProgress = (progress) => {
    this.setState({ uploadProgress: progress });
  }

  //Changes the state for text inputs and selects
  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state);
  };

  //Changes the state for select inputs
  handleSelect = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */
    this.setState({
      [action.name]: selectedOption ? selectedOption.value : ""
    });
    console.log(this.state)
  }

  //Changes the state for multi select inputs (saves only the values)
  handleSelectList = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */
    this.setState({
      [action.name]: selectedOption ? selectedOption.map(i => i.value) : []
    });
  }

  //Changes the state for multi select inputs (saves all)
  handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    this.setState({ danceStyle });
  }

  //Changes the state for multiple selects inputs
  //the user can select more than one choice
  onChangeMultipleSelect = (event) => {

    var opts = [];
    //the selected options (its a list but not in js format)
    //elements in options have boolean selected and value (the name)
    var options = event.target.options
    var length = options.length;
    //iterate through the selected options
    for (var i = 0; i < length; i++) {
      let op = options[i]
      if (op.selected) {
        opts.push(op.value)
      }
    }
    //store in state
    this.setState({ [event.target.name]: opts });
  }

  //Changes the state for calendar inputs
  //type should specify if it is a start- or endDate
  onChangeCalendar = (date, type) => {
    this.setState({ [type]: date });
  };

  //Changes the state for Img imputs
  onChangeFile = (event) => {
    //setting the file to the input
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      let context = this;
      //defining the function
      async function processImage(file, fileUrl, context) {
        try {
          let image = await ProcessImage(file, fileUrl, "eventPicture", context);
          context.setState({
            picture: image,
            pictureChange: true
          });
        }
        catch (error) {
          alert(error);
        }
      };
      //displaying progress bar
      this.setState({ hiddenProgress: false });
      //calling the function
      processImage(file, fileUrl, context);
    }

  };

  //This method posts/puts the state to the REST backend
  pushEvent = (event) => {


    //prevent default behavior
    event.preventDefault();

    //check again if user is locked in
    if (window.sessionStorage.secret_token != null) {

      //saving the component scope
      var component_scope = this;

      //saving the auth token
      const token = window.sessionStorage.secret_token

      var danceStyles;
      
      //if a dancestyle subCategory is selected add the supercategory
      if (this.state.danceStyle.length == 0) {
        danceStyles = [this.state.danceCategory]
      } else {

        
        danceStyles = this.state.danceStyle.map(style => style.value)

        var latinStyles = ['jive', 'rumba', 'cha-cha-cha', 'samba', 'paso doble', 'bolero', 'mambo', 'east coast swing'];
        var standardStyles = ['waltz', 'viennese waltz', 'tango', 'foxtrot', 'qickstep'];
        var variousStyles = ['salsa', 'bachata', 'west coast swing', 'hustle'];
        // Check if intersection is not empty
        // => the user has a chosen a danceStyle of this parentclass
        //include it so it is easier to filter in later cases
        if (danceStyles.some(r => latinStyles.includes(r))) {
          danceStyles.push('latin')
        }
        if (danceStyles.some(r => standardStyles.includes(r))) {
          danceStyles.push('standard')
        }
        if (danceStyles.some(r => variousStyles.includes(r))) {
          danceStyles.push('various')
        }
      }

      //standard address
      var address = "/events/"


      //saving state to body of HTML
      var body = {

        title: this.state.title,
        type: this.state.type,
        description: this.state.description,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        city: this.state.city,
        location: this.state.location,
        listOfDanceStyles: danceStyles,
        listOfProficiencyLevels: this.state.listOfProficiencyLevels,
        price: this.state.price,
        promoCode: this.state.promoCode,
      }
      if (this.state.pictureChange) {
        body['picture'] = this.state.picture
      }
      if (this.state.course === "course") {
        body['interval'] = this.state.interval
      }

      //specify HTML Method (put/post)
      if (this.props.update) {
        //Get URL Parameter (Event ID) to add to address
        const { match: { params } } = this.props;
        address = address + params.id

        var method = 'Put'
      } else {
        var method = 'POST'
      }

      var component_scope = this;

      //post/put to organizer's registration api
      fetch(address, {
        method: method,
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': 'application/json; charset=utf-8'
        },
        //body must be stringify to be readable by backend
        body: JSON.stringify(body)
      }) //create a post request which is a Promise
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json()
        })
        .then((res) => {
          //Save the new event in the App
          this.props.onCreate(res)
          //Redirect to Event
          this.setState({ redirect: "/events/single/" + res._id });

        })
        .catch(err => {
          console.log(err)
          if (component_scope.props.update) {
            component_scope.setState({
              showAltert: true,
              errorMessage: "Error occured while sending to server. Event might not have been updated."
            })
          } else {
            component_scope.setState({
              showAltert: true,
              errorMessage: "Error occured while sending to server. Event might not have been created."
            })
          }
        }
        );
    } else {
      this.setState({
        showAltert: true,
        errorMessage: "You are not authorized to do this operation."
      })
    }
  };




  render() {

    const eventLevels = [
      "beginner", "intermediate", "advanced"
    ];


    // Dance Styles
    const danceStyleCategory = [
      { value: 'latin', label: 'Latin/Rythm' },
      { value: 'standard', label: 'Standard/Smooth' },
      { value: 'various', label: 'Various' },
    ];

    const latin = [
      { value: 'jive', label: 'Jive' },
      { value: 'rumba', label: 'Rumba' },
      { value: 'cha-cha-cha', label: 'Cha-Cha-Cha' },
      { value: 'samba', label: 'Samba' },
      { value: 'paso doble', label: 'Paso Doble' },
      { value: 'bolero', label: 'Bolero' },
      { value: 'mambo', label: 'Mambo' },
      { value: 'east coast swing', label: 'East Cost Swing' },
    ];
    const standard = [
      { value: 'waltz', label: 'Waltz' },
      { value: 'viennese waltz', label: 'Viennese Waltz' },
      { value: 'tango', label: 'Tango' },
      { value: 'foxtrot', label: 'Foxtrot' },
      { value: 'quickstep', label: 'Quickstep' },
    ];
    const various = [
      { value: 'salsa', label: 'Salsa' },
      { value: 'bachata', label: 'Bachata' },
      { value: 'west coast swing', label: 'West Cost Swing' },
      { value: 'hustle', label: 'Hustle' },
    ];


    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    if (window.sessionStorage.secret_token != null) {
      return (
        <div>
          <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage} />
          {((this.props.update && typeof (this.state.picture) === "string") || this.state.pictureChange) ? (
            <Image
              src={this.state.picture}
              alt={this.state.title}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "300px",
              }}
            />


          ) : (
              <></>
            )}
          <form className="form-group" id="EventCreationForm" onSubmit={this.pushEvent}>
            <Container className="mt-3">
              <Row className="justify-content-md-center">
                <div className="form-group">
                  <div className="custom-file">
                    <input type="file" className="custom-file-input form-control" name="picture" onChange={this.onChangeFile} id="customFile" />
                    <label className="custom-file-label form-control" htmlFor="customFile">Upload your event picture</label>
                  </div>
                </div>
              </Row>

              <Row>
                <Col>
                  <div className="form-group">
                    <ProgressBar animated={true} min={0} max={100} striped={true} now={this.state.uploadProgress} label={"Uploading " + this.state.uploadProgress + " %"} hidden={this.state.hiddenProgress} />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xs={9}>
                  <div className="form-group">
                    <input type="text" className="form-control form-control-lg border-red" id="title" name="title" placeholder="Event Title" onChange={this.onChangeInput} value={this.state.title} required />
                  </div>

                  <div className="form-group row">
                    <label className="label-bold col-form-label col-sm-2" htmlFor="type">Dance type</label>


                    <div className="col-sm-5">
                      <Select
                        className="basic-single border-red"
                        value={this.selectObject(this.state.type)}
                        placeholder={"Choose a dance type..."}
                        onChange={this.handleSelect}
                        name="type"
                        styles={SelectStyle}
                        options={this.selectObjectList(["course", "ball", "competition", "party"])}
                      />
                    </div>
                  </div>




                  <div className="form-group row">
                    <label className="label-bold col-form-label col-sm-2"> Start date: </label>
                    <div className="col-sm-5">
                      <DatePicker
                        className="form-control border-red datePicker"
                        name="startDate"
                        selected={this.state.startDate}
                        onChange={date => this.onChangeCalendar(date, "startDate")}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="form-group row">

                    <label className="label-bold col-form-label col-sm-2"> Enddate: </label>
                    <div className="col-sm-5">
                      <DatePicker
                        className="form-control border-red datePicker"
                        name="endDate"
                        selected={this.state.endDate}
                        onChange={date => this.onChangeCalendar(date, "endDate")}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={this.state.startDate}
                      />
                    </div>
                  </div>

                  {this.state.type === "course" ?
                    <div className="form-group row">
                      <label className="label-bold col-form-label col-sm-2" htmlFor="type">Interval</label>
                      <div className="col-sm-5">
                        <Select
                          className="basic-single border-red"
                          classNamePrefix="select"
                          value={this.selectObject(this.state.interval)}
                          placeholder={"Choose a Interval..."}
                          onChange={this.handleSelect}
                          name="interval"
                          options={this.selectObjectList(["once", "daily", "weekly", "every two weeks", "monthly"])}
                        />
                      </div>
                    </div>
                    :
                    <></>
                  }

                </Col>
                <Col className="text-center">
                  <div className="form-group">
                    <input type="submit" className="btn button-pink float-right m-4" value="Submit" />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Organizer:</b>
                        </td>
                        <td>
                          You
                    </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Dance Styles:</b>
                        </td>
                        <td>

                          <Select
                            className="basic-single border-red"
                            classNamePrefix="select"
                            defaultValue={this.state.danceCategory}
                            placeholder={"Dance style category..."}
                            isSearchable={true}
                            value={{ label: this.state.danceCategory, value: this.state.danceCategory }}
                            onChange={this.handleSelect}
                            name="danceCategory"
                            options={danceStyleCategory}
                            styles={SelectStyle}
                          />
                          {
                            {
                              'latin':
                                <Select
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={this.handleMultiSelect}
                                  defaultValue={''}
                                  value={this.state.danceStyle}
                                  isMulti={true}
                                  placeholder={"Dance style..."}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="danceStyle"
                                  options={latin}
                                  styles={SelectStyle}
                                />,
                              'standard':
                                <Select
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={this.handleMultiSelect}
                                  defaultValue={''}
                                  value={this.state.danceStyle}
                                  isMulti={true}
                                  placeholder={"Dance style..."}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="danceStyle"
                                  options={standard}
                                  styles={SelectStyle}
                                />,
                              'various':
                                <Select
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={this.handleMultiSelect}
                                  defaultValue={''}
                                  value={this.state.danceStyle}
                                  isMulti={true}
                                  placeholder={"Dance style..."}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="danceStyle"
                                  options={various}
                                  styles={SelectStyle}
                                />

                            }[this.state.danceCategory]
                          }
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>This event is for:</b>
                        </td>
                        <td>
                          <Select
                            className="basic-multi-select border-red"
                            isMulti
                            classNamePrefix="select"
                            value={this.selectObjectList(this.state.listOfProficiencyLevels)}
                            placeholder={"Choose a level..."}
                            onChange={this.handleSelectList}
                            name="listOfProficiencyLevels"
                            options={this.selectObjectList(eventLevels)}
                            styles={SelectStyle}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <b>City:</b>
                        </td>
                        <td>
                          <Select
                            className="basic-single border-red"
                            classNamePrefix="select"
                            defaultValue={this.selectObject(this.state.city)}
                            value={this.selectObject(this.state.city)}
                            placeholder={"Choose a city..."}
                            onChange={this.handleSelect}
                            name="city"
                            options={cities}
                            styles={SelectStyle}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Location:</b>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control border-red"
                            id="location"
                            placeholder="e.g. Steet and Room Number"
                            name="location"
                            onChange={this.onChangeInput}
                            value={this.state.location}
                            required
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Price:</b>
                        </td>
                        <td>

                          <div className="form-row">
                            <input type="number" className="form-control col border-red" id="price" min="0" step="0.01" placeholder="10.00" name="price" onChange={this.onChangeInput} value={this.state.price} required />

                            <div className="input-group-append">
                              <div className="input-group-text">
                                €
                        </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Promocode:</b>
                        </td>
                        <td>

                          <input type="text" className="form-control" id="promoCode" placeholder="e.g. Ball150" name="promoCode" onChange={this.onChangeInput} value={this.state.promoCode} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="form-group">
                    <label className="label-bold">Description</label>
                    <textarea className="form-control" name="description" id="description" onChange={this.onChangeInput} value={this.state.description} rows="4" />
                  </div>
                </Col>
              </Row>
              <Row>
                <p className="text-muted"><b>Note:</b> All fields in pink are required.</p>
              </Row>
              <Row className="justify-content-md-center">
                <Col md="auto">
                  <div className="form-group">
                    <input type="submit" className="btn button-pink" value="Submit" />
                  </div>
                </Col>
              </Row>

            </Container>


          </form>
        </div>
      )
    }

    else {
      return (
        <div> You are not allowed to view this page. </div>
      )
    }

  }

}

EventCreationForm.defaultProps = {
  update: false,
}

export default EventCreationForm
