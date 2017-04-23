var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}


	setCard(event){
		this.props.setCard(this.props.cards[event.target.value])
	}

	getCardInput(card, index){
		
					
				
		return (

			<span>
				<div className = "row">
					<div className = "col-md-3 col-xs-3 col-sm-3 col-lg-3">
						<input type="radio" value= {index} name="gender"/> 
						<b> {card.brand} </b> ending in {card.last4} 
					</div>
					<div className = "col-md-2 col-xs-2 col-sm-2 col-lg-2">
						{card.name}
					</div>
					<div className = "col-md-2 col-xs-2 col-sm-2 col-lg-2">
						{card.exp_month}/{card.exp_year}
					</div>
				</div>
			</span>
		)
	}


	render() {
		var cards = this.props.cards
		var card_display = cards.map((card, index) => 
				this.getCardInput(card, index)
			)


		return (
			<div>
				<form>
					<div onChange={this.setCard.bind(this)}>
						<div className = "row">
							<div className = "col-md-4 col-xs-4 col-sm-4 col-lg-4">
								Your Credit Cards
							</div>
							<div className = "col-md-2 col-xs-2 col-sm-2 col-lg-2">
								Name on Card
							</div>
							<div className = "col-md-2 col-xs-2 col-sm-2 col-lg-2">
								Expiration Date
							</div>
						</div>
						{card_display}		
			      	</div>
			    </form>
			</div>	
		)
	}
}

