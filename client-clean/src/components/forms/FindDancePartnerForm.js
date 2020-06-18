import React from "react";

class DancePartner extends React.Component {

    state = {
        data: []
    }

    // to get dancers preferences for later
    // for now: get all dancer from backend
    // return dancer data of the dancer to the log
     getDancer(){
        let secret_token = window.sessionStorage.secret_token;

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

            this.setState({
                data: [...res]
            });
        })
           /* .then((resp) => {
            //TODO: check authorization
            let resp: resp
            console.log("Try to Access Dancer");
            console.log({resp.map( resp => {

                    }

                )} + "response")
            if(resp.error) {
                alert(resp.err)
                console.log("Response Error");
            }
            else {
                let data = resp.json()
                this.setState(
                    {
                        data: [...data]
                    }

                )
                console.log({resp} + "response")
            }
        })*/.catch(err => alert(err));

    }

    componentDidMount() {
        this.getDancer()
    }

    render(){
        return(
            <div className="form-group">
                <label htmlFor="name">Dancer</label>
            </div>
        )
    }
}

export default DancePartner