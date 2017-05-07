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



	render() {
		var card = this.props.card

		return (
			<div className = "col-sm-4 col-md-4 col-lg-4 text-center settings-preview-column">
				<span className = "block-span"> {card.name} </span>
				<span className = "block-span">{card.brand} </span>
				<span className = "block-span"> Ending in {card.last4}  </span> 
				<span className = "block-span"> Exp. {card.exp_month} / {card.exp_year}  </span>
				<span className = "block-span"> 
					<button className = "btn btn-default" onClick = {this.deleteCardPress.bind(this)}>
						Delete 
					</button>
				</span>

			</div>
		)
	}
}

