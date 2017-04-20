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


	render() {
		var cards = this.props.cards
		var card_display = cards.map((card, index) => 
				<div>
					<input type="radio" value= {index} name="gender"/> Card ending in {card.last4}
				</div>
			)


		return (
			<div>
				<h2> Select a card </h2>
				<form>
					<div onChange={this.setCard.bind(this)}>
						{card_display}		
			      	</div>
			    </form>
			</div>	
		)
	}
}

