import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'



class FilterRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gender: ["male","female"],
            requests: [],
            ageOffset: 2
        }
    }
//<Dropdown.Toggle variant="success" id="dropdown-basic">
    //</Dropdown.Toggle>
/*<Dropdown>
<Dropdown.Menu>
{
    this.state.gender.map( gender =>
<Dropdown.Item>{gender}</Dropdown.Item>
)
}
</Dropdown.Menu>
</Dropdown>
<select>
{ this.state.gender.map( gender =>
        <option>{gender}</option>
)}
</select>

{this.state.gender.map( gender => <Dropdown.Item>{gender}</Dropdown.Item>)}*/



    render(){

        return(

            <form>

            <h4>Filter</h4>

            <div className="filter-option">
            <p> I am looking for a... </p>
            <Dropdown title="select gender" list={this.state.gender}/>

            </div>
            </form>
        )
    }

}
export default FilterRequest
