var React = require('react')
var ReactDOM = require('react-dom')
import EditAddressForm from './EditAddressForm.js'
import {Modal} from 'react-bootstrap'
import {AlertMessages} from '../../../Misc/AlertMessages'

export default class EditAddressModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
		}
	}
	onModalClosePress(){
		this.props.toggleModal(null)
	}


	render() {
		return (
			<Modal show = {this.props.show} bsSize="large" aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton onClick = {this.onModalClosePress.bind(this)}>
					<Modal.Title id="contained-modal-title-lg"> 
						<span> Edit Address  </span> 
						<span className = "pull-right modal-header-right"> 
							<span className = "red-text"> * </span>
							<span className = "vcenter"> Required  </span>
						</span>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<EditAddressForm
						setFadingText = {this.props.setFadingText}
						setLoading = {this.props.setLoading}
						refreshSettings = {this.props.refreshSettings}
						address = {this.props.address} 
						toggleModal = {this.props.toggleModal}/>
				</Modal.Body>
			</Modal>
		)
	}	
}