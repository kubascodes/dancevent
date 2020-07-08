import React from "react";
import {Button, Card, CardDeck, Container} from "react-bootstrap";

const RequestForm = ({ requests , deleteRequest}) => {
  //TODO: Add Popup of request - with modal?
  /*   handleCardClick = () => {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        return (
            <>
            <Button variant="primary" onClick={handleShow}>
            Launch demo modal
            </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
            Contact
        </Button>
        </Modal.Footer>
        </Modal>
        </>
    );*
        return "hello"
    }*/

  //Needed down, but not working otherwise for now
  /*<Card style={{width:'18rem'}}>
                //<Card.Img variant="top" src={request.dancer.picture} alt={defaultPicture} style={{objectFit:'cover',width:"286px",height:"180px"}}/> //TODO: not implemented yet - add default picture - add dancer link - add dancer picture - rework style
                <Card.Body>
                //<Card.Title> {request.dancer.name}</Card.Title> //TODO: add dancer link/ data
                <Card.Title> Request Title</Card.Title>
                <Card.Text>
                    {request.listOfProficiencyLevels}
                    //TODO: add modal link here
                </Card.Text>
                </Card.Body>
                </Card>*/


    //const [show, setShow] = useState(false);

    //const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    /*function RequestDetailsPopup(request) {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{request.dancerId.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>{request.description}</label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }*/


   const requestList = requests.length ? (
    requests.map((request) => {
        var dancer = request.dancerId;
        if(dancer) {
            dancer = dancer.name;
        }
        else {
            dancer = "Title";
        }


        return (
        <div className="form-group" key={request._id} >
            <Card style={{ width: "25rem" }} className="md-block-centered">
              <Card.Body>
                <Card.Title> {dancer} </Card.Title>
                <Card.Text>{request.listOfProficiencyLevels}</Card.Text>
                <Card.Text>{request.description}</Card.Text>
                  {/*For testing and now detele button there.. TODO: make deletion somewhere else*/}
                <Button id="deleteRequest" onClick={()=>{deleteRequest(request._id)}}>Delete Request</Button>
              </Card.Body>
            </Card>
        </div>


      );
    })
  ) : (
    <p>There are no requests open...</p>
  );

  return <CardDeck>{requestList}</CardDeck>;
};

export default RequestForm;
