var React = require('react');
var ReactDOM = require('react-dom');
import {Modal, Button} from 'react-bootstrap';
import CheckoutAddAddress from './CheckoutAddAddress.js'


export default class CheckoutAddAddressModal extends React.Component {
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
	// the page left and page right are place holders for better names
	// any advice before changing would be good
	// <PageLeft />
	// <PageRight/>
	return (
		<Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
		<Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
			<Modal.Title id="contained-modal-title-lg">
				<span> Add an address  </span>
				<span className = "pull-right modal-header-right"> 
					<span className = "red-text"> * </span>
					<span className = "vcenter"> Required  </span>
				</span>
			</Modal.Title>

		</Modal.Header>
			<Modal.Body>
					<CheckoutAddAddress
						refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
						toggleModal = {this.props.toggleModal}
						onAddingNewShippingAddress = {this.props.onAddingNewShippingAddress}/>
			</Modal.Body>
		</Modal>
		);
	}	
}