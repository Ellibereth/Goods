var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import FeedbackForm from '../FeedbackForm/FeedbackForm.js'


export default class FeedbackModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_display: false
    }
  }

  onModalClosePress(){
      swal({
              title: "Are you sure?",
              text: "Closing this will delete all the information you have typed",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "No",
              cancelButtonText: "Close",
              closeOnConfirm: true,
              closeOnCancel: false
                },
                function () {
                    this.props.toggleRequestFormModal()
        }.bind(this))    
  }
  

  render() {
    // the page left and page right are place holders for better names
    // any advice before changing would be good
    // <PageLeft />
    // <PageRight/>
    return (
        <Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
            <Modal.Title id="contained-modal-title-lg"> Tell us your thoughts!</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <FeedbackForm toggleFeedbackModal = {this.props.toggleFeedbackModal} />
            </Modal.Body>
      </Modal>
    );
  }
}