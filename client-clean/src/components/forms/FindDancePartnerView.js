import React from "react";
import FilterRequest from "./FilterRequestForm";
import RequestForm from "./PartnerRequestForm";
import { Row, Col, Container} from 'react-bootstrap'



class DancePartner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // for testing
            dataDancer: [],
            //requests: [],
            ageOffset: 2,
            //real once
            // TODO: Dancer connection, Event Connection
            dancerId: {},//Dancer name and details needed
            eventList: [],
            requestDescription: null,
            ageOffset: null,
            prefGender: null,
            proficiencyLevel: [],
            city: null,
            date: null,//+timestamp of request?
            togglePopup: false,
            sorting: "date",
            requests: []
        };
    }

    componentDidMount() {
        /*The function call is in the buildup and loads all the requests*/
        //this.getDancer();
        this.getRequests();
    }

    // to get dancers preferences for later
    // for now: get all dancer from backend
    // return dancer data of the dancer to the log
     getDancer = () => {
        var secret_token = window.sessionStorage.secret_token;
        var component_scope = this; // this.setState didn't worked somehow thstd

        fetch('/dancepartner', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            }
        }).then(res => res.json(res)
        ).then(function(res){
            component_scope.setState({
                dataDancer: [...res]
            });
        }).catch(err => alert(err));

    }

    // get all requests from backend
     getRequests = () => {
        var secret_token = window.sessionStorage.secret_token;
        var component_scope = this; // because this.setState wasn't working somehow

        fetch('/dancepartner/request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            }
        }).then(res => res.json(res)
        ).then(function(res){
            component_scope.setState({
                requests: [...res]
            });
        }).catch(err => alert(err));

    }

    onChange = (e) => {
        e.preventDefault();
    }


    filterRequests = (requests) =>{

        this.setState({
            requests
        });
            console.log("filteres requests "+requests)
    }


    // display requests, filtered
    //TODO: make dependent on filter option
    //TODO: sort requests
    render(){

        /*const dancerProfile = this.state.data ? (
            <div className="dancer">
            <h4 className="center">{this.state.dataDancer.name}</h4>
            <p>{this.state.data.proficiencyLevel}</p>
            </div>
        ) : (
            <div className="center">No dancers found! </div>
        )

        {this.state.requests.filter(requests => requests.ageOffset > this.state.ageOffset)
                            .map(filteredRequests =>
                            <div className="collection-item" key={filteredRequests.id}>
                                <h4>{filteredRequests.listOfProficiencyLevels}</h4>
                                <p>{filteredRequests.description}</p>
                            </div>
                )}*/
        const sortSelect = ['date','age','height','skillLevel'];
        return(
            <Container fluid>
                <Row>
                    {/*Filter Sidebar*/}
                    <Col xs={2} id="side-wrapper">
                        <FilterRequest filterRequests={this.filterRequests} requests={this.state.requests}/>
                    </Col>
                    {/*RequestPart*/}
                    <Col >
                        {/*SortingNavbar*/}
                        <Row>
                            <div style={{marginLeft:"auto"}}>Sorted by:
                                <select className="form-control" name="sort" onChange={this.onChange}>
                                    <optgroup label="Descanding">
                                        {sortSelect.map(sortSelect=>( <option value={"descanding"+sortSelect}>{"Desc "+sortSelect.charAt(0).toUpperCase()+ sortSelect.slice(1)}</option>))}
                                    </optgroup>
                                    <optgroup label="Ascanding">
                                        {sortSelect.map(sortSelect=>( <option value={"ascanding"+sortSelect}>{"Asc "+sortSelect.charAt(0).toUpperCase()+ sortSelect.slice(1)}</option>))}
                                    </optgroup>
                                </select>
                            </div>
                        </Row>
                        {/*InsertRequests*/}
                        <Row>
                            <RequestForm requests={this.state.requests}/>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default DancePartner