var React = require('react')
var ReactDOM = require('react-dom')
var Link = require('react-router').Link
var browserHistory = require('react-router').browserHistory
import AppStore from '../../../../stores/AppStore.js'
import OrdersPreviewDisplay from './OrdersPreviewDisplay'

// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	render() {

		// var order_display = this.props.orders.map((order,index) =>
		// 			<OrdersPreviewDisplay order = {order}/>
		// 	)
		if (!this.props.orders) {
			var order_display = <span> No orders </span>
		}
		else if (this.props.orders.length > 0){
			var order_display = <OrdersPreviewDisplay order = {this.props.orders[0]}/>
		}
		else {
			var order_display = <span> No orders </span>
		}
		var num_orders = this.props.orders ? this.props.orders.length : 0
		return (
			<div className = "container-fluid">
					
				<div className="panel panel-default">
					<div className = "panel-heading">
						<div className = "account-page-text"> Past Orders </div>
					</div>
					
					{	order_display.length > 0 &&
						<div className = "panel-body">
							<div className = "container">
								{order_display}
							</div>
						</div>	
					}
					

					<div className="panel-body">			
						{num_orders == 1 ?
							<span className = "account-page-text block-span"> You have {num_orders} order </span>
							:
							<span className = "account-page-text block-span"> You have {num_orders} orders </span>
						}

						{
							num_orders > 0 ?
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

