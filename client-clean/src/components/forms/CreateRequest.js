import React from "react";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import Select from 'react-select';
import {Link} from "react-router-dom";


class CreateRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            // Looking for information
            prefGender: null,
            prefAgeMin: 20,
            prefAgeMax: 50,
            prefProficiencyLevel: null,
            description: "",
            // Event info
            danceCategory: null,
            danceStyle: null,
            events: null, // TODO: not used at the moment => add if needed or delete
            showModal: false,
        };
    }

    handleCancel = () => {
        /* this function is called, 1. when the modal is canceled and 2. when the request is submitted to reset the changes and close the modal*/
        this.setState({
            danceCategory: null,
            prefProficiencyLevel: null,
            description: null,
            // Event info
            danceStyle: null,
            events: null,
            showModal: false,
        });

        var user = this.state.user;

        if(user){
            this.setState({
                prefGender: user.prefGender,
                prefAgeMin: user.prefAgeMin,
                prefAgeMax: user.prefAgeMax
            });
        }
        else{
            this.setState({
                prefGender: null,
                prefAgeMin: 20,
                prefAgeMax: 50
            });
        }
    }


    handleShow = () => {
        this.setState({ showModal: true });
    }


    onChange = (e) => {
        /*this function handles the change of the input fields*/
        e.preventDefault();

        var allow = true;
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
        if (allow) {
            this.setState({
                [e.target.name]: e.target.value
            });
        }


    }

    handleChange = (selectedOption, action) => {
        /* this function handles the interaction of the selection component that is like a drop down */

        this.setState({
            [action.name]: selectedOption ? selectedOption.value : ""
        });
        if (action.name == 'danceCategory') {
            this.setState({
                danceStyle: ''
            })
        }
    }

    handleChangeMSelect = (danceStyle) => {
        /*this function handles a multi selection where the user can select multiple values in the dropdown of the selection*/
        this.setState({danceStyle});
    }

    submitRequest = (e) => {
        /*submits the request, by changing the values and calling the createRequestPost to add it to the backend*/
        e.preventDefault();

        // adding the dance category and the values of the styles (saved as [{value, label}]) together as one to send to the backend
        // TODO: fix dance style below.. problem: what if only dance category selected
        //const danceStyle = this.state.danceStyle ? {this.state.danceStyle.map(style => style.value).concat(this.state.danceCategory) }: {this.state.danceCategory} ;
        const danceStyle = this.state.danceCategory;

        // create request body
        //TODO: email from props
        //TODO: change values
        var newRequest = {
            description: this.state.description,
            prefAgeMin: this.state.prefAgeMin,
            prefAgeMax: this.state.prefAgeMax,
            listofGenders: this.state.prefGender,
            listOfProficiencyLevels: this.state.prefProficiencyLevel,
            counterfeitEmail: this.props.state.email,
            listOfDanceStyles: danceStyle,
            //events: this.state.events, // TODO: needs event link and populate in backend?
        };

        var secret_token = window.sessionStorage.secret_token;

        fetch('/createrequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            },
            body: JSON.stringify(newRequest)
        }).then(res => res.json()).then(res => {
            if (res) {
                this.handleCancel();
            }
        })
    }

    getUserData() {
        const component_scope = this; //binding this context to the current component
        fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + window.sessionStorage.secret_token
            }
        })
            .then(res => res.json(res))
            .then(function (res) {
                component_scope.setState({
                    user: res,
                    prefGender: res.prefGender,
                    prefAgeMin: res.prefAgeMin,
                    prefAgeMax: res.prefAgeMax
                });
            })
            .catch(err => alert(err));

    }

    componentDidMount() {
        if(window.sessionStorage.secret_token != null) {
            this.getUserData()
        }
    }

    render() {

        //gender
        const gender = [
            {value: 'male', label: 'Male'},
            {value: 'female', label: 'Female'},
            {value: 'other', label: 'Other'}
        ];

        // Skill level // TODO: define categories new
        const prefProficiencyLevels = [
            {value: 'beginner', label: 'Beginner'},
            {value: 'intermediate', label: 'Intermediate'},
            {value: 'advanced', label: 'Advanced'},
        ];

        // Dance Styles //TODO (optional): add more various
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

        const danceStyle = this.state.danceStyle;
        const user = this.state.user;

        //when logged in display requests
        if (window.sessionStorage.secret_token != null) {
            //TODO(Bug?) getting the user takes time and the get ('POST') takes long and throws first []
            if(user){return (

                <div className="form-group">
                    <Button variant="primary" onClick={this.handleShow}> Create Request </Button>

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
                            <Modal.Title >
                                {this.state.user.name}
                                {/*TODO:User Image*/}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container fluid>
                                <form onSubmit={this.submitRequest}>

                                    {/* User-Age Information*/}
                                    <Row>
                                        <Col><label>My age...</label></Col>
                                        <Col><label>{user.yearOfBirth}</label></Col>
                                    </Row>

                                    {/* User-Height Information*/}
                                    <Row>
                                        <Col><label>My height...</label></Col>
                                        <Col><label>{user.height}</label></Col>
                                    </Row>

                                    {/* User-Skill Information*/}
                                    <Row>
                                        <Col><label>My dancing experience...</label></Col>
                                        <Col><label>{user.proficiencyLevel}</label></Col>
                                    </Row>

                                    {/* User - Style Information*/}
                                    <Row>
                                        <Col> <label>I usually enjoy to dance...</label> </Col>
                                        <Col>
                                            <ul>
                                                {user.listOfDanceStyles.map((style) =>
                                                    <li>{style}</li>
                                                )}
                                            </ul>
                                        </Col>
                                    </Row>


                                    {/* Request Information_______________________*/}
                                    {/* Request  search "headline"*/}
                                    <Row> <label>I am looking for...</label> </Row>
                                    {/* Preferred - Gender */}
                                    {/*Gender Type // TODO (optional): clear unspecified/ other how to name it*/}
                                    <Row>
                                        <Col> <label> Gender... </label> </Col>
                                        <Col>
                                            <div className="form-group">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    defaultValue={this.state.prefGender}
                                                    placeholder={"Preferred gender..."}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    onChange={this.handleChange}
                                                    name="prefGender"
                                                    options={gender}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Preferred - Age Range*/}
                                    <Row>
                                        <Col><label>Age range...</label></Col>
                                        <Col>
                                            <Row>
                                                <Col><label>Min Age: </label></Col>
                                                <Col xs={6}>
                                                    <input type="range" className="custom-range" id="prefAgeMin" name="prefAgeMin"
                                                           min="0" max="100" step="5"
                                                           value={this.state.prefAgeMin}
                                                           onChange={this.onChange}/>
                                                </Col>
                                                <Col><input type="ageMin" className="form-control" id="prefAgeMin" name="prefAgeMin"
                                                            style={{width: "55px"}} onChange={this.onChange} placeholder={20}
                                                            value={this.state.prefAgeMin}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col><label>Max Age: </label></Col>
                                                <Col xs={6}>
                                                    <input type="range" className="custom-range" id="prefAgeMax" name="prefAgeMax"
                                                           min="0" max="100" step="5"
                                                           value={this.state.prefAgeMax}
                                                           onChange={this.onChange}/>
                                                </Col>
                                                <Col><input type="ageMax" className="form-control" id="prefAgeMax" name="prefAgeMax"
                                                            style={{width: "55px"}} onChange={this.onChange} placeholder={50}
                                                            value={this.state.prefAgeMax}/>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    {/* Preferred - Skill Level*/}
                                    <Row>
                                        <Col><label>Dancing experience level...</label> </Col>
                                        <Col>
                                            <div className="form-group">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    defaultValue={this.state.prefProficiencyLevel}
                                                    placeholder={"Proficiency levels..."}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    onChange={this.handleChange}
                                                    name="prefProficiencyLevel"
                                                    options={prefProficiencyLevels}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Preferred - Dance Style //TODO: Prefill fix: Event style! */}
                                    <Row>
                                        <Col><label>To dance...</label></Col>
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
                                                        onChange={this.handleChange}
                                                        name="danceCategory"
                                                        options={danceStyleCategory}
                                                    />
                                                    {
                                                        {
                                                            'latin':
                                                                <Select
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="select"
                                                                    onChange={this.handleChangeMSelect}
                                                                    defaultValue={''}
                                                                    value={danceStyle}
                                                                    isMulti={true}
                                                                    placeholder={"Dance style..."}
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    name="danceStyle"
                                                                    options={latin}
                                                                />,
                                                            'standard':
                                                                <Select
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="select"
                                                                    onChange={this.handleChangeMSelect}
                                                                    defaultValue={''}
                                                                    value={danceStyle}
                                                                    isMulti={true}
                                                                    placeholder={"Dance style..."}
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    name="danceStyle"
                                                                    options={standard}
                                                                />,
                                                            'various':
                                                                <Select
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="select"
                                                                    onChange={this.handleChangeMSelect}
                                                                    defaultValue={''}
                                                                    value={danceStyle}
                                                                    isMulti={true}
                                                                    placeholder={"Dance style..."}
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    name="danceStyle"
                                                                    options={various}
                                                                />

                                                        }[this.state.danceCategory]
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* City - Event
                    //TODO: If rquest only belong to one event: change text
                    //TODO: add event link and display them*/}
                                    <Row>
                                        <Col><label> In: </label></Col>
                                        <Col>{/*TODO: add event city*/}</Col>
                                    </Row>

                                    {/* Preferred - Events
                    //TODO: If rquest only belong to one event: change text
                    //TODO: add event link and display them*/}
                                    <Row>
                                        <Col> <label>The events I am interested in are: </label></Col>
                                    </Row>

                                    {/*Request - Description */}
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea type="description" className="form-control" id="description"
                                                          name="description" onChange={this.onChange}
                                                          placeholder="Personal text to add to the request"
                                                          value={this.description}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </Container>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCancel}> Cancel </Button>
                            <Button type="submit" variant="primary" onClick={this.submitRequest}> Place Request </Button>
                        </Modal.Footer>
                    </Modal>
                </div>





























            );}
            else{
                return <label>Loading data please wait </label>
            }

        } else { //when not logged in, show only how many requests are open and add a link to the login page

            return (
                <div className="container">
                    <h3>Create Request</h3>
                    <p> Please {<Link to={{pathname: 'login'}}>login</Link>},to create a request.</p>
                    {/* Alternative to link:
            <Button onClick={()=>{{this.props.history.push('/login')}}}>Login</Button>*/}
                </div>
            );
        }
    }
}

export default CreateRequest;