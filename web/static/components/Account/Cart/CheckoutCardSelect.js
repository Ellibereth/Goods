var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

export default class CheckoutCardSelect extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selected_card : 0
		}
	}

	setCard(){
		this.props.setCard(this.props.cards[this.state.selected_card])
		this.props.closeEditable()
	}

	onCardChange(index){
		this.setState({selected_address : index})
	}


	getCardInput(card, index){
		return (
			<div className = "row">
				<hr/>
				<div className = "top-buffer"/>
				<div className = "col-md-1 col-xs-1 col-sm-1 col-lg-1 hcenter vcenter">
					<input onClick = {this.onCardChange.bind(this, index)} 
					type="radio" value= {index} name = "card"/>
				</div>
				<div className = "col-md-4 col-xs-4 col-sm-4 col-lg-4 hcenter vcenter">
					 
					<b> {card.brand} </b> ending in {card.last4} 
				</div>
				<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3 hcenter vcenter">
					{card.name}
				</div>
				<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3 hcenter vcenter">
					{card.exp_month}/{card.exp_year}
				</div>
				<div className = "top-buffer"/>
			</div>
		)
	}

	render() {
		var cards = this.props.cards
		var card_display = cards.map((card, index) => 
				this.getCardInput(card, index)
			)

		var card = this.props.card

		return (
			<div>
				{this.props.can_edit ?
					<div>
						<div className = "row">
							<div className = "col-md-5 col-xs-5 col-sm-5 col-lg-5 checkout-item-label-editable vcenter">
								<b> 2. Select a payment method </b>
							</div>
							<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3 hcenter vcenter">
								Name on Card
							</div>
							<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3 hcenter vcenter">
								Expiration Date
							</div>
						</div>
						<form>
							{card_display}	
						</form>
						<div className = "row">
							<Button onClick = {this.setCard.bind(this)}>
								Use this card
							</Button>
						</div>
					</div>
				:
					<div>
						<div className = "row">
							<div className = "col-md-5 col-lg-5 col-sm-5">
								<b> 2. Payment Information </b>
							</div>
							<div className = "col-md-6 col-lg-6 col-sm-6">
								<span className = "span-block"> <b> {card.brand} </b> ending in {card.last4}  </span>
							</div>
							<div className = "col-md-1 col-sm-1 col-lg-1">
								<div onClick = {this.props.openEditable}>
									Change
								</div>
							</div>
							<div className = "top-buffer"/>
						</div>
					</div>
				}


			</div>	
		)
	}
}

