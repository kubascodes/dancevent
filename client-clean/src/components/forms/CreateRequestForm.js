import React from "react";
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Overlay,
  Popover,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import moment from "moment";
import { Link } from "react-router-dom";
import { CriticalAlert } from "../helpers/Alert";
import {MdEvent, MdFace, MdFavorite, MdPerson, MdStarHalf} from "react-icons/md";
import {GiBodyHeight} from "react-icons/gi";
import {SelectStyle} from "../../assets/styles";

class CreateRequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      // Looking for information
      prefGender: "",
      prefAgeMin: 20,
      prefAgeMax: 30,
      prefProficiencyLevel: "",
      description: "",
      // Event info
      danceCategory: [],
      danceStyle: null,
      showModal: false,
      validDescription: true, // checks if the required values are available and if not,
      validSelect: true,
      showPopover: false,
      targetPopover: null,
      showModalUnvarified: false,

      showAltert : false,
      errorMessage: "",
    };
  }

  hideAlert = () => { this.setState({ showAltert: !this.state.showAltert }) }

  handleCancel = () => {
    /* this function is called, 1. when the modal is canceled and 2. when the request is submitted to reset the changes and close the modal*/
    this.setState({
      danceCategory: [],
      prefProficiencyLevel: "",
      description: "",
      // Event info
      danceStyle: null,
      validDescription: true,
      validSelect: true,
    });

    const user = this.state.user;

    // close the partner request form from the super component, component did update will then handle the showDialog property
    this.props.onClose();

    if (user) {
      this.setState({
        prefGender: user.prefGender,
        prefAgeMin: user.prefAgeMin,
        prefAgeMax: user.prefAgeMax,
      });
    } else {
      this.setState({
        prefGender: null,
        prefAgeMin: 20,
        prefAgeMax: 50,
      });
    }
  };

  /*
    handleShow = () => {
        //show the modal
        if(this.state.user.userType == "Dancer") {
            this.setState({showModal: true});
        }else{
            this.setState({showModalUnvarified: true});
        }
    }
    */

  onChange = (e) => {
    /*this function handles the change of the input fields*/
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
    }

    // if a desciption is enered set the validation true
    if (e.target.name == "description") {
      this.setState({ validDescription: true });
    }

    if (allow) {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleSelect = (selectedOption, action) => {
    /* this function handles the interaction of the selection component that is like a drop down */

    this.setState({
      [action.name]: selectedOption ? selectedOption.value : "",
    });
    if (action.name == "danceCategory") {
      this.setState({ danceStyle: "" });
    }
  };

  handleMultiSelect = (danceStyle) => {
    /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
    this.setState({ danceStyle });
  };

  colorMissingSelectRed = () => {};

  handleSubmit = (e) => {
    /*check the request, if every required value is entered call submitRequest to send it to the backend otherwise */
    e.preventDefault();

    // TODO check if event is linked
    // check if required values are entered
    if (
      this.state.prefProficiencyLevel != "" &&
      this.state.prefGender != "" &&
      this.state.description != ""
    ) {
      this.submitRequest();
    } else {
      this.setState({
        targetPopover: e.target,
        showPopover: true,
      });

      if (
        this.state.prefGender == "" ||
        this.state.prefProficiencyLevel == ""
      ) {
        this.setState({ validSelect: false });
      }

      if (this.state.description == "") {
        this.setState({
          validDescription: false,
        });
      }
    }
  };

  submitRequest = () => {
    /*submits the request, by calling the createRequestPost to add it to the backend*/

    // adding the dance category and the values of the styles (saved as [{value, label}]) together as one to send to the backend
    const danceStyle = this.state.danceStyle
      ? this.state.danceStyle
          .map((style) => style.value)
          .concat(this.state.danceCategory)
      : this.state.danceCategory;

    // TODO: fix dance style below.. problem: what if only dance category selected
    // create request body
    var newRequest = {
      description: this.state.description,
      prefAgeMin: this.state.prefAgeMin,
      prefAgeMax: this.state.prefAgeMax,
      listofGenders: this.state.prefGender,
      listOfProficiencyLevels: this.state.prefProficiencyLevel,
      listOfDanceStyles: danceStyle,
      event: this.props.event._id,
    };

    console.log("newRequest", newRequest);

    var secret_token = window.sessionStorage.secret_token;

    fetch("/createrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + secret_token,
      },
      body: JSON.stringify(newRequest),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json()
      })
      .then((res) => {
        if (res) {
          this.handleCancel();
        }
      }).catch(err => {
        this.setState({
          showAltert: true,
          errorMessage: "Error occured while sending to server. Request might not have been updated."
        })
        console.log(err)
    })
  };

  getUser() {
    const component_scope = this; //binding this context to the current component
    fetch("/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then(function (res) {
        component_scope.setState({
          user: res,
          prefGender: res.prefGender,
          prefAgeMin: res.prefAgeMin,
          prefAgeMax: res.prefAgeMax,
        });
      })
      .catch((err) => alert(err));
  }

  componentDidMount() {
    if (window.sessionStorage.secret_token != null) {
      this.getUser();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (!prevProps.show && this.props.show) {
        this.setState({ showModal: true });
      } else if (prevProps.show && !this.props.show) {
        this.setState({ showModal: false });
      }
    }
  }

  calculate_age = (yearOfBrith) => {
    var today = new Date();
    var todayNum = Number(today.getFullYear());
    //var birthDate = new Date(yearOfBrith); // left, if we decide to change saving the exact birth date.
    var age_now = today.getFullYear() - yearOfBrith; //birthDate.getFullYear();
    return age_now;
  };

  render() {
    //gender
    const gender = [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ];

    // Skill level // TODO: define categories new
    const prefProficiencyLevels = [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ];

    // Dance Styles //TODO (optional): add more various
    const danceStyleCategory = [
      { value: "latin", label: "Latin/Rythm" },
      { value: "standard", label: "Standard/Smooth" },
      { value: "various", label: "Various" },
    ];

    const latin = [
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
      { value: "waltz", label: "Waltz" },
      { value: "viennese waltz", label: "Viennese Waltz" },
      { value: "tango", label: "Tango" },
      { value: "foxtrot", label: "Foxtrot" },
      { value: "qickstep", label: "Qickstep" },
    ];
    const various = [
      { value: "salsa", label: "Salsa" },
      { value: "bachata", label: "Bachata" },
      { value: "west coast swing", label: "West Cost Swing" },
      { value: "hustle", label: "Hustle" },
    ];

    const danceStyle = this.state.danceStyle;
    const user = this.state.user;

    // ERROR handling if required value is missing
    // sets the colors red if nothing is selected in the submit
    //color of the selects, when not entered
    /*const customStyle = this.state.validSelect
      ? {
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
            };
          },
        }
      : {
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
              color: "#dc2029",
            };
          },
        };
    //color the textarea if not entered a text
    const customColor = this.state.validDescription
      ? { borderColor: "#ccc" }
      : { borderColor: "#dc2029" };*/

    //when logged in display requests
    if (window.sessionStorage.secret_token != null) {
      if (user) {
        // TODO: check if really used or needed
        const userDanceStyles = user.listOfDanceStyles ? (
          user.listOfDanceStyles.map((style) => <li>{style}</li>)
        ) : (
          <li> You have not entered any dance styles.</li>
        );

        return (
          <div>
          <CriticalAlert show={this.state.showAltert} change={this.hideAlert} text={this.state.errorMessage}/>
          
          <Modal
            show={this.state.showModal}
            onHide={this.handleCancel}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
          {" "}
          <Col>{" "}
          </Col>
          <Col>

          <Modal.Title>{" "}<Image
          src={
              user.picture
                  ? user.picture
                  : "img/placeholderDancerProfile.png"
          }
          alt={user.name}
          style={{ width: "180px", height: "171px" }}
          roundedCircle
          /></Modal.Title>
          </Col>



          <Col></Col>




          </Modal.Header>


            <Modal.Body>
              <Container fluid>
                <div className="form-group">
                  <form onSubmit={this.handleSubmit}>
              <h4>{user.name}</h4>
                    {/* User-Age Information*/}
                    <Row>
                      <Col>
                      <MdFace className="align-text-bottom" />{" "}<label>My age...</label>
                      </Col>
                      <Col>
                        <label>{this.calculate_age(user.yearOfBirth)}</label>
                      </Col>
                    </Row>

                    {/* User-Height Information*/}
                    <Row>
                      <Col>
          <GiBodyHeight className="align-text-bottom"/>  {" "}<label>My height...</label>
                      </Col>
                      <Col>
                        <label>{user.height}cm</label>
                      </Col>
                    </Row>

                    {/* User-Skill Information*/}
                    <Row>
                      <Col>
          <MdStarHalf className="align-text-bottom" />{" "} <label>My dancing experience...</label>
                      </Col>
                      <Col>
                        <label>{user.proficiencyLevel}</label>
                      </Col>
                    </Row>

                    {/* User - Style Information*/}
                    <Row>
                      <Col>
                        {" "}
          <MdFavorite className="align-text-bottom"/>{" "}<label>I usually enjoy to dance...</label>{" "}
                      </Col>
                      <Col>{userDanceStyles}</Col>
                    </Row>

                    {/* Request Information_______________________*/}
                    {/* Request  search "headline"*/}
                    <Row>
                      {" "}
                      <label><b>I am looking for...</b></label>{" "}
                    </Row>
                    {/* Preferred - Gender */}
                    {/*Gender Type // TODO (optional): clear unspecified/ other how to name it*/}
                    <Row>
                      <Col>
                        {" "}
          <MdPerson className="align-text-bottom" />{" "}<label> Gender... </label>{" "}
                      </Col>
                      <Col>
                        <div className="form-group">
                          <Select
                            className="border-red"
                            classNamePrefix="select"
                            defaultValue={gender.filter(
                              (value) => value.value === this.state.prefGender
                            )}
                            placeholder={"Preferred gender..."}
                            isClearable={true}
                            isSearchable={true}
                            onChange={this.handleSelect}
          styles={SelectStyle}
                            name="prefGender"
                            options={gender}
                          />
                        </div>
                      </Col>
                    </Row>

        {/* Preferred - Age Range*/}
                    <Row>
                      <Col>
          <MdFace className="align-text-bottom" />{" "} <label>Age range...</label>
                      </Col>
                      <Col>
                        <Row>
                          <Col xs={4}>
                            <input type="number"
                              placeholder={this.state.prefAgeMin}
                              className="form-control col"
                              name="prefAgeMin"
                              step="5"
                                style={{ width: "70px" }}
                              onChange={this.onChange}
                              value={this.state.prefAgeMin}
                            />
                          </Col>
                          <Col >

                          </Col>
                          <Col xs={4}>
                            <input type="number"
                              placeholder={this.state.prefAgeMax}
                              className="form-control col"
                              name="prefAgeMax"
                              step="5"
          style={{ width: "70px" }}
                              onChange={this.onChange}
                              value={this.state.prefAgeMax}
                            />
                          </Col>
                                </Row>
                            <div class="age-slider">
                                  <input
                              type="range"
                              className="custom-range"
                              id="prefAgeMin"
                              name="prefAgeMin"
                              min="0"
                              max="100"
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
                              max="100"
                              step="5"
                              value={this.state.prefAgeMax}
                              onChange={this.onChange}
                              />
                              </div>
                      </Col>
                    </Row>

                    {/* Preferred - Skill Level*/}
                    <Row>
                      <Col>
          <MdStarHalf className="align-text-bottom" />{" "}<label>Dancing experience level...</label>{" "}
                      </Col>
                      <Col>
                        <div className="form-group">
                          <Select
                            className="border-red"
                            classNamePrefix="select"
                            defaultValue={this.state.prefProficiencyLevel}
                            placeholder={"Proficiency levels..."}
                            isClearable={true}
                            isSearchable={true}
                            styles={SelectStyle}
                            onChange={this.handleSelect}
                            name="prefProficiencyLevel"
                            options={prefProficiencyLevels}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* Preferred - Dance Style //TODO: Prefill fix: Event style! */}
                    <Row>
                      <Col>
          <MdFavorite className="align-text-bottom"/>{" "}<label>To dance...</label>
                      </Col>
                      <Col>
                        {/* The following are two selections, where the secound is depending on the first.
                            Here are the dance style categories and depending on that the user can specify the dancing style in more details if wanted.
                            This is solves by a switch case... */}
                        <div>
                          <div className="form-group">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              defaultValue={this.state.danceCategory}
                              placeholder={"Dance style category..."}
                              isClearable={true}
                              isSearchable={true}
                                styles={SelectStyle}
                              onChange={this.handleSelect}
                              name="danceCategory"
                              options={danceStyleCategory}
                            />
                            {
                              {
                                latin: (
                                  <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={this.handleMultiSelect}
                                    defaultValue={""}
                                    value={danceStyle}
                                    isMulti={true}
                                    placeholder={"Dance style..."}
                                    isClearable={true}
                                  styles={SelectStyle}
                                    isSearchable={true}
                                    name="danceStyle"
                                    options={latin}
                                  />
                                ),
                                standard: (
                                  <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={this.handleMultiSelect}
                                    defaultValue={""}
                                    value={danceStyle}
                                    isMulti={true}
                                    placeholder={"Dance style..."}
                                    isClearable={true}
                                  styles={SelectStyle}
                                    isSearchable={true}
                                    name="danceStyle"
                                    options={standard}
                                  />
                                ),
                                various: (
                                  <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={this.handleMultiSelect}
                                    defaultValue={""}
                                    value={danceStyle}
                                    isMulti={true}
                                    placeholder={"Dance style..."}
                                    isClearable={true}
                                  styles={SelectStyle}
                                    isSearchable={true}
                                    name="danceStyle"
                                    options={various}
                                  />
                                ),
                              }[this.state.danceCategory]
                            }
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {" "}
          <MdEvent className="align-text-bottom"/> {" "}<label>For the following event: </label>
                      </Col>
                      <Col>
                        {this.props.event.organizer ? (
                          <label>
                            <b>{this.props.event.title}</b> by{" "}
                            {this.props.event.organizer.name} on{" "}
                            {moment(this.props.event.startDate).format(
                              "dddd D.M.YYYY"
                            )}{" "}
                            in {this.props.event.city}
                          </label>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>

                    {/*Request - Description */}
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <textarea
                            name="description"
                            className="form-control border-red"
                            id="description"
                            onChange={this.onChange}
                            placeholder="Personal text to add to the request"
                            value={this.description}
                          />
                        </div>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCancel}>
                {" "}
                Cancel{" "}
              </Button>

              <div>
                <Button
                  name="submit"
          className="button-pink"
                  type="submit"
                  variant="primary"
                  onClick={this.handleSubmit}
                >
                  {" "}
                  Place Request{" "}
                </Button>

                <Overlay
                  show={this.state.showPopover}
                  target={this.state.targetPopover}
                  placement="top"
                  containerPadding={20}
                >
                  <Popover id="popover-contained">
                    <Popover.Content>
                      {" "}
                      Please check if all the required data is added!{" "}
                    </Popover.Content>
                  </Popover>
                </Overlay>
              </div>
            </Modal.Footer>
          </Modal>
          </div>
        );
      } else {
        return <label>Loading... </label>;
      }
    } else {
      return <></>;
    }
  }
}

export default CreateRequestForm;
