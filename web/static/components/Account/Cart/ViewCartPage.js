var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './CartDisplay'
import CheckoutCardSelect from './CheckoutCardSelect.js'
import CheckoutAddressSelect from './CheckoutAddressSelect.js'
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
			selected_card : null,
			selected_address : null
		}
	}

	refreshProductInfo(){
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: url  + "/getCheckoutInformation",
				data: form_data,
				success: function(data) {
					console.log(data)
					if (data.success) {
						console.log(data)
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
				}.bind(this),
				error : function(){
					console.log("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	componentDidMount(){
		this.refreshProductInfo.bind(this)()
	}

	setCard(card){
		this.setState({selected_card : card})
	}

	setAddress(address){
		this.setState({selected_address : address})
	}

	hasCheckoutError(){
		return (this.state.selected_address == null || this.state.selected_card == null)
	}

	onCheckoutClick(){
		var text = "Are you ready to checkout with card ending in " + this.state.selected_card.last4  + 
				"\n to address " + this.state.selected_address.address_line1 + "?"
		swal({
		  title: "Confirm",
		  text: text,
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.checkout.bind(this)()
		}.bind(this))
	}

	checkout(){
			var form_data = JSON.stringify({
					account_id : AppStore.getCurrentUser().account_id,
					jwt : localStorage.jwt,
					card_id : this.state.selected_card.id,
					address_id : this.state.selected_address.id 
				})
			$.ajax({
				type: "POST",
				url: url  + "/checkoutCart",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong + " + data.error, "warning")
					}
					else {
						swal("Thank you!", "You will receive a confirmation email for this purchase"
							, "success")
					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	

	


	render() {

		var has_error = this.hasCheckoutError.bind(this)()
		return (
			<div>

				<TopNavBar />

				<div className = "container">
					<h2> 
						Your Cart! 
					</h2>

					<CartDisplay refreshProductInfo = {this.refreshProductInfo.bind(this)} items = {this.state.items}/>
					{this.state.items.length > 0 &&
						<div>
						<CheckoutCardSelect setCard = {this.setCard.bind(this)} cards = {this.state.cards} />
						<CheckoutAddressSelect setAddress = {this.setAddress.bind(this)}
						addresses = {this.state.addresses} />

					
					
						<hr/>
						<Button disabled = {has_error}
						onClick = {this.onCheckoutClick.bind(this)}> Checkout! </Button>
						</div>
					}
				</div>
			</div>	
		)
	}
}

