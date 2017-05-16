var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import PageContainer from '../../Misc/PageContainer'
import CartDisplay from './Cart/CartDisplay'
import {Button} from 'react-bootstrap'
import {formatPrice} from '../../Input/Util'
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
		// $('#view-cart-container').addClass("faded");
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
							price : data.user.cart.price,
							cards : data.user.cards,
							addresses : data.user.addresses, 
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
		// this.refreshCheckoutInformation.bind(this)()
		var user = AppStore.getCurrentUser()
		this.setState({
				items: user.cart.items, 
				price : user.cart.price,
				cards : user.cards,
				addresses : user.addresses, 
				is_loading: false
			})
	}

	
	render() {
		console.log(this.state.items)
		return (
			<PageContainer component = {
				<div id = "view-cart-container" 
				className = {this.state.is_loading ? "container faded" : "container"}
				>

					<div className = "row">
						<div className = "col-md-10 col-lg-10 col-sm-10 well">
							<div className = "row">
								<div className = "col-md-2 col-lg-2 col-sm-2 checkout-item-label-editable vcenter">
									<b> Items </b>
								</div>
							</div>
							<hr/>
							<div className = "row">
								<div className = "col-md-12 col-lg-12">
									<CartDisplay 
										is_loading = {this.state.is_loading}
										refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
										price = {this.state.price}
										items = {this.state.items}
										/>
								</div>
							</div>
							<div className = "row">
								<div className = "col-md-2 col-lg-2 pull-right">
									<span> <b> Subtotal </b> ${formatPrice(this.state.price)} </span>
								</div>
							</div>
						</div>
						<div className = "col-md-2 col-lg-2 col-sm-2">
								<Button disabled = {this.state.items.length == 0}>
									<Link to = "checkout"> Proceed to Checkout </Link>
								</Button>
								
						</div>
					</div>
				</div>
			}/>
			
		)
	}
}

