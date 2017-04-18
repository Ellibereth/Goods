var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

export default class PastOrdersDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
	}


	componentDidMount(){
		var request_data = JSON.stringify({
			"jwt" : localStorage.jwt,
			"product_id" : this.props.order.product_id
		})
			$.ajax({
			  type: "POST",
			  url: url + "/getMarketProductInfo",
			  data: request_data,
			  success: function(data) {
				this.setState({product: data})
			  }.bind(this),
			  error : function(){
				console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
	}



	render() {
		// shows the product 
		// name (this is a link to the original), price, date, 
		var product = this.state.product
		var order = this.props.order
		return (
			<div className = "past-order">
				<a href = {"/eg/" + product.product_id}> {product.name} </a> 
				<h4> {product.price} </h4>
				<h4> {order.time_stamp} </h4>
			</div>	
		)
	}
}

