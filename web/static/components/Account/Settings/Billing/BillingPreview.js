var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import CardPreview from './CardPreview'
import AddCardButton from './AddCardButton'


export default class BillingPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	deleteCardPress(card){
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
			this.deleteCard.bind(this)(card)
		}.bind(this))
	}

	// shows a preview of the address 
	// then asks the user if they want to delete it
	deleteCard(card){
			var data = {}
			data["jwt"] = localStorage.jwt
			data["account_id"] = AppStore.getCurrentUser().account_id
			data["stripe_card_id"] = card.id
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
							this.props.refreshSettings()
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
		var cards = this.props.cards
		var card_columns = cards.map((card,index) => 
				<CardPreview
					 card = {card}
					 deleteCardPress = {this.deleteCardPress.bind(this)}
				/>
			)

				var current_user = AppStore.getCurrentUser()
	

		card_columns.unshift(
				<AddCardButton />
			)

		

		var card_rows = []

		var col_per_row = 3;


		var num_rows = Math.floor((card_columns.length - 1) / col_per_row + 1)
		for (var i = 0; i < num_rows; i++){
			var this_row = []
			for (var j = i * col_per_row; j < (i + 1) * col_per_row; j++){
				if (j < card_columns.length){
					this_row.push(card_columns[j])	
				}
				else {
					this_row.push(
						<div className = "col-sm-4 col-md-4 col-lg-4 settings-preview-column no-border"/>
					)
				}
				
			}
			card_rows.push(
				<div className = "row row-eq-height settings-preview-row">
					{this_row}
				</div>
			)
		}

		return (
			<div className = "container-fluid">
					
				<div className="panel panel-default">
					<div className = "panel-heading">
						<div> Payment Methods </div>
					</div>
					<div className="panel-body">
						<div className = "container-fluid">
							{card_rows}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

