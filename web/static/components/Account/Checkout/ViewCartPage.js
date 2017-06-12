var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import PageContainer from '../../Misc/PageContainer'
import CartDisplay from './Cart/CartDisplay'
import {formatPrice} from '../../Input/Util'
import Spinner from '../../Misc/Spinner'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			items_price : null,
			cards : [],
			addresses : [],
			is_loading: true,
			cart_message : ""
		}
	}

	refreshCheckoutInformation(){
		this.setState({is_loading : true})
		var form_data = JSON.stringify({
				"jwt" : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/getUserInfo",
			data: form_data,
			success: function(data) {
				if (data.success) {
					this.setState({
						items: data.user.cart.items, 
						items_price : data.user.cart.items_price,
						cards : data.user.cards,
						addresses : data.user.addresses, 
					})
					// if (this.state.is_loading) {
					// 	this.setState({cart_message : data.user.cart_message},
					// 		() => this.readCartMessage())

					// }
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

	readCartMessage(){
		var form_data = JSON.stringify({
				"jwt" : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/readCartMessage",
			data: form_data,
			error : function(){
				console.log("an internal server error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});

	}

	componentDidMount(){
		// this.refreshCheckoutInformation.bind(this)()
		var user = AppStore.getCurrentUser()
		this.setState({
						items: user.cart.items, 
						items_price : user.cart.items_price,
						cards : user.cards,
						addresses : user.addresses, 
						is_loading : false
					})
	}

	render() {
		return (
			<PageContainer component = {
				<div id = "view-cart-container" 
				className = {this.state.is_loading ? "container faded" : "container"}
				>
					{this.state.is_loading && <Spinner />}

					<div className = "row">
						<div className = "col-md-9 col-lg-9 col-sm-9 well">
							<div className = "row">
								<div className = "col-md-2 col-lg-2 col-sm-2 checkout-item-label-editable vcenter">
									<span className = "checkout-section-title">
										<b> Items </b>
									</span>
								</div>
							</div>
							<hr/>
							<div className = "row">
								<div className = "col-md-12 col-lg-12">
									<CartDisplay 
										is_loading = {this.state.is_loading}
										refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
										price = {this.state.items_price}
										items = {this.state.items}
										/>
								</div>
							</div>
							<div className = "row">
								<div className = "col-md-2 col-lg-2 pull-right">
									<span> <b> Subtotal </b> ${formatPrice(this.state.items_price)} </span>
								</div>
							</div>
						</div>
						<div className = "col-md-3 col-lg-3 col-sm-3">
							<button className = "btn btn-default checkout-button" disabled = {this.state.items.length == 0} 
							onClick = {() => window.location = '/checkout'}>
								Proceed to Checkout 
							</button>
							{/*<div className = "row">
								<div className = "cart-message">
									{this.state.cart_message}
								</div>
							</div>*/}
						</div>
					</div>
				</div>
			}/>
			
		)
	}
}

