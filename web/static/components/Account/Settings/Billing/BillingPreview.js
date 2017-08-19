var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import CardPreview from './CardPreview'
import AddCardButton from './AddCardButton'
import {AlertMessages} from '../../../Misc/AlertMessages'
import FadingText from '../../../Misc/FadingText'

export default class BillingPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_fading_text : false,
			fading_text : ""
		}
		this.setFadingText = this.setFadingText.bind(this)
	}

	setFadingText(fading_text) {
		console.log(fading_text)
		this.setState({
			fading_text : fading_text,
			show_fading_text : true
		})
		setTimeout(function(){
			this.setState({
				show_fading_text : false
			})
		}.bind(this), 4000)
	}
	deleteCardPress(card){
		this.deleteCard.bind(this)(card)
	}

	// shows a preview of the address 
	// then asks the user if they want to delete it
	deleteCard(card){
		this.props.setLoading(true)
		var data = {}
		data["jwt"] = localStorage.jwt
		data["stripe_card_id"] = card.id
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/deleteUserCreditCard",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					this.setFadingText(data.error.title)
				}
				else {
						this.props.refreshSettings()
						this.setFadingText("Card succesfully deleted")
					}
					this.props.setLoading(false)
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'deleteUserCreditCard',
					eventLabel: AppStore.getCurrentUser().email
				});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		var cards = this.props.cards
		var card_columns = []
		var current_user = AppStore.getCurrentUser()

		cards.map((card,index) => {
			if (card.id == current_user.default_card){
				card_columns.unshift(
					<CardPreview
					setFadingText = {this.setFadingText.bind(this)}
					setLoading = {this.props.setLoading}
					 card = {card}
					 deleteCardPress = {this.deleteCardPress.bind(this)}
					 refreshSettings = {this.props.refreshSettings}/>
				)
			}
			else {
				card_columns.push(
					<CardPreview
					setFadingText = {this.setFadingText.bind(this)}
					setLoading = {this.props.setLoading}
					 card = {card}
					 deleteCardPress = {this.deleteCardPress.bind(this)}
					 refreshSettings = {this.props.refreshSettings}/>
				)
			}
				
		})

		
	

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
						<div className = "account-page-text"> Payment Methods </div>
						<FadingText show = {this.state.show_fading_text} height_transition = {true}>
							<span style = {{"fontSize" : "16px"}} className = " alert-error-text ">{this.state.fading_text}</span>
						</FadingText>
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

