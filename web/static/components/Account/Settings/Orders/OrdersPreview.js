var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import OrdersPreviewDisplay from './OrdersPreviewDisplay'

// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {

		// var order_display = this.props.orders.map((order,index) =>
		// 			<OrdersPreviewDisplay order = {order}/>
		// 	)
		if (this.props.orders.length > 0){
			var order_display = <OrdersPreviewDisplay order = {this.props.orders[0]}/>
		}
		else {
			var order_display = <span> No orders </span>
		}
		return (
			<div className = "container-fluid">
					
				<div className="panel panel-default">
					<div className = "panel-heading">
						<div className = "account-page-text"> Recent Orders </div>
					</div>
					
					{	order_display.length > 0 &&
						<div className = "panel-body">
							<div className = "container">
								{order_display}
							</div>
						</div>	
					}
					

					<div className="panel-body">			
						{this.props.orders.length == 1 ?
							<span className = "account-page-text block-span"> You have {this.props.orders.length} order </span>
							:
							<span className = "account-page-text block-span"> You have {this.props.orders.length} orders </span>
						}

						{
							this.props.orders.length > 0 ?
							<span className = "account-page-text block-span"> <a href = "/myOrders"> View more </a> </span>
							:
							<span className = "account-page-text block-span"> Start shopping at our store by clicking <a href = "/"> here </a> </span>
						}
					</div>
				</div>
			</div>

			
						
		)
	}
}

