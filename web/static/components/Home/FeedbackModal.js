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

  render() {
    // the page left and page right are place holders for better names
    // any advice before changing would be good
    // <PageLeft />
    // <PageRight/>
    return (
        <Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton onClick = {this.props.toggleFeedbackModal}>
            <Modal.Title id="contained-modal-title-lg"> Tell us your thoughts!</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <FeedbackForm />
            </Modal.Body>
      </Modal>
    );
  }
}