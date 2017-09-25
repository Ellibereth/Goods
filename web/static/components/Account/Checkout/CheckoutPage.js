var React = require('react')
import AppStore from '../../../stores/AppStore.js'
import AppActions from '../../../actions/AppActions.js'
import PageContainer from '../../Misc/PageContainer'
import CartDisplay from './Cart/CartDisplay'
import CheckoutCardSelect from './Billing/CheckoutCardSelect.js'
import CheckoutAddressSelect from './Shipping/CheckoutAddressSelect.js'
import CheckoutAddBillingModal from './Billing/CheckoutAddBillingModal.js'
import CheckoutPriceRow from './CheckoutPriceRow'
import {formatPrice, formatCurrentPrice} from '../../Input/Util'
import {AlertMessages} from '../../Misc/AlertMessages'

const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2


export default class CheckoutPage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			items : [],
			total_price : null,
			shipping_price : null,
			items_price : null,
			cards : [],
			addresses : [],
			selected_card_index : null,
			selected_address_index : null,
			can_edit : [false, false, false],
			address_modal_open : false,
			billing_modal_open: false,
			is_loading: true,
			first_load_done : false,
			button_disabled : false,
			sales_tax_price: null,
			cart : {},
			

		}

		this.getSelectedCard = this.getSelectedCard.bind(this)
		this.getSelectedAddress = this.getSelectedAddress.bind(this)
		this.canCheckout = this.canCheckout.bind(this)
		this.setLoading = this.setLoading.bind(this)
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
		console.log(index)
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
		this.setLoading(true)
		var form_data = JSON.stringify({
			'jwt' : localStorage.jwt,
			'address' : this.getSelectedAddress()
		})
		$.ajax({
			type: 'POST',
			url: '/refreshCheckoutInfo',
			data: form_data,
			success: function(data) {
				if (data.success) {
					this.setState({
						cart : data.user.cart,
						items: data.user.cart.items, 
						total_price : data.user.cart.total_price,
						shipping_price : data.user.cart.shipping_price,
						items_price : data.user.cart.items_price,
						cards : data.user.cards,
						addresses : data.user.addresses, 
						is_loading : false,
						sales_tax_price : data.user.cart.sales_tax_price,
					})
					AppActions.updateCurrentUser(data.user)
				}
				if (!this.state.first_load_done) {
					this.initializeInformation.bind(this)()
				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'refreshCheckoutInfo',
					eventLabel: AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	componentDidMount(){
		var user = AppStore.getCurrentUser()
		if (user.cards.length == 0 && user.addresses.length == 0){
			this.refreshCheckoutInformation.bind(this)()
		}
		else {
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

	sendToGoogleAnalytics(){
		this.state.items.map((item) => {
			ga('ec:addProduct', {
				'id': item.product_id.toString(),
				'name': item.name,
				'brand': item.manufacturer_obj.name,
				'variant' : item.variant_type ? item.variant_type : 'none',
				'price': formatCurrentPrice(item),
				'quantity': item.num_items
			})
		})

		ga('ec:setAction','checkout')
		ga('send', 'pageview')
	}

	initializeInformation(){
		var user = AppStore.getCurrentUser()
		if (this.state.cards.length > 0){
			for (var i = 0; i < this.state.cards.length; i++){
				if (this.state.cards[i].id == user.default_card){
					// this.setState({selected_card_index : i})
					this.setCard.bind(this)(i)
				}	
			}
		} 

		if (this.state.addresses.length > 0){
			for (var i = 0; i < this.state.addresses.length; i++){
				if (this.state.addresses[i].id == user.default_address){
					// this.setState({selected_address_index : i})
					this.setAddress.bind(this)(i)
				}	
			}	
		} 

		if (this.state.selected_address_index == null) {
			this.setAddress.bind(this)(0)
		}

		if (this.state.selected_card_index == null) {
			this.setCard.bind(this)(0)
		}

		if (this.state.addresses.length == 0){
			this.openEditable.bind(this)(ADDRESS_INDEX)
		}
		else if (this.state.cards.length == 0){
			this.openEditable.bind(this)(BILLING_INDEX)
		}

		this.sendToGoogleAnalytics.bind(this)()
		

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
		}, this.refreshCheckoutInformation.bind(this))
	}

	hasCheckoutError(){
		return (this.state.selected_address == null || this.state.selected_card == null)
	}

	onCheckoutClick(can_checkout){
		if (!can_checkout) return
		var selected_card = this.getSelectedCard.bind(this)()
		var selected_address = this.getSelectedAddress.bind(this)()
		var text = 'Are you ready to checkout with card ending in ' + selected_card.last4    + 
				'\n to address ' + selected_address.address_line1 + '?'
		swal(AlertMessages.CHECKOUT_CONFIRM(text),
			function () {
				this.checkout.bind(this)()
			}.bind(this))
	}

	checkout(){
		this.setState({button_disabled : true})
		this.setState({is_loading : true})
		var form_data = JSON.stringify({
			jwt : localStorage.jwt,
			card_id : this.getSelectedCard.bind(this)().id,
			address_id : this.getSelectedAddress.bind(this)().id 
		})
		$.ajax({
			type: 'POST',
			url: '/checkoutCart',
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal(data.error.title, data.error.text , data.error.type)
					this.refreshCheckoutInformation.bind(this)()
				}
				else {
					if (data.message) {
						swal('Thank you!', data.message
							, 'warning')
					}
					else {
						swal(AlertMessages.CHECKOUT_SUCCESSFUL)
						
						this.state.items.map((item) => {
							ga('ec:addProduct', {
								'id': item.product_id.toString(),
								'name': item.name,
								'variant' : item.variant_type ? item.variant_type : 'none',
								'brand': item.manufacturer_obj.name,
								'price': formatCurrentPrice(item),
								'quantity': item.num_items
							})
						})

						var order = data.order
						// Transaction level information is provided via an actionFieldObject.
						ga('ec:setAction', 'purchase', {
							'id': order.order_id.toString(),
							'affiliation': 'Edgar USA',
							'revenue': formatPrice(order.total_price),
							'tax': formatPrice(order.sales_tax_price),
							'shipping': formatPrice(order.order_shipping),
						})
						ga('send', 'event', 'UX', 'click', 'checkout complete')
					}
					setTimeout(function() {
						window.location = '/checkoutConfirmed'
					}, 2000)
					AppActions.updateCurrentUser(data.user)
				}
				this.setState({button_disabled : false})
				this.setLoading(false)
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'checkoutCart',
					eventLabel: AppStore.getCurrentUser().email
				})
				swal(AlertMessages.CONTACT_CUSTOMER_SERVICE)
				this.setLoading(false)
				this.setState({button_disabled : false})
			}.bind(this),
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}	

	addressToString(address){
		// Example Format
		// Darek Johnson 3900 City Avenue, M619, Philadelphia, PA, 19131 United States
		return ( 
			<span>
				<b> {address.name} </b> <br/>
				{address.address_line1} <br/>
				{address.address_line2 && ' ' + address.address_line2} <br/>
				{address.address_city}, {address.address_state} {address.address_zip} {address.address_country}
			</span>
		)
	}

	canCheckout(){
		if (this.state.button_disabled){
			return false
		}
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
		var checkout_button_class = can_checkout ? ' checkout-button btn btn-default ' :'checkout-button block-checkout btn btn-default '
		var cart = this.state.cart
		if (!cart) return <div/>
		return (
			<PageContainer is_loading = {this.state.is_loading}>
				<div id = "checkout-container" 
					className = {this.state.is_loading ? 'container faded' : 'container'}
				>	
						
					<CheckoutAddBillingModal
						ADDRESS_INDEX = {ADDRESS_INDEX}
						BILLING_INDEX = {BILLING_INDEX}
						CART_INDEX = {CART_INDEX} 
						setLoading = {this.setLoading.bind(this)}
						selected_address = {this.getSelectedAddress()}
						show = {this.state.billing_modal_open}
						toggleModal = {this.toggleBillingModal.bind(this)}
						onAddingNewBillingMethod = {this.onAddingNewBillingMethod.bind(this)}
					/>

					<div className = "col-xs-12 col-sm-9 col-md-9 col-lg-9 ">
						<CheckoutAddressSelect 
							ADDRESS_INDEX = {ADDRESS_INDEX}
							BILLING_INDEX = {BILLING_INDEX}
							CART_INDEX = {CART_INDEX}
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

						<hr className = "small-hr"/>

						<CheckoutCardSelect 
							ADDRESS_INDEX = {ADDRESS_INDEX}
							BILLING_INDEX = {BILLING_INDEX}
							CART_INDEX = {CART_INDEX}
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
						<hr className = "small-hr"/>
						<div className = "well" >
							<div className = "row">
								<div className = "col-md-5 col-lg-5 col-sm-5 col-xs-5 checkout-item-label-editable vcenter">
									<span className = "checkout-section-title"> <b> 3. Items </b> </span>
								</div>
							</div>
							<hr className = "small-hr"/>
							<CartDisplay 
								setLoading = {this.setLoading.bind(this)}
								is_loading = {this.state.is_loading}
								refreshCheckoutInformation = {this.refreshCheckoutInformation.bind(this)}
								price = {formatPrice(this.state.total_price)}
								items = {this.state.items}
							/>
						</div>
					</div>

					<div className = "col-xs-12 col-sm-3 col-md-3 col-lg-3">
						<div className="panel panel-default">
							<div className="panel-body">
								<div className = "row text-center">
									<div className = "col-sm-12 col-md-12 col-lg-12 col-xs-12 vcenter text-center">
										<button className = {checkout_button_class} disabled = {!can_checkout} 
											onClick = {this.onCheckoutClick.bind(this, can_checkout)}>
													Place your order!
										</button>
										<div className = "top-buffer"/>
										<div className = "checkout-notice-of-terms-text">
													By placing your order, you agree to our 
											<a href = "terms">
												{' terms of service '}
											</a>
													and 
											<a href = "privacy">
												{' privacy policy'}
											</a>
										</div>
									</div>
								</div>
								<hr className = "small-hr"/>


								{cart.items_discount ?
									<div>
										<CheckoutPriceRow is_final_row = {false} has_underline = {false} line_through = {true}
											label = {'Items:'} price = {formatPrice(cart.original_items_price)}/>

										<CheckoutPriceRow is_final_row = {false} has_underline = {false} line_through = {true}
											label = {'10% Discount:'}
											show_minus = {true}
											price = {formatPrice(cart.items_discount)}/>
										<hr className = "small-hr"/>
										<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
											label = {'After Discount:'} price = {formatPrice(this.state.items_price)}/>
									</div>
									:
									<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
										label = {'Items Price:'} price = {formatPrice(this.state.items_price)}/>
								}



										



								{this.state.shipping_price ? 
									<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
										label = {'Shipping:'} price = {formatPrice(this.state.shipping_price)}/>
									: <div/>
								}	


								{this.state.sales_tax_price ?
									<CheckoutPriceRow is_final_row = {false} has_underline = {false} 
										label = {'Sales Tax:'} price = {formatPrice(this.state.sales_tax_price)}/>
									: <div/>
								}

								<hr className = "small-hr"/>
										
								{/* cart.discount_message && 
											<div className = "row">
												<div style = {{textAlign : "center"}}
												className = "col-sm-12 col-lg-12 col-md-12">
													{cart.discount_message}
												</div>
											</div>
										*/}

								<CheckoutPriceRow is_final_row = {true} has_underline = {false} 
									label = {'Total:'} price = {formatPrice(this.state.total_price)}/>
										


							</div>

							<div className="panel-footer">
								<div className = "row">
									<div className = "col-xs-12 col-sm-12 col-md-12 col-lg-12">
										<div className = "clickable-text checkout-footer-text">
												How are shipping costs calculated?
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageContainer>
		)
	}
}

