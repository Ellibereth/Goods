var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';

export default class AddressPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	// will do this with a modal
	editAddress(){
		this.props.toggleModal(this.props.address)
	}

	onDeletePress(){
		var address = this.props.address
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to delete : " + address.address_line1 + "?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.deleteAddress.bind(this)()
		}.bind(this))
	}

	// shows a preview of the address 
	// then asks the user if they want to delete it
	deleteAddress(){
		this.props.deleteAddress(this.props.address)
	}



	render() {
		var address = this.props.address

		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 text-center settings-preview-column">
				<span className = "block-span"> {address.name} </span>
				<span className = "block-span">{address.address_line1}  </span>
				{address.address_line2 && <span className = "block-span"> {address.address_line2}  </span> }
				<span className = "block-span"> 
					{address.address_city}, {address.address_state} {address.address_zip}
				</span>
				<span className = "block-span">
					<button id = "edit-address-button" className = "btn btn-default btn-sm" onClick = {this.editAddress.bind(this)}>
						Edit
					</button>
					<button className = "btn btn-default btn-sm " onClick = {this.onDeletePress.bind(this)}>
						Delete
					</button>
				</span>
			</div>
		)
	}
}

