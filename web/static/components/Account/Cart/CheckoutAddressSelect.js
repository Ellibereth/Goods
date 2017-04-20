var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class CheckoutAddressSelect extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}


	setAddress(event){
		this.props.setAddress(this.props.addresses[event.target.value])
	}


	render() {
		var addresses = this.props.addresses
		var address_display = addresses.map((address, index) => 
				<div>
					<input type="radio" value= {index} name="gender"/> {address.address_line1} {address.address_line2}
				</div>
			)


		return (
			<div>
				<h2> Select an address </h2>
				<form>
					<div onChange={this.setAddress.bind(this)}>
						{address_display}		
			      	</div>
		      	</form>
			</div>	
		)
	}
}

