var React = require('react')
var ReactDOM = require('react-dom')
import AddProductForm from './AddProductForm'
import Modal from 'react-bootstrap/lib/Modal'
import {AlertMessages} from '../../../Misc/AlertMessages'
export default class AddProductModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	onModalClosePress(){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
			function () {
				this.props.toggleAddProductModal()
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
					<Modal.Title id="contained-modal-title-lg"> Tell us your thoughts!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AddProductForm loadProducts = {this.props.loadProducts} toggleAddProductModal = {this.props.toggleAddProductModal} />
				</Modal.Body>
			</Modal>
		)
	}
}