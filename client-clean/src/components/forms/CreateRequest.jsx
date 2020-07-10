import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import Select from 'react-select';


class CreateRequest extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

            // old types
            age: null,

            events:[],
            description: "",

            // user profile information
            userImage: null,
            userName: null,
            userAge: null,
            height: null,
            userSkillLevel: null,
            userStyle: null, //TODO: Define if needed or interested in ?

            // Looking for information
            prefGender: null,
            prefAgeMin: 20,
            prefAgeMax: 50,
            danceCategory: null,
            danceSkills: null,

            // Event info
            danceStyle: null,
            event: null,

            userDescription: null

        };
    }

    onChange = (e) => {
        /*this function handles the change of the input fields*/
        e.preventDefault();

        var allow = true;
        if(e.target.name == "prefAgeMin"  ){
            if(e.target.value >= this.state.prefAgeMax){
                allow = false;
            }
        }
        if ( e.target.name == "prefAgeMax"){
            if(e.target.value <= this.state.prefAgeMin){
                allow = false;
            }
        }
        if(allow){
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
            listOfProficiencyLevels: this.state.danceSkills,
            counterfeitEmail: 'ludmann.julia@gmail.com',
            listOfDanceStyles: danceStyle,
            //events: this.state.events, // TODO: needs event link and populate in backend?
        };

        var secret_token = window.sessionStorage.secret_token;

        fetch('/createrequest',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            },
            body: JSON.stringify(newRequest)
        }).then(res=>res.json()).then(res=>{
            console.log("reset");
            if(res){ // TODO: change Reset and reload => make sure they are really cleared (not just in the state.. also visible for the user)
                this.setState({
                    age: null,
                    danceCategory: null,
                    danceStyle: [""],
                    danceSkills: null,
                    prefGender: null,
                    events:[],
                    description: ""
                });
            }
        })


    }









    render(){

        //gender
        const gender = [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
        ];

        // Skill level // TODO: define categories new
        const skillLevelNew = [
            { value: 'beginner', label: 'Beginner' },
            { value: 'bronze', label: 'Bronze' },
            { value: 'silver', label: 'Silver' },
            { value: 'gold', label: 'Gold' },
            { value: 'pre-tournament1', label: 'Pre-Tournament 1' },
            { value: 'pre-tournament2', label: 'Pre-Tournament 2' },
        ];

        // Dance Styles //TODO: add more various
        const danceStyleCategory = [
            { value: 'latin', label: 'Latin/Rythm' },
            { value: 'standard', label: 'Standard/Smooth' },
            { value: 'various', label: 'Various' },
        ];

        const latin = [
            { value: 'jive', label: 'Jive' },
            { value: 'rumba', label: 'Rumba' },
            { value: 'chaChaCha', label: 'Cha-Cha-Cha' },
            { value: 'samba', label: 'Samba' },
            { value: 'pasoDoble', label: 'Paso Doble' },
            { value: 'bolero', label: 'Bolero' },
            { value: 'mambo', label: 'Mambo' },
            { value: 'eastCostSwing', label: 'East Cost Swing' },
        ];
        const standard = [
            { value: 'waltz', label: 'Waltz' },
            { value: 'vienneseWaltz', label: 'Viennese Waltz' },
            { value: 'tango', label: 'Tango' },
            { value: 'foxtrot', label: 'Foxtrot' },
            { value: 'qickstep', label: 'Qickstep' },
        ];
        const various = [
            { value: 'salsa', label: 'Salsa' },
            { value: 'bachata', label: 'Bachata' },
            { value: 'westCostSwing', label: 'West Cost Swing' },
            { value: 'hustle', label: 'Hustle' },
        ];



        const danceStyle = this.state.danceStyle;

       // <Row>
        //{/*Filter Sidebar*/}
        // <Col xs={2} id="side-wrapper">



        return(


            <Container fluid>
                <form onSubmit={this.submitRequest}>

                    {/* User Information_______________________*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            {/* TODO: User Name */}
                        </Col>

                        <Col >
                            {/* TODO: User Image */}
                        </Col>
                    </Row>

                    {/* User - Age Information*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label>My age...</label>
                            </div>
                        </Col>

                        <Col>
                            {/* TODO: User Age Range */}
                        </Col>
                    </Row>

                    {/* User - Height Information*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="from-group">
                                <label>My height...</label>
                            </div>
                        </Col>

                        <Col xs={2} id="side-wrapper">
                            {/* TODO: User Height */}
                        </Col>
                    </Row>

                    {/* User - Skill Information*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label>My dancing experience...</label>
                            </div>
                        </Col>

                        <Col>
                            {/* TODO: User Skill Level */}
                        </Col>
                    </Row>

                    {/* User - Style Information*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="from-group">
                                <label>I usually enjoy to dance...</label>
                            </div>
                        </Col>

                        <Col xs={2} id="side-wrapper">
                            {/* TODO: User Preferred Styles */}
                        </Col>
                    </Row>



                    {/* Request Information_______________________*/}
                    {/* Request  search "headline"*/}
                    <Row>
                        <div className="form-group">
                            <label>I am looking for...</label>
                        </div>
                    </Row>
                    {/* Preferred - Gender */}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label> Gender... </label>
                            </div>
                        </Col>

                        <Col xs={4}>
                            {/*Gender Type // TODO: clear unspecified/ other how to name it*/}
                            <div className="form-group">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={this.state.prefGender}
                                    placeholder={"Preferred gender..."}
                                    isClearable={true}
                                    isSearchable={true}
                                    onChange={this.handleChange}
                                    name="gender"
                                    options={gender}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Preferred - Age Range*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label>Age range...</label>
                            </div>
                        </Col>

                        <Col xs={1}>

                            <div className="form-group">
                                <label>Min Age: </label>
                                <label>Max Age: </label>
                            </div>

                        </Col>

                        <Col xs={3}>
                            {/* TODO: Age Slider */}

                            {/*Age Type  // Old version
                            <div className="form-group">
                                <label htmlFor="age">Age Difference </label>
                                <input type="age" className="form-control" id="age" name="age" onChange={this.onChange} placeholder="Required" value={this.age}/>
                            </div>*/}
                            <div className="form-group">
                                <input type="range" className="custom-range" id="prefAgeMin" name="prefAgeMin"
                                       min="0" max="100" step="5"
                                       value={this.state.prefAgeMin}
                                       onChange={this.onChange} />
                                <input type="range" className="custom-range" id="prefAgeMax" name="prefAgeMax"
                                       min="0" max="100" step="5"
                                       value={this.state.prefAgeMax}
                                       onChange={this.onChange} />
                            </div>




                        </Col>



                        <Col >
                            <div className="form-group">
                                <input type="ageMin" className="form-control" id="prefAgeMin" name="prefAgeMin" style={{ width: "55px" }} onChange={this.onChange} placeholder="" value={this.state.prefAgeMin}/>
                                <input type="ageMax" className="form-control" id="prefAgeMin" name="prefAgeMin" style={{ width: "55px" }} onChange={this.onChange} placeholder="" value={this.state.prefAgeMax}/>
                            </div>
                        </Col>







                    </Row>

                    {/* Preferred - Skill Level*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label>Dancing experience level...</label>
                            </div>
                        </Col>

                        <Col xs={4}>
                            <div className="form-group">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={this.state.danceSkills}
                                    placeholder={"All skill levels..."}
                                    isClearable={true}
                                    isSearchable={true}
                                    onChange={this.handleChange}
                                    name="danceSkills"
                                    options={skillLevelNew}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Preferred - Dance Style //TODO: Prefill fix: Event style! */}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div>
                                <label>To dance...</label>
                            </div>
                        </Col>
                        <Col xs={4}>
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
                                                    isMulti = {true}
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
                                                    isMulti = {true}
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
                                                    isMulti= {true}
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
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label> In:  </label>
                            </div>
                        </Col>

                        <Col>
                            {/*TODO: add event city*/}
                        </Col>
                    </Row>

                    {/* Preferred - Events
                    //TODO: If rquest only belong to one event: change text
                    //TODO: add event link and display them*/}
                    <Row>
                        <Col xs={2} id="side-wrapper">
                            <div className="form-group">
                                <label>The events I am interested in are: </label>
                            </div>
                        </Col>

                        <Col>

                        </Col>
                    </Row>

                    {/*Request - Description */}
                    <Row>
                        <Col   xs={6}>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea type="description" className="form-control" id="description" name="description" onChange={this.onChange} placeholder="Personal text to add to the request" value={this.description}/>
                            </div>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <Row>

                        {/* Cancel Request  // TODO: create and add*/}
                        <Col  xs={4}>
                            <div className="form-group">

                            </div>
                        </Col >


                        {/* Place Request */}
                        <Col>
                            <div className="form-group">
                                <input
                                    type="submit"
                                    className="btn btn-outline-dark"
                                    value="Place Request"
                                />
                            </div>
                        </Col>

                    </Row>



                </form>
            </Container>


        );
    }
}

export default CreateRequest;