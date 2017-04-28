var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;

export default class PastOrdersDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount(){

	}

	render() {
		// shows the product 
		// name (this is a link to the original), price, date, 

		var order = this.props.order
		console.log(order)
		var product = order.product
		var address = order.address
		var card = order.card
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		return (
			<div className = "panel panel-default container-fluid">
				<div className = "panel-heading row">
					
						<div className = "col-md-3 col-lg-3">
							<span> Order Placed </span>
							<span> {order.date_created} </span>
						</div>
						<div className = "col-md-3 col-lg-3">
							<span> Total </span>
							<span> {order.total_price} </span>
						</div>
						<div className = "col-md-3 col-lg-3">
							<span> Shipped To </span>
							<span> {address.address_name} </span>
						</div>
						<div className = "col-md-3 col-lg-3">
							<span> Billed To </span>
							<span> {card.brand} ending in {card.last4} </span>
						</div>
				</div>	
				<div className = "panel-body row">
						<div className = "col-md-8 col-lg-8 clickable-text">
							<img 
							className= "img-responsive product-image-more"
							src = {src_base + product.main_image} onClick = {()=> browserHistory.push("/eg/" + product.product_id)}/>
							<Link to = {"/eg/" + product.product_id}> {product.name} </Link> 
						</div>
				</div>
				<div className = "top-buffer"/>
			</div>
		)
	}
}

