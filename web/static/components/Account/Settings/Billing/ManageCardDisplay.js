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
						window.location = `/settings`
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
		console.log(card)
		return (	
				<div className = "panel panel-default container-fluid">
					<div className = "panel-heading row">
						<div className=  "col-md-3 col-lg-3">
							<span> Your card </span>
						</div>
						<div className=  "col-md-2 col-lg-2">
							<span> Expiry </span>
						</div>
						<div className=  "col-md-3 col-lg-3">
							<span> Address </span>
						</div>

						<div className=  "col-md-2 col-lg-2">
							<span> Delete? </span>
						</div>
					</div>
					<div className = "panel-body row">
						<div className=  "col-md-3 col-lg-3">
							<span className = "block-span"> {card.brand} ending in {card.last4} </span>
							<span className = "block-span"> {card.name} </span>
						</div>

						<div className=  "col-md-2 col-lg-2">
							<span> {card.exp_month} / {card.exp_year} </span>
						</div>

						<div className=  "col-md-3 col-lg-3">
							<span className = "block-span"> {card.address_line1}</span>
							<span className = "block-span"> {card.address_line2} </span>
							<span className = "block-span"> {card.address_city}, {card.address_zip} </span>
						</div>

						<div className=  "col-md-2 col-lg-2">
							<Button onClick = {this.onDeletePress.bind(this)}> Delete </Button>
						</div>
					</div>	
				</div>
		)
	}
}

