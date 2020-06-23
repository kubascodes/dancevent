import React from "react";
import {Card, CardDeck, Container} from 'react-bootstrap'

const RequestForm = ({requests}) => {

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
        <Modal.Title>Modal heading</Modal.Title>
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

    const requestList = requests.length ? (
        requests.map(request => {
            return(
                <Card style={{width:'18rem'}}>
                <Card.Body>
                <Card.Title> Request Title</Card.Title>
                <Card.Text>
                    {request.listOfProficiencyLevels}
                </Card.Text>
                </Card.Body>
                </Card>
            )
        })
    ) : (
        <p>There are no reqiests open...</p>
    );

    return(
        <CardDeck>
        {requestList}
        </CardDeck>
    )
}

export default RequestForm;