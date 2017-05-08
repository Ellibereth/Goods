var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2

import CheckoutCardPreview from './CheckoutCardPreview'
export default class CheckoutCardSelect extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selected_card : -1
		}
	}

	setCard(){
		this.props.openEditable(CART_INDEX)	
	}

	onCardChange(index){
		this.props.setCard(index)
		this.setState({selected_card : index})
	}



	getCardInput(card, index){
		return (
			<div className = "row">
				<hr/>
				<div className = "top-buffer"/>
				<div className = "col-md-1 col-xs-1 col-sm-1 col-lg-1 text-right vcenter">
					<input onClick = {this.onCardChange.bind(this, index)} 
					checked = {index == this.props.selected_card_index}
					type="radio" value= {index} name = "card"/>
				</div>
				<div className = "col-md-4 col-xs-4 col-sm-4 col-lg-4  vcenter">
					 
					<b> {card.brand} </b> ending in {card.last4} 
				</div>
				<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3  hcenter vcenter">
					{card.name}
				</div>
				<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3  hcenter vcenter">
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

		if (cards.length == 0){
			var card_display = 
			<div className = "row">
				<hr/>
				<div className = "top-buffer"/>
				<div className = "col-md-1 col-xs-1 col-sm-1 col-lg-1  vcenter">
					
				</div>
				<div className = "col-md-4 col-xs-4 col-sm-4 col-lg-4  vcenter">
					 
					You have no cards at this time!
				</div>
				<div className = "top-buffer"/>
			</div>
		}

		var card = this.props.card

		return (
			<div className = "well">
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
						<hr/>

						<div className = "row row-eq-height">
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 text-right">
								<span className = "gylphicon glyphicon-plus btn-lg add-field-icon" onClick = {this.props.toggleModal} />
							</div>
							<div className = "col-xs-4 col-sm-4 col-md-4 col-lg-4 ">
								<span onClick = {this.props.toggleModal} className = "clickable-text add-field-text"> Add Payment Method </span>
							</div>
						</div>
						<hr/>

						{
							this.props.cards.length > 0 &&
							<div className = "row">
								<div className = "col-xs-4 col-sm-4 col-md-4 col-lg-4 ">
									<Button onClick = {this.setCard.bind(this)}>
										Use this card
									</Button>
								</div>
							</div>
						}
						
					</div>
				:
					<CheckoutCardPreview 
						openEditable = {this.props.openEditable}
						card = {this.props.card}
					/>
				}


			</div>	
		)
	}
}

