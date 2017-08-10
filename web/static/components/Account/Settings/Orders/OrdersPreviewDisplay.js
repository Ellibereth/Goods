var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {formatPrice} from '../../../Input/Util.js'
var dateFormat = require('dateformat');
import OrderItemDisplay from './OrderItemDisplay'

// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {

		var order = this.props.order
		var items = this.props.order.items
		var items_display = []
		for (var i = 0; i < items.length; i++){
			items_display.push(<OrderItemDisplay order = {items[i]}/>)
		}
		var local_date = new Date(order.date_created)
		var formatted_date = dateFormat(local_date, "dddd, mmmm dS, yyyy, h:MM TT");
		var address = order.address
		var sales_tax_display = order.sales_tax_price ? <div className = "order-history-panel-header"> {"Sales Tax: $" + formatPrice(order.sales_tax_price)} </div> : <span/>
		return (
			<div className="panel panel-default">
				<div className = "panel-heading darker-heading">
					<div className = "order-history-panel-header">
						 {"Order: " + this.props.order_id}  
					</div>
					<div className = "order-history-panel-header">
						{"Date:  " + formatted_date} 
					</div>
				
				</div>
				
				<div className = "panel-body">
					<div className = "col-sm-6 col-md-6 col-lg-6">
						<div>
							<div> <b> Shipped To </b> </div>
							{address.address_name && <div> {address.address_name} </div>}
							<div> {address.address_line1} </div>
							{address.address_line2 && <div> {address.address_line2} </div>}
							<div> {address.address_city + ", " + address.address_state + " " + address.address_zip} </div>
							<div> {address.address_country} </div>
						</div>
					 </div>

					<div className = "col-sm-4 col-md-4 col-lg-4">
						<div> <b> Billed to </b> </div>
						<div>
							 {order.card_brand + " ending in " + order.card_last4}  
						</div>
					 </div>
					 
				</div>

				<div className = "panel-body">
					{items_display}
				</div>

				<div className = "panel-footer">
					{order.discounts > 0 && 
						<div>
							<div className = "order-history-panel-header"> {"Items Before Discounts: $" + formatPrice(order.items_price + order.discounts)} </div>
							<div className = "order-history-panel-header"> {"Discounts: $" + formatPrice(order.discounts)} </div>
						</div>
					}
					<div className = "order-history-panel-header"> {"Items : $" + formatPrice(order.items_price)} </div>
					<div className = "order-history-panel-header"> {"Shipping: $" + formatPrice(order.order_shipping)} </div>
					{sales_tax_display}
					<div className = "order-history-panel-header"> {"Order Total: $" + formatPrice(order.total_price)} </div>
				</div>


			</div>
						
		)
	}
}

