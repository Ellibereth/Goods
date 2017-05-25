var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';

export default class CardPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	deleteCardPress(){
		this.props.deleteCardPress(this.props.card)
	}

	setDefaultCard(){
		var data = {}
		data["jwt"] = localStorage.jwt
		data["card_id"] = this.props.card.id
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/setDefaultCard",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal("Sorry", "It seems there was an error setting a default credit card. " + data.error 
						+ ". Please try again", "warning")
				}
				else {
					// AppActions.addCurrentUser(data.user_info)
						swal({
							title: "Default card set",
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

	getDefaultButton(){
		if (this.props.card.id == AppStore.getCurrentUser().default_card) {
			return (
				<button className = "btn btn-default btn-sm" disable = {true}>
					Default card
				</button>
			)
		}
		else{
			return (
				<button className = "btn btn-default btn-sm" onClick = {this.setDefaultCard.bind(this)}>
					Set as default 
				</button>
			)

		} 
	}



	render() {
		var card = this.props.card
		var default_button = this.getDefaultButton.bind(this)()

		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 settings-preview-column grey-solid-border">
				<span className = "block-span"> {card.name} </span>
				<span className = "block-span">{card.brand} </span>
				<span className = "block-span"> Ending in {card.last4}  </span> 
				<span className = "block-span"> Exp. {card.exp_month} / {card.exp_year}  </span>
				<span className = "block-span"> <div className = "small-buffer"/> </span>
				<span className = "block-span"> 
					{default_button}
					<button style = {{"margin-left" : "8px"}} className = "btn btn-default btn-sm" onClick = {this.deleteCardPress.bind(this)}>
						Delete 
					</button>
				</span>
			</div>

		)
	}
}

