var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;

export default class UserAddressDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		// will be updating this to have a better display in the near future
		var address = this.props.address
		return (
			<div>
				<p> Name : {address.name} </p>
				<p> Address : {address.address_line1} </p>
				<p> City : {address.address_city} </p>
				<p> Zip : {address.address_zip} </p>
			</div>	
		)
	}
}

