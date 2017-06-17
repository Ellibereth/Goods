var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {AlertMessages} from '../../../Misc/AlertMessages'

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
		this.props.setLoading(true)
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
					swal(data.error.title, data.error.text , data.error.type)
				}
				else {
						swal(AlertMessages.DEFAULT_CARD_SET_SUCCESS)
						this.props.refreshSettings()
					}
				this.props.setLoading(false)
			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'setDefaultCard',
						eventLabel: AppStore.getCurrentUser().email
					});
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
				<span className = "account-page-text block-span"> {card.name} </span>
				<span className = "account-page-text block-span">{card.brand} </span>
				<span className = "account-page-text block-span"> Ending in {card.last4}  </span> 
				<span className = "account-page-text block-span"> Exp. {card.exp_month} / {card.exp_year}  </span>
				<span className = "account-page-text block-span"> <div className = "small-buffer"/> </span>
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

