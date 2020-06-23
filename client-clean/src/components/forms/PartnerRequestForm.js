import React from "react";
import {Card, CardGroup, Button} from 'react-bootstrap'

const RequestForm = ({requests}) => {

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

    const requestList = requests.length ? (
        requests.map(request => {
            return(
                <CardGroup>
                <Card>
                <Card.Body>
                <Card.Title> Request Title</Card.Title>
                <Card.Text>
                    {request.description}
                </Card.Text>
                </Card.Body>
                </Card>
                </CardGroup>
            )
        })
    ) : (
        <p>There are no reqiests open...</p>
    );

    return(
        <div>
        {requestList}
        </div>
    )
}

export default RequestForm;