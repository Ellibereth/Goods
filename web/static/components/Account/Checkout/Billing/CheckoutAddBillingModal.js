var React = require('react');
var ReactDOM = require('react-dom');
import CheckoutAddBilling from './CheckoutAddBilling.js'
import Modal from 'react-bootstrap/lib/Modal'

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
			<Modal.Title id="contained-modal-title-lg"> 
				<span> Add a payment method </span>
				<span className = "pull-right modal-header-right"> 
						<span className = "red-text"> * </span>
						<span className = "vcenter"> Required  </span>
				</span>
			</Modal.Title>
		</Modal.Header>
			<Modal.Body>
			<CheckoutAddBilling
				setLoading = {this.props.setLoading}
				selected_address = {this.props.selected_address}
				refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
				toggleModal = {this.props.toggleModal}
				onAddingNewBillingMethod = {this.props.onAddingNewBillingMethod}/>
			</Modal.Body>
		</Modal>
		);
	}	
}