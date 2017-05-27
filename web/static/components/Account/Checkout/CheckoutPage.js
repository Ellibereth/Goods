var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import AppActions from '../../../actions/AppActions.js';
import PageContainer from '../../Misc/PageContainer'
import CartDisplay from './Cart/CartDisplay'
import CheckoutCardSelect from './Billing/CheckoutCardSelect.js'
import CheckoutAddressSelect from './Shipping/CheckoutAddressSelect.js'
import CheckoutAddBillingModal from './Billing/CheckoutAddBillingModal.js'
import CheckoutPriceRow from './CheckoutPriceRow'
import {formatPrice} from '../../Input/Util'
import Spinner from '../../Misc/Spinner'
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
			total_price : null,
			shipping_price : null,
			items_price : null,
			cards : [],
			addresses : [],
			selected_card_index : -1,
			selected_address_index : -1,
			can_edit : [false, false, false],
			address_modal_open : false,
			billing_modal_open: false,
			is_loading: true,
			first_load_done : false
		}

		this.getSelectedCard = this.getSelectedCard.bind(this)
		this.getSelectedAddress = this.getSelectedAddress.bind(this)
		this.canCheckout = this.canCheckout.bind(this)
	}

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
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
	
	onAddingNewBillingMethod(){
		var length = this.state.cards.length
		this.refreshCheckoutInformation.bind(this)()
		this.setState({selected_card_index : length})
		this.openEditable.bind(this)(CART_INDEX)
	}

	openEditable(index){
		var can_edit = [false, false, false]
		can_edit[index] = true
		this.setState({can_edit : can_edit})
	}

	closeEditable(index){
		var can_edit = this.state.can_edit
		can_edit[index] = false
		this.setState({can_edit : can_edit})	
	}

	refreshCheckoutInformation(){
		this.setState({is_loading : true})
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
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
							total_price : data.user.cart.total_price,
							shipping_price : data.user.cart.shipping_price,
							items_price : data.user.cart.items_price,
							cards : data.user.cards,
							addresses : data.user.addresses, 
							is_loading : false
						})
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user, data.jwt)
						// $('#checkout-container').removeClass("faded");
					}
					else {
						console.log("an error")
					}
					if (!this.state.first_load_done) {
						this.initializeInformation.bind(this)()
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

		var user = AppStore.getCurrentUser()
		if (user.cards.length == 0 && user.addresses.length == 0){
			this.refreshCheckoutInformation.bind(this)()
		}
		else{
			this.setState({
				cards : user.cards,
				addresses: user.addresses,
				total_price: user.cart.total_price,
				shipping_price : user.cart.shipping_price,
				items_price : user.cart.items_price,
				items : user.cart.items,
				is_loading: false
				},
				this.initializeInformation.bind(this)
			)
		}
	}

	initializeInformation(){
		var user = AppStore.getCurrentUser()
		if (this.state.cards.length > 0){
			for (var i = 0; i < this.state.cards.length; i++){
				if (this.state.cards[i].id == user.default_card){
					this.setState({selected_card_index : i})
					this.setCard.bind(this)(i)
				}	
			}
			
		} 
		if (this.state.addresses.length > 0){
			for (var i = 0; i < this.state.addresses.length; i++){
				if (this.state.addresses[i].id == user.default_address){
					this.setState({selected_address_index : i})
					this.setAddress.bind(this)(i)
				}	
			}	
		} 

		if (this.state.addresses.length == 0){
			this.openEditable.bind(this)(ADDRESS_INDEX)
		}
		else if (this.state.cards.length == 0){
			this.openEditable.bind(this)(BILLING_INDEX)
		}
		

		this.setState({first_load_done : true})
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
		var text = "Are you ready to checkout with card ending in " + selected_card.last4    + 
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
		this.setState({is_loading : true})
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
					setTimeout(function() {
						browserHistory.push(`/checkoutConfirmed`)
					}, 2000)
					$('#checkout-container').removeClass("faded");
					AppActions.removeCurrentUser()
					AppActions.addCurrentUser(data.user, data.jwt)
				}
			}.bind(this),
			error : function(){
				swal("We're sorry!", "Please contact customer service to discuss what you tried to do.","error")
				this.setState({is_loading : true})
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}	

	addressToString(address){
		// Example Format
		// Darek Johnson 3900 City Avenue, M619, Philadelphia, PA, 19131 United States
		return ( 
			<span>
				<b> {address.name} </b> <br/>
				{address.address_line1} <br/>
				{address.address_line2 && " " + address.address_line2} <br/>
				{address.address_city}, {address.address_state} {address.address_zip} {address.address_country}
			</span>
		)
	}

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
		return true
	}	


	render() {
		var can_checkout = this.canCheckout()

		return (
			<PageContainer {...this.props}
				component = {
					<div id = "checkout-container" 
					className = {this.state.is_loading ? "container faded" : "container"}
					>	
						{this.state.is_loading && <Spinner />}
						<CheckoutAddBillingModal 
							setLoading = {this.setLoading.bind(this)}
							selected_address = {this.getSelectedAddress()}
							show = {this.state.billing_modal_open}
							toggleModal = {this.toggleBillingModal.bind(this)}
							onAddingNewBillingMethod = {this.onAddingNewBillingMethod.bind(this)}
						/>

						<div className = "col-sm-9 col-md-9 col-lg-9">
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
								setLoading = {this.setLoading.bind(this)}
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
							<div className = "well" >
								<div className = "row">
									<div className = "col-md-5 col-lg-5 col-sm-5 checkout-item-label-editable vcenter">
										<span className = "checkout-section-title"> <b> 3. Items </b> </span>
									</div>
								</div>
								<hr/>
								<CartDisplay 
								is_loading = {this.state.is_loading}
								refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
								price = {formatPrice(this.state.total_price)}
								items = {this.state.items}
								/>
							</div>
						</div>

						<div className = "col-sm-3 col-md-3 col-lg-3">
							<div className="panel panel-default">
								<div className="panel-body">
									<div className = "row">
										<div className = "col-sm-12 col-md-12 col-lg-12 vcenter text-center">
											<Button className = "checkout-button" disabled = {!can_checkout} onClick = {this.onCheckoutClick.bind(this)}>
												Place your order!
											</Button>
											<div className = "top-buffer"/>
											<div className = "checkout-notice-of-terms-text">
												By placing your order, you agree to our 
												<Link to = "terms">
													{" terms of service "}
												</Link>
												and 
												<Link to = "privacy">
													{" privacy policy"}
												</Link>
											</div>
										</div>
									</div>
									<hr/>
									<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
									label = {"Items:"} price = {formatPrice(this.state.items_price)}/>
									<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
									label = {"Shipping:"} price = {formatPrice(this.state.shipping_price)}/>
									<hr/>
									<CheckoutPriceRow is_final_row = {true} has_underline = {false} 
									label = {"Total:"} price = {formatPrice(this.state.total_price)}/>
								</div>

								<div className="panel-footer">
									<div className = "row">
										<div className = "col-sm-12 col-md-12 col-lg-12">
											<div className = "clickable-text checkout-footer-text">
												How are shipping costs calculated?
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
			}/>	
		)
	}
}

