var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import EditAddressForm from './EditAddressForm.js'


export default class EditAddressModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
		}
	}
	onModalClosePress(){
		swal({
			title: "Are you sure?",
			text: "Typed information will not be saved",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Close",
			cancelButtonText: "No",
			closeOnConfirm: true,
			closeOnCancel: true
			},
			function () {
				this.props.toggleModal(null)
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
			<Modal.Title id="contained-modal-title-lg"> Edit Address </Modal.Title>
		</Modal.Header>
			<Modal.Body>
				<EditAddressForm
				refreshSettings = {this.props.refreshSettings}
				 address = {this.props.address} toggleModal = {this.props.toggleModal}/>
			</Modal.Body>
		</Modal>
		);
	}	
}