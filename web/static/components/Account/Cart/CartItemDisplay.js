var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import {Button} from 'react-bootstrap'


export default class UserAddressDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}


	render() {
		// will be updating this to have a better display in the near future
		var item = this.props.item
		return (
			<div className = "row">
				<div>
					<p> Name : {item.name} </p>
					<p> Quantity : {item.num_items} </p>
				</div>	
				
			</div>
		)
	}
}

