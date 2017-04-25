var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import {Button} from 'react-bootstrap'


export default class ManageAddressDisplay extends React.Component {
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
		console.log("bro")
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
			var data = {}
			data["jwt"] = localStorage.jwt
			data["account_id"] = AppStore.getCurrentUser().account_id
			data["address_id"] = this.props.address.id
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/deleteUserAddress",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error deleting your address! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						// AppActions.addCurrentUser(data.user_info)
						swal({
								title: "Thank you!", 
								text : "Your changes have been made",
								type: "success"
							})
						browserHistory.push(`/settings`)
					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	render() {
		// will be updating this to have a better display in the near future
		var address = this.props.address
		return (
			<div className = "row">
				<div>
					<p> Name : {address.name} </p>
					<p> Address : {address.address_line1} </p>
					<p> City : {address.address_city} </p>
					<p> Zip : {address.address_zip} </p>
				</div>	
				<Button onClick = {this.editAddress.bind(this)}> Edit </Button>
				<Button onClick = {this.onDeletePress.bind(this)}> Delete </Button>
			</div>
		)
	}
}

