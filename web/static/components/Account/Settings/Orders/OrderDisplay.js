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

	addressToString(){
		var address = this.props.order.address
		var address_string = address.address_name + "\n" +
								address.address_line1 + "\n" +
								address.address_line2 + "\n" +
								address.address_city + "\n" + address.address_state + " " + address.address_zip + "\n" +
								address.address_country 
		return address_string
	}

	componentDidMount(){
		$(document).ready(function(){
		    $('[data-toggle="popover"]').popover({
		        placement : 'bottom',
		        trigger : 'hover'
		    });
		});
	}

	render() {
		// shows the product 
		// name (this is a link to the original), price, date, 

		var order = this.props.order
		var product = order.product
		var address = order.address
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
					<div data-toggle = "popover" 
						data-content = {this.addressToString.bind(this)()} 
						className = "col-md-3 col-lg-3">
						<span> Shipped To </span> <br/>
						<span className = "clickable-text" > {address.address_name} </span>
					</div>
					<div className = "col-md-3 col-lg-3">
						<span> Insert Field Here </span> <br/>
						<span> Field Data </span>
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

