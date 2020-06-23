import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'



class FilterRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            city: "munich",
            gender:"",
            skillLevel:"",
            prefEventDate:"",
            eventType:"",
            danceStyle:""
            };
    }

    //TODO: write Submit
    //TODO: handle city
    //TODO: check filter => return filtered array
    //TODO: handle reset all
    submitFilter = (e) =>{
        /*This function is called if the user enters a city and presses enter*/
        e.preventDefault();
        const filterRequests = this.props.requests.filter(request =>{
            return request

    })
        this.props.filterRequests(this.state); //TODO: change

        console.log("Submit value: "+e.target.value);
        console.log("submit name: "+e.target.name);
    }

    //TODO: add onChange of the Filter
    onChange = (e) => {
        /*This function is called if the user changes a variable of the filter options*/
        e.preventDefault();
        /*this.setState({
            [e.target.name]: e.target.value
        })*/
        console.log("Change value: "+e.target.value);
        console.log("Change name: "+e.target.name);
        console.log(this.state);
    }

    render(){

        const eventType=['all-Event-Types','ball', 'competition', 'course', 'party'];
        const latinStyles = ['latin','cha-cha-cha','samba','jive','pasodoble','boldero','rumba','mambo','east-Coast-Swing'];
        const standardStyles=['standard','waltz','viennese-Waltz','tango','foxtrot','quickstep','hustle','west-Coast-Swing','salsa','bachata'];
        const skillLevel = ['beginner', 'bronze', 'silver', 'gold', 'pre-tournament 1', 'pre-tournament 2'];

        return(

            <form onSubmit={this.submitFilter}>
            <h4>Filter Requests</h4>

            {/*Gender Type - TODO: rethink place and importance of this filter option*/}
            <div className="form-group">
                <label> I am looking for a... </label>

                <select className="form-control" name="gendertype" onChange={this.onChange}>
                    {/*TODO: option unspecified = all Types?*/}
                    <option value="unspecified">Unspecified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            {/*Skill-Level Type */}
            <div className="form-group">
                <label> Who is a... </label>

                <select className="form-control" name="skillLevel" onChange={this.onChange}>
                    {skillLevel.map((skillLevel)=>(<option value={skillLevel}>{skillLevel.charAt(0).toUpperCase()+ skillLevel.slice(1)}</option>))}
                </select>
            </div>

            {/*City Type*/}
            <div>
                <label>In...</label>
                <input type="text" className="form-control" id="city" placeholder="Munich" name="city" onChange={this.onChangeInput} value={this.city}/>
            </div>

            {/* prefEventDate Type */}
            <div className="form-group">
                    <label> On... </label>

                <select className="form-control" name="prefEventDate" onChange={this.onChange}>
                    <option value="all">All-Upcomming-Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="weekend">Weekend</option>
                    <optgroup label="Specific Weekday">
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                    </optgroup>
                </select>
            </div>

            {/* prefDanceStyle Type */}
            <div className="form-group">
                <label> To dance... </label>

                <select className="form-control" name="prefDanceStyleDate" onChange={this.onChange}>
                    <option value="various">Various</option>

                    <optgroup label="Latin">
                        {latinStyles.map((danceStyle)=>(<option value={danceStyle}>{danceStyle.charAt(0).toUpperCase()+ danceStyle.slice(1)}</option>))}
                    </optgroup>
                    <optgroup label="Standard">
                        {standardStyles.map((danceStyle)=>(<option value={danceStyle}>{danceStyle.charAt(0).toUpperCase()+ danceStyle.slice(1)}</option>))}
                    </optgroup>
                </select>
            </div>

            {/* Event Type */}
            <div className="form-group">

                <label>At a...</label>

                <select className="form-control" name="prefDanceStyleDate" onChange={this.onChange}>
                    {eventType.map((eventType)=>(<option value={eventType}>{eventType.charAt(0).toUpperCase() + eventType.slice(1)}</option>))}
                </select>
            </div>
        </form>
        )
    }
}
export default FilterRequest
