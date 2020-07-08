import React from "react";
import {Container} from "react-bootstrap";
import Select from 'react-select';

class CreateRequest extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            age: null,
            height: null,
            danceCategory: null,
            danceStyle: null,
            danceSkills: null,
            prefGender: null,
            events:[],
            description: ""
        };
    }

    onChange = (e) => {
        /*this function handles the change of the input fields*/
        e.preventDefault();
        this.setState({
           [e.target.name]: e.target.value
        });
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
        //const danceStyle = this.state.danceStyle ? {this.state.danceStyle.map(style => style.value).concat(this.state.danceCategory) }: {this.state.danceCategory} ;
        // TODO: change
        const danceStyle = this.state.danceCategory;

        // create request body
        //TODO: dancerId and counterfeitEmail at the moment hard coded!!!
        var newRequest = {
            //dancerId: '5ee8c5671d6b0d0a9646ad3d',
            description: this.state.description,
            ageOffset: this.state.age,
            listofGenders: this.state.prefGender,
            listOfProficiencyLevels: this.state.danceSkills,
            counterfeitEmail: 'ludmann.julia@gmail.com',
            listOfDanceStyles: danceStyle,
            //not in the request body (part of the dancer body)
            //height: this.state.height,
            //danceStyle: this.state.danceStyle,
            //events: this.state.events,
        };
        console.log(newRequest);

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
            if(res){ // reset the states
                this.setState({
                    age: null,
                    //height: null,
                    danceCategory: null,
                    danceStyle: [""],
                    danceSkills: null,
                    prefGender: null,
                    events:[],
                    description: ""
                });
            }
            console.log(this.state);
        })


    }

    render(){

        //gender
        const gender = [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
        ];

        // Skill level
        const skillLevelNew = [
            { value: 'beginner', label: 'Beginner' },
            { value: 'bronze', label: 'Bronze' },
            { value: 'silver', label: 'Silver' },
            { value: 'gold', label: 'Gold' },
            { value: 'pre-tournament1', label: 'Pre-Tournament 1' },
            { value: 'pre-tournament2', label: 'Pre-Tournament 2' },
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
        return(
            <Container>
                <form onSubmit={this.submitRequest}>
                    <div>
                        <h4 htmlFor="test">Create Request</h4>
                    </div>

                    {/*Age Type*/}
                    <div className="form-group">
                        <label htmlFor="age">Age Difference </label>
                        <input type="age" className="form-control" id="age" name="age" onChange={this.onChange} placeholder="Required" value={this.age}/>
                    </div>

                    {/*Height Type
                    <div className="form-group">
                        <label htmlFor="height">Height</label>
                        <input type="height" className="form-control" id="height" name="height" onChange={this.onChange} placeholder="Required" value={this.height}/>
                    </div>*/}

                    {/*Gender Type // TODO: clear unspecified*/}
                    <div className="form-group">
                        <label> I am looking for a... </label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={this.state.prefGender}
                            placeholder={"Prefered gender..."}
                            isClearable={true}
                            isSearchable={true}
                            onChange={this.handleChange}
                            name="gender"
                            options={gender}
                        />
                    </div>

                    {/*Skill-Level Type */}
                    <div className="form-group">
                        <label> Who is a... </label>
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

                    {/*Events Type*/}
                    {/*<div className="form-group">
                        <label htmlFor="events">Events</label>
                        <input type="events" className="form-control" id="events" name="events" onChange={this.onChange} placeholder="Required" value={this.events}/>
                    </div>*/}

                    {/*Description Type*/}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input type="description" className="form-control" id="description" name="description" onChange={this.onChange} placeholder="Required" value={this.description}/>
                    </div>

                    <div className="form-group">
                        <input
                            type="submit"
                            className="btn btn-outline-dark"
                            value="Place Request"
                        />
                    </div>
                </form>
            </Container>

        );
    }
}

export default CreateRequest;