var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;

export default class UserCardDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		// will be updating this to have a better display in the near future
		var card = this.props.card
		return (
			<div>
				<p> Card ending in : {card.last4} </p>
			</div>	
		)
	}
}

