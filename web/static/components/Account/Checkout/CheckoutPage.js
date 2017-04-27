var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './Cart/CartDisplay'
import CheckoutCardSelect from './Billing/CheckoutCardSelect.js'
import CheckoutAddressSelect from './Shipping/CheckoutAddressSelect.js'
import CheckoutAddBillingModal from './Billing/CheckoutAddBillingModal.js'
import {Button} from 'react-bootstrap'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2


export default class CheckoutPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			price : null,
			cards : [],
			addresses : [],
			selected_card_index : -1,
			selected_address_index : -1,
			can_edit : [false, false, false],
			address_modal_open : false,
			billing_modal_open: false,
			is_loading: true
		}

		this.getSelectedCard = this.getSelectedCard.bind(this)
		this.getSelectedAddress = this.getSelectedAddress.bind(this)
		this.canCheckout = this.canCheckout.bind(this)
	}

	toggleAddressModal(){
		this.setState({address_modal_open : !this.state.address_modal_open})
	}

	toggleBillingModal(){
		this.setState({billing_modal_open : !this.state.billing_modal_open})
	}


	getSelectedAddress(){
		if (this.state.selected_address_index == -1){
			return null
		}
		if (this.state.addresses.length == 0){
			return null
		}
		if (this.state.addresses.length < this.state.selected_address_index){
			return null
		}
		return this.state.addresses[this.state.selected_address_index]
	}

	getSelectedCard(){
		if (this.state.selected_card_index == -1){
			return null
		}
		if (this.state.cards.length == 0){
			return null
		}
		if (this.state.cards.length < this.state.selected_card_index){
			return null
		}
		return this.state.cards[this.state.selected_card_index]
	}

	// handle the addition of new shipping address
	// (in any case adds address to server)
	// in all cases the new address card must be selected 
	// case 0: using same address for shipping and billing with new CC 
	//		 open new payment method modal without the address 
	// case 1: not using same address but with existing CC
	onAddingNewShippingAddress(value){
		if (value == 0){
			this.refreshCheckoutInformation.bind(this)()
			this.closeEditable.bind(this)(ADDRESS_INDEX)
			this.setState({address_modal_open : false})
			this.setState({billing_modal_open : true})
			
		}
		else if (value == 1){
			this.refreshCheckoutInformation.bind(this)()
			this.openEditable.bind(this)(BILLING_INDEX)
		}
		// we just increment one since the next card added will be at the end (I think)
		this.setState({selected_address_index : this.state.addresses.length})
	}

	// this method will fire after a new billing method is added 
	// then that one will be selected
	onAddingNewBillingMethod(){
		this.refreshCheckoutInformation.bind(this)()
		this.setState({selected_address_index : this.state.cards.length})
	}

	// closes all other ones
	openEditable(index){
		if (index == BILLING_INDEX && !this.getSelectedAddress()){
			swal("Whoa!", "You must select a shipping address before continuing", "error")
		}
		else {
			var can_edit = [false, false, false]
			can_edit[index] = true
			this.setState({can_edit : can_edit})	
		}
	}

	closeEditable(index){
		var can_edit = this.state.can_edit
		can_edit[index] = false
		this.setState({can_edit : can_edit})	
	}

	refreshCheckoutInformation(){
		// this.setState({is_loading : true})
		$('#checkout-container').addClass("faded");

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
							is_loading : false
						})
						$('#checkout-container').removeClass("faded");
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
		// if (this.state.cards.length > 0){
		// 	console.log("bro")
		// 	this.setCard.bind(this)(0)
		// } 
		// if (this.state.addresses.length > 0){
		// 	this.setAddress.bind(this)(0)
		// } 
		this.openEditable.bind(this)(ADDRESS_INDEX)
	}

	setCard(card_index){
		this.setState({
			selected_card_index : card_index
		})
	}

	setAddress(address_index){
		this.setState({
			selected_address_index : address_index
		})
	}

	hasCheckoutError(){
		return (this.state.selected_address == null || this.state.selected_card == null)
	}

	onCheckoutClick(){
		var selected_card = this.getSelectedCard.bind(this)()
		var selected_address = this.getSelectedAddress.bind(this)()
		var text = "Are you ready to checkout with card ending in " + selected_card.last4  + 
				"\n to address " + selected_address.address_line1 + "?"
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
				card_id : this.getSelectedCard.bind(this)().id,
				address_id : this.getSelectedAddress.bind(this)().id 
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
					swal("Thank you!", "You will receive a confirmation email for this purchase. \
						This will take the user to a checkout page soon. Will have to write that huh?"
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

	// will allow checkout if possible 
	canCheckout(){
		if (this.getSelectedCard() == null) {
			return false
		}
		if (this.getSelectedAddress() == null){
			return false
		}
		if (this.state.items.length == 0) {
			return false
		}

		if (this.state.can_edit[ADDRESS_INDEX] || this.state.can_edit[BILLING_INDEX]){
			return false
		}

		return true
	}	


	render() {
		var can_checkout = this.canCheckout()
		return (
			<div>
				<TopNavBar />

				
				<div id = "checkout-container" className = "container faded">
		
					<CheckoutAddBillingModal 
						selected_address = {this.getSelectedAddress()}
						show = {this.state.billing_modal_open}
						toggleModal = {this.toggleBillingModal.bind(this)}
						onAddingNewBillingMethod = {this.onAddingNewBillingMethod.bind(this)}
					/>

					<div className = "col-sm-10 col-md-10 col-lg-10">
						<CheckoutAddressSelect 
							selected_address_index = {this.state.selected_address_index}
							toggleModal = {this.toggleAddressModal.bind(this)}
							address_modal_open = {this.state.address_modal_open}
							refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
							setAddress = {this.setAddress.bind(this)}
							addresses = {this.state.addresses}
							addressToString = {this.addressToString} 
							can_edit = {this.state.can_edit[ADDRESS_INDEX]}
							openEditable = {this.openEditable.bind(this)}
							closeEditable = {() => this.closeEditable.bind(this)(ADDRESS_INDEX)}
							address = {this.getSelectedAddress.bind(this)()}
							onAddingNewShippingAddress = {this.onAddingNewShippingAddress.bind(this)}
							/>

						<hr/>

						<CheckoutCardSelect 
						selected_card_index = {this.state.selected_card_index}
						selected_address = {this.getSelectedAddress()}
						toggleModal = {this.toggleBillingModal.bind(this)}
						refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
						setCard = {this.setCard.bind(this)} 
						cards = {this.state.cards} 
						card = {this.getSelectedCard.bind(this)()}
						can_edit = {this.state.can_edit[BILLING_INDEX]}
						openEditable = {this.openEditable.bind(this)}
						closeEditable = {() => this.closeEditable.bind(this)(BILLING_INDEX)}
						/>


						<hr/>

						<CartDisplay 
						is_loading = {this.state.is_loading}
						refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
						price = {this.state.price}
						items = {this.state.items}
						/>



					</div>
					<div className = "col-sm-2 col-md-2 col-lg-2">
						<Button disabled = {!can_checkout} onClick = {this.onCheckoutClick.bind(this)}>
							Place your order!
						</Button>
						<hr/>
						<div className = "order-total">
							Order Total: {this.state.price}
						</div>
					</div>
				</div>
			</div>	
		)
	}
}

