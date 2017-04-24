var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import {Button} from 'react-bootstrap'

export default class ManageCardDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	

	// will do this with a modal
	editCard(){
		this.props.toggleModal(this.props.card)
	}

	onDeletePress(){
		var card = this.props.card
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to delete card ending in " + card.last4 + "?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.deleteCard.bind(this)()
		}.bind(this))
	}

	// shows a preview of the address 
	// then asks the user if they want to delete it
	deleteCard(){
			var data = {}
			data["jwt"] = localStorage.jwt
			data["account_id"] = AppStore.getCurrentUser().account_id
			data["stripe_card_id"] = this.props.card.id
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/deleteUserCreditCard",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error deleting your credit card! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						// AppActions.addCurrentUser(data.user_info)
						swal({
								title: "Thank you!", 
								text : "Your changes have been made",
								type: "success"
							})
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
		var card = this.props.card
		return (
			<div className = "row">
				<p> Card ending in : {card.last4} </p>
				{/* <Button onClick = {this.editCard.bind(this)}> Edit </Button> */}
				<Button onClick = {this.onDeletePress.bind(this)}> Delete </Button>
			</div>	
		)
	}
}

