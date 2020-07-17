import React from 'react';
import {Toast, Alert, Modal, Button} from 'react-bootstrap'

/* Display Alert Popup
props:
-show boolean
-onHide function to close
-test String, errormessage

*/
const CriticalAlert = (props) => {
    return (


        <Modal show={props.show} onHide={props.change}>
            <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert  variant='danger'>
                {props.text}
            </Alert>
            </Modal.Body>
        </Modal>
        /*<Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert  variant='danger'>
                This is a  alert—check it out!
            </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.change}>
            Close
          </Button>
        </Modal.Footer> */
      
    )
}

const SuccessPopup = (props) => {
    return (

        <Toast autohide show={props.show} onClose={props.change}>
          <Toast.Header>
            <strong className="mr-auto"></strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>
            <Alert  variant='success'>
                {props.text}
            </Alert>
            </Toast.Body>
        </Toast>
    )
}


export {CriticalAlert, SuccessPopup}

    
    

