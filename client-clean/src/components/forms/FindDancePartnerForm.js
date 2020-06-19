import React from "react";


class DancePartner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            prefgender: "female"
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
               data: [...res]
            });
        }).catch(err => alert(err));

    }

    componentDidMount() {
        this.getDancer()
    }

    render(){

        const dancerProfile = this.state.data ? (
            <div className="dancer">
            <h4 className="center">{this.state.data.name}</h4>
            <p>{this.state.data.proficiencyLevel}</p>
            </div>
        ) : (
            <div className="center">No dancers found! </div>
        )

        return(
            <div>
                    {this.state.data.filter(data => data.gender == this.state.prefgender).map(filteredData =>
                            <form>
                            <div className="collection-item" key={filteredData.id}>
                        <h4 >{filteredData.name}</h4>
                        <p>{filteredData.yearOfBirth}</p>
                        </div>
                        </form>
                    )}

            </div>
        )
    }
}

export default DancePartner