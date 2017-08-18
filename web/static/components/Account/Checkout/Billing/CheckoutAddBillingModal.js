var React = require('react');
var ReactDOM = require('react-dom');
import CheckoutAddBilling from './CheckoutAddBilling.js'
import Modal from 'react-bootstrap/lib/Modal'
import {AlertMessages} from '../../../Misc/AlertMessages'
export default class CheckoutAddBillingModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
		}
	}
	onModalClosePress(){
	}
	componentDidMount(){
	}

	componentWillUnmount(){
	}

	render() {
		return (
			<Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
					<Modal.Title id="contained-modal-title-lg"> 
						<span> Add a payment method </span>
						<span className = "pull-right modal-header-right"> 
								<span className = "red-text centered-asterisk"> * </span>
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