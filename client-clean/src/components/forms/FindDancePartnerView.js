import React from "react";
import FilterRequest from "./FilterRequestForm";
import RequestForm from "./PartnerRequestForm";
import { Form , Row, Col} from 'react-bootstrap'



class DancePartner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDancer: [],
            requests: [],
            ageOffset: 2
        }
    }

    // to get dancers preferences for later
    // for now: get all dancer from backend
    // return dancer data of the dancer to the log
     getDancer = () => {
        var secret_token = window.sessionStorage.secret_token;
        var component_scope = this;

        fetch('/dancepartner', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            }
        }).then(res => res.json(res)
        ).then(function(res){
            console.log("Logging Response");
            console.log(res);
            component_scope.setState({
                dataDancer: [...res]
            });
        }).catch(err => alert(err));

    }

    // get all requests from backend
     getRequests = () => {
        var secret_token = window.sessionStorage.secret_token;
        var component_scope = this;

        fetch('/dancepartner/request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + secret_token
            }
        }).then(res => res.json(res)
        ).then(function(res){
            console.log("Logging Response");
            console.log(res);
            component_scope.setState({
                requests: [...res]
            });
        }).catch(err => alert(err));

    }

    componentDidMount() {
        this.getDancer();
        this.getRequests();
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

        return(
            <Form>
            <Row>
            <Col>
                <FilterRequest/>
            </Col>
            <Col>
                <RequestForm requests={this.state.requests}/>
            </Col>
            </Row>
            </Form>
        )
    }
}

export default DancePartner