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
		}
	}


	setCard(index){
		this.props.setCard(this.props.cards[index])
	}

	getCardInput(card, index){
		return (
			<div className = "row">
				<hr/>
				<div className = "top-buffer"/>
				<div className = "col-md-1 col-xs-1 col-sm-1 col-lg-1 hcenter vcenter">
					<input onClick = {this.setCard.bind(this, index)} 
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
		console.log(card_display)


		return (
			<div>
					<div className = "row">
						<div className = "col-md-5 col-xs-5 col-sm-5 col-lg-5 vcenter">
							<b> Your Credit Cards </b>
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
					<div className = "row">
						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter">
								<Button onClick = {this.props.navigateToLastStep.bind(this)}> Return to Cart </Button>
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter">
								<Button onClick = {this.props.navigateToNextStep.bind(this)}> Proceed to Shipping </Button>
							</div>	
					</div>
			</div>	
		)
	}
}

