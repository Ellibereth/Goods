var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import PageContainer from '../../../Misc/PageContainer.js'
import OrdersPreviewDisplay from './OrdersPreviewDisplay'
var browserHistory = require('react-router').browserHistory;

export default class OrderHistoryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			orders : [],
			is_loading : true
		}
	}

	componentDidMount(){
		$("#orders_container").addClass("faded")
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
			$("#orders_container").removeClass("faded")
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		var orders = this.state.orders
		if (orders.length == 0){
			var order_display = <h3> You haven't bought anything on <a href = "/"> Edgar USA </a> yet.</h3>
		}
		else {
			var order_display = orders.map((order, index) => 
				<div>
					<OrdersPreviewDisplay order = {order} index = {index} />
					<hr/>
				</div>
			)	
		}
		

		return (
			<PageContainer component = {
				<div id = "orders_container" className = "container faded">
					<div className="panel panel-default">
						<div className = "panel-heading">
							<div> Past Orders </div>
						</div>
						

						<div className = "panel-body">
							<div className = "container">
								{order_display}
							</div>
						</div>


					</div>
				</div>
			}/>
		)
	}
}

