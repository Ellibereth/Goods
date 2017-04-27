var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './Cart/CartDisplay'
import {Button} from 'react-bootstrap'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			price : null,
			cards : [],
			addresses : [],
			is_loading: true
		}
	}

	refreshCheckoutInformation(){
		this.setState({is_loading : true})
		$('#view-cart-container').addClass("faded");
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/getCheckoutInformation",
				data: form_data,
				success: function(data) {
					if (data.success) {
						this.setState({
							items: data.cart.items, 
							price : data.cart.price,
							cards : data.cards,
							addresses : data.addresses, 
						})
					}
					else {
						console.log("an error")
					}
					this.setState({is_loading : false})
					$('#view-cart-container').removeClass("faded");
				}.bind(this),
				error : function(){
					console.log("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	

	componentWillMount(){
		this.refreshCheckoutInformation.bind(this)()
	}

	
	render() {
		return (
			<div>

				<TopNavBar />

				<div id = "view-cart-container" className = "container">
					<div className = "row">
						<div className = "row">
							<div className = "col-xs-12 col-sm-12 col-md-12 col-lg-12">
								<b> Your Cart </b>
							</div>
						</div>
						<div className = "col-sm-9 col-md-9 col-lg-9">
						<CartDisplay 
							is_loading = {this.state.is_loading}
							refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
							price = {this.state.price}
							items = {this.state.items}
							/>
						</div>
						{	this.state.items.length > 0 && 
						<div className = "col-sm-3 col-md-3 col-lg-3">
							<Button>
								<Link to = "checkout"> Proceed to Checkout </Link>
							</Button>
						</div>
						}
						
					</div>
				</div>
			</div>	
		)
	}
}

