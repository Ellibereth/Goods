var React = require('react');
var ReactDOM = require('react-dom');

export default class PastOrdersDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
	}


	componentDidMount(){

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

