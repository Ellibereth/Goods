var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import ProductRequestForm from '../ProductRequestForm/ProductRequestForm.js'


export default class RequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_display: false
    }
  }

  toggleRequestFormModal() {
    this.setState({modal_display : !this.state.modal_display})
  }



  render() {
    // the page left and page right are place holders for better names
    // any advice before changing would be good
    // <PageLeft />
    // <PageRight/>
    return (
        <Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton onClick = {this.props.toggleRequestFormModal}>
            <Modal.Title id="contained-modal-title-lg"> Request a Product!</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <ProductRequestForm />
            </Modal.Body>
      </Modal>
    );
  }
}