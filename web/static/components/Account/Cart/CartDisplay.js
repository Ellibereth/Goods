var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartItemDisplay from './CartItemDisplay'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

export default class CartDisplay extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}


	render() {
		var item_display = this.props.items.map((item, index) =>
				<CartItemDisplay refreshCheckoutInformation = {this.props.refreshCheckoutInformation} item = {item} />
			)


		return (
			<div id = "cart_display">
				{item_display.length == 0 ? 
					<div>
						<h2> There are no items in your cart! Check out our store 
						 <Link to = "/store"> here </Link> </h2>
					</div>
				:
					<div>
						<div className = "row">
							<div className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 cart-title hcenter">
								Your Cart
							</div>
						</div>
						<div className = "row">
							<div className = "col-xs-6 col-sm-6 col-md-6 col-lg-6">
								Item Description
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								Price
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								Quantity 
							</div>
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 hcenter1">
								Item Total 
							</div>
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 hcenter">
								Remove
							</div>
						</div>	

							{item_display}
					
						<hr/>
							<div className = "row">
								<div className = "col-xs-8 col-sm-8 col-md-8 col-lg-8 vcenter">
									<Button onClick = {this.props.navigateToNextStep.bind(this)}> Proceed to Checkout </Button>
								</div>
								<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter vcenter">
									Subtotal
								</div>
								<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 hcenter vcenter cart-item-price-text">
									<b> ${this.props.price} </b>
								</div>	
							</div>
						
					</div>
				}
			</div>	
		)
	}
}

