var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import PageContainer from '../../../Misc/PageContainer.js'
import OrdersPreviewDisplay from './OrdersPreviewDisplay'
var browserHistory = require('react-router').browserHistory;
import Spinner from '../../../Misc/Spinner'

export default class OrderHistoryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders : [],
			is_loading : true
		}
	}

	componentDidMount(){
		var request_data = JSON.stringify({
			"jwt" : localStorage.jwt,
			"user" : AppStore.getCurrentUser()
		})
		$.ajax({
			type: "POST",
			url: "/getUserOrders",
			data : request_data,
			success: function(data) {
			this.setState({orders: data.orders, is_loading : false})
			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'getUserOrders',
						eventLabel: AppStore.getCurrentUser().email
					});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}


	getOrderDisplay(orders){
		var output = orders.map((order, index) =>
					<OrdersPreviewDisplay 
						order_id = {order.order_id}
						order = {order}
						index = {index}
						/>
			)

		return output
	}

	render() {
		var orders = this.state.orders


		if (orders.length == 0){
			var order_display = <h3> You haven't bought anything on <a href = "/">Edgar USA</a> yet.</h3>
		}
		else {
			var order_display = this.getOrderDisplay.bind(this)(orders)
		}

		
		
		return (
			<PageContainer component = {
				<div id = "orders_container" className = "container">
					{this.state.is_loading && <Spinner />}
					{order_display}
				</div>
			}/>
		)
	}
}

