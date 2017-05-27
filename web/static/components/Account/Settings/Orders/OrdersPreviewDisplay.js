var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {Col} from 'react-bootstrap'
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
		var items = this.props.items
		var order_items = []
		var total_price = 0;
		for (var i = 0; i < this.props.items.length; i++){
			order_items.push(<OrderItemDisplay order = {items[i]}/>)
			total_price = total_price + items[i].price * items[i].num_items
		}
		var item = this.props.items[0]
		var local_date = new Date(item.date_created)
		var formatted_date = dateFormat(local_date, "dddd, mmmm dS, yyyy, h:MM TT");
		var address = item.address
		return (
			<div className="panel panel-default">
				<div className = "panel-heading">
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
							 {item.card_brand + " ending in " + item.card_last4}  
						</div>
					 </div>
					 
				</div>

				<div className = "panel-body">
					{order_items}
				</div>

				<div className = "panel-footer">
					<div className = "order-history-panel-header"> {"Shipping: $5.00"} </div>
					<div className = "order-history-panel-header"> {"Order Total: $" + formatPrice(total_price)} </div>
				</div>


			</div>
						
		)
	}
}

