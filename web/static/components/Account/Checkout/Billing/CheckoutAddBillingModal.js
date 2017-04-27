var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import CheckoutAddBilling from './CheckoutAddBilling.js'


export default class CheckoutAddBillingModal extends React.Component {
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
				this.props.toggleModal()
		}.bind(this))
	}


render() {
	return (
		<Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
		<Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
			<Modal.Title id="contained-modal-title-lg"> Add a payment method </Modal.Title>
		</Modal.Header>
			<Modal.Body>
			<CheckoutAddBilling
				selected_address = {this.props.selected_address}
				refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
				toggleModal = {this.props.toggleModal}
				onAddingNewBillingMethod = {this.props.onAddingNewBillingMethod}/>
			</Modal.Body>
		</Modal>
		);
	}	
}