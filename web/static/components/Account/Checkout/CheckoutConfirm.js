var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import {Button} from 'react-bootstrap'
import CartDisplay from './CartDisplay'

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
		var items = this.props.items
		var price = this.props.price
		return (
			<div>
				<div className = "row">
					<div className = "col-md-2 col-lg-2 col-sm-2">
						<b> 1. Shipping Address </b>
					</div>
					<div className = "col-md-6 col-lg-6 col-sm-6">
						<span className = "span-block"> {address.name} </span>
						<span className = "span-block"> {address.address_line1} {address.address_line2} </span>
						<span className = "span-block"> {address.city}, {address.state} {address.address_zip} </span>
					</div>
					<div className = "col-md-1 col-sm-1 col-lg-1">
						<div>
							Change
						</div>
					</div>
					<div className = "top-buffer"/>
				</div>
				<hr/>

				<div className = "row">
					<div className = "col-md-2 col-lg-2 col-sm-2">
						<b> 2. Payment Method </b>
					</div>
						<div className = "col-md-4 col-lg-4 col-sm-4">
							<span className = "span-block"> <b> {card.brand} </b> ending in {card.last4} </span> 
							<span className = "span-block"> Billing Address: <b> {address.name} </b> {address.address_line1}, {address.address_line2}, {address.address_city}, {address.address_state}, {address.address_zip} {address.address_country} </span>
						</div>

						<div className = "col-md-1 col-sm-1 col-lg-1">
							<div>
								Change
							</div>
						</div>
						<div className = "top-buffer"/>					
				</div>

				<hr/>

				<div className = "row">
					<div className = "row">
						<div className = "col-md-2 col-lg-2 col-sm-2">
							<b> 3. Review Cart </b>
						</div>
					</div>
							<CartDisplay 
							refreshCheckoutInformation = {this.props.refreshCheckoutInformation}
							 items = {items}
							 price = {price}
							 />

				</div>

				<div className = "row">
					<div className = "col-md-2 col-lg-2 col-sm-2">
						<Button onClick = {this.props.onCheckoutClick}> 
							Place your order
						</Button>
					</div>
				</div>

				
			</div>	
		)
	}
}

