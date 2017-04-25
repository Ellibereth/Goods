var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './CartDisplay'
import CheckoutCardSelect from './CheckoutCardSelect.js'
import CheckoutAddressSelect from './CheckoutAddressSelect.js'
import CheckoutConfirm from './CheckoutConfirm.js'
import {Button} from 'react-bootstrap'


var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2


export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			price : null,
			cards : [],
			addresses : [],
			selected_card : null,
			selected_address : null,
			can_edit : [true, true, true]
		}
	}


	// closes all other ones
	openEditable(index){
		var can_edit = this.state.can_edit
		can_edit[index] = true
		this.setState({can_edit : can_edit})
	}

	closeEditable(index){
		var can_edit = this.state.can_edit
		can_edit[index] = false
		this.setState({can_edit : can_edit})	
	}



	refreshCheckoutInformation(){
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/getCheckoutInformation",
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

	componentWillMount(){
		this.refreshCheckoutInformation.bind(this)()
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
				url: "/checkoutCart",
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

	addressToString(address){
		// Darek Johnson 3900 City Avenue, M619, Philadelphia, PA, 19131 United States
		return ( 
			<span>
				<b> {address.name} </b> {address.address_line1}, {address.address_line2}, {address.address_city}, {address.address_state}, {address.address_zip} {address.address_country}
			</span>
		)
	}


	render() {
		return (
			<div>
				<TopNavBar />
				<div className = "container">
					<div className = "col-sm-10 col-md-10 col-lg-10">
						<CheckoutAddressSelect 
							setAddress = {this.setAddress.bind(this)}
							addresses = {this.state.addresses}
							addressToString = {this.addressToString} 
							can_edit = {this.state.can_edit[ADDRESS_INDEX]}
							openEditable = {() => this.openEditable.bind(this)(ADDRESS_INDEX)}
							closeEditable = {() => this.closeEditable.bind(this)(ADDRESS_INDEX)}
							address = {this.state.selected_address}
							/>

						<hr/>

						<CheckoutCardSelect 
						setCard = {this.setCard.bind(this)} 
						cards = {this.state.cards} 
						card = {this.state.selected_card}
						can_edit = {this.state.can_edit[BILLING_INDEX]}
						openEditable = {() => this.openEditable.bind(this)(BILLING_INDEX)}
						closeEditable = {() => this.closeEditable.bind(this)(BILLING_INDEX)}
						/>


						<hr/>

						<CartDisplay 
						refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
						price = {this.state.price}
						items = {this.state.items}
						/>



					</div>

					<div className = "col-sm-2 col-md-2 col-lg-2">
						<Button onClick = {this.onCheckoutClick.bind(this)}>
							Place your order!
						</Button>
					</div>
				</div>
			</div>	
		)
	}
}

