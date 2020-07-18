import React from "react";
import { CardDeck } from "react-bootstrap";
import PartnerRequestForm from "./PartnerRequestForm";

class MyRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteRequest = (requestId) => {
    /*delete requests: takes the Id of the request that should be deleted and deletes it*/
    console.log(requestId);
    try{
            fetch("/profile/request/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: "Bearer " + window.sessionStorage.secret_token,
                },
                body: JSON.stringify({id: requestId})
            })
                .then((res) => res.json(res))
                .catch((err) => alert(err));
        }catch(err){
            console.log(err);
        }
    //TODO: reload requests?
  };

  render() {
    return (
      <div>



                <CardDeck>
                    {console.log(this.props.state.requests)}
                    {this.props.state.requests.map((request) => (
                            <PartnerRequestForm
                        request={request}
                        state={this.props.state}
                        profile={true}
                        deleteRequest={this.deleteRequest}
                      />
                    ))}
                </CardDeck>



      </div>
    );
  }
}

export default MyRequests;
