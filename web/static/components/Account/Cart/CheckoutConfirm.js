var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './CartDisplay'
import CheckoutCardSelect from './CheckoutCardSelect.js'
import CheckoutAddressSelect from './CheckoutAddressSelect.js'
import {Button} from 'react-bootstrap'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			
		}
	}




	render() {
		var address = this.props.address
		var card = this.props.card
		return (
			<div>
				
				<span> Shipping : {this.props.addressToString(address)} </span>
				<span> Billing <b> {card.brand} </b> ending in {card.last4} </span>
			</div>	
		)
	}
}

