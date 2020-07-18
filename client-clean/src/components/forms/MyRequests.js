import React from "react";
import { CardDeck } from "react-bootstrap";
import PartnerRequestForm from "./PartnerRequestForm";
import moment from "moment";
import { CriticalAlert } from "../helpers/Alert";

class MyRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        requests: [],
    };
  }

  deleteRequest = (requestId) => {
    /*delete requests: takes the Id of the request that should be deleted and deletes it*/
    console.log(requestId);
    try{
            var component_scope = this;

            fetch("/profile/request/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: "Bearer " + window.sessionStorage.secret_token,
                },
                body: JSON.stringify({id: requestId})
            })
                .then((res) => res.json(res))
                .then((res) => {
                    // alert("Successfully deleted the request!");
                    console.log(res);
                    const requests = this.state.requests.filter(request => {
                        return request._id !== requestId
                    });
                    console.log(requests);
                    this.setState({ requests });
                })
                .catch((err) => alert(err));
        }catch(err){
            console.log(err);
        }

  };

    componentDidMount = () => {
        let requests = this.props.state.requests;
        this.setState({requests: requests});
        console.log(this.state.requests);
    }


  render() {
      const requests = this.props.state.requests;

    return (
      <div>
        {this.setState({requests: requests})}

        { this.state.requests.length ? (
                    <CardDeck>
                        {console.log(this.state.requests)}
                        {this.state.requests.map((request) => (
                                <PartnerRequestForm
                            request={request}
                            state={this.props.state}
                            profile={true}
                            deleteRequest={this.deleteRequest}
                          />
                        ))}
                    </CardDeck>
                ): (
                    <p className="text-center">At the moment you have no open requests.</p>
                )
          }



      </div>
    );
  }
}

export default MyRequests;
