var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import ProductRequestForm from '../ProductRequestForm/ProductRequestForm.js'


export default class RequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  onModalClosePress(){
        swal({
              title: "Are you sure?",
              text: "Closing this will delete all the information you have typed",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Close",
              cancelButtonText: "No",
              closeOnConfirm: true,
              closeOnCancel: true
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
            <Modal.Title id="contained-modal-title-lg"> Request a Product!</Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <ProductRequestForm toggleRequestFormModal = {this.props.toggleRequestFormModal}/>
            </Modal.Body>
      </Modal>
    );
  }
}