var React = require('react')
import CheckoutAddAddress from './CheckoutAddAddress.js'
import Modal from 'react-bootstrap/lib/Modal'

export default class CheckoutAddAddressModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
		}
	}
	onModalClosePress(){
		this.props.toggleModal()
	}

	render() {
		
		return (
			<Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
					<Modal.Title id="contained-modal-title-lg">
						<span> Add an address  </span>
						<span className = "pull-right modal-header-right"> 
							<span className = "red-text centered-asterisk"> * </span>
							<span className = "vcenter"> Required  </span>
						</span>
					</Modal.Title>

				</Modal.Header>
				<Modal.Body>
					<CheckoutAddAddress
						setLoading = {this.props.setLoading}
						refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
						toggleModal = {this.props.toggleModal}
						onAddingNewShippingAddress = {this.props.onAddingNewShippingAddress}/>
				</Modal.Body>
			</Modal>
		)
	}	
}