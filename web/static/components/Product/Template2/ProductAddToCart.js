var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../../stores/AppStore'
import AppActions from '../../../actions/AppActions'
import {AlertMessages} from '../../Misc/AlertMessages'
import {formatPrice} from '../../Input/Util'
import FadingText from '../../Misc/FadingText'

export default class ProductAddToCart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			quantity: 1,
			variant : null,
			buy_disabled : false,
			variant : null,
			variant_display : this.getVariantDefaultText.bind(this)(),
			add_to_cart_success: false,
			error_text : '',
			show_error_text : false,
		}
		this.setErrorMessage = this.setErrorMessage.bind(this)
	}

	getVariantById(product, variant_id) {
		if (product.has_variants) {
			for (var i = 0; i < product.variants.length; i++){
				if (product.variants[i].variant_id == variant_id){
					return product.variants[i]
				}
			}
		}
	}


	setErrorMessage(error_text) {
		this.setState({
			show_error_text : true, 
			error_text : error_text
		})
		
	}



	// edit this to allow user to checkout as guest
	onNonUserClick(){
		console.log('creating guest user')
		$.ajax({
			type: 'POST',
			url: '/createGuestUser',
			success: function(data) {
				if (data.success){
					AppActions.addCurrentUser(data.user, data.jwt)
					this.addToCart.bind(this)()
				}
				// this.props.setLoading(false)
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getUserInfo',
					eventLabel: localStorage.ab_group +  '-' + AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	onQuantityChange(event){
    	var new_quantity = event.target.value
    	this.setState({quantity : new_quantity})
	}

	onVariantChange(event) {
    	var variant = this.getVariantById(this.props.product, event.target.value)
    	this.setState({
			variant : variant,
			// variant_display : variant.variant_type
		}, this.props.checkItemInStock(this.props.product, variant))
	}

	getVariantDefaultText(){
		var VARIANT_TEXT  = this.props.product.variant_type_description ?  
			('Select a ' + this.props.product.variant_type_description + '...') :
			'Select a Type...'
		return VARIANT_TEXT
	}


	addToCart(){
    	if (!this.props.item_in_stock) {
    		return
    	}

		if (this.props.product.has_variants && !this.state.variant) {
			this.setErrorMessage(AlertMessages.MUST_SELECT_VARIANT(this.props.product.variant_type_description).title)
		}

		else {
			this.props.setLoading(true)
			this.setState({buy_disabled : true})
			$.ajax({
				type: 'POST',
				url: '/addItemToCart',
				data: JSON.stringify({
					'quantity' : this.state.quantity,
					'product_id' : this.props.product.product_id, 
					'jwt' : localStorage.jwt,
					'variant' : this.state.variant
				}),
				success: function(data) {
					if (data.success){
						
						AppActions.updateCurrentUser(data.user)
						ga('ec:addProduct', {
							'id': this.props.product.product_id.toString(),
							'name': this.props.product.name,
							'brand': this.props.product.manufacturer.name,
							'price': formatPrice(this.props.product.price),
							'quantity': this.state.quantity,
							'variant' : this.state.variant ? this.state.variant.variant_type : 'none'
						})
						ga('ec:setAction', 'add')
						ga('send', 'event', 'UX', 'click', localStorage.ab_group +  '-' + 'add to cart')
						window.location = '/myCart'
						// this.props.getProductInformation()
					}
					else {
						this.setState({quantity : 1})
						this.setErrorMessage(data.error.title)
					}
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					this.setErrorMessage(AlertMessages.INTERNAL_SERVER_ERROR.title)
					ga('send', 'event', {
						eventCategory: 'server-error',
						eventAction: 'add-to-cart',
						eventLabel : localStorage.ab_group +  '-' + AppStore.getCurrentUser().email
					})
					this.props.setLoading(false)
					this.setState({buy_disabled : false})
				}.bind(this),
				dataType: 'json',
				contentType : 'application/json; charset=utf-8'
			})	
		}
	}

	componentWillReceiveProps(){
		if (this.props.product.has_variants) {
			this.setState({
				variant : this.props.product.variants[0]
			})
		}
	}

	componentWillReceiveProps(nextProps){
		if (!this.state.variant) {
			if (nextProps.product.has_variants) {
				this.setState({
					variant : nextProps.product.variants[0]
				})
			}
		}
	}

	addToCartClick() {
		var user = AppStore.getCurrentUser()
		if (user || user.is_guest) {
			this.addToCart.bind(this)()
		}
		else {
			this.onNonUserClick.bind(this)()
		}
	}

	getVariantSelect(product) {
		if (!product.has_variants){
			return <div/>
		}

		return (
			<div className="quantitySelBlock ">
				<select  onChange = {this.onVariantChange.bind(this)}
					tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="variant_dropdown" className="quantityPgSizeDD def_select quantityDPP" >
					{product.variants.map((variant,index) => 
						<option 
						 name = {index} 
						 value= {variant.variant_id}>{variant.variant_type}</option>
					)}
				</select>
			</div>
		)
	}

	addToCartDisabled(product) {
		var user = AppStore.getCurrentUser()
		if (!user || !user.cart || !user.cart.items) return false
		var cart = user.cart
		var items = user.cart.items
		if (product.has_variants){
			for (var i = 0; i < items.length; i++) {
				var item = items[i]
				if (item.product_id == product.product_id) {
					if (this.state.variant) {
						if (item.variant_id == this.state.variant.variant_id) {
							if (item.num_items >= this.state.variant.inventory) {
								return true
							}
						}
					}
				}
			}
		}
		else {
			for (var i = 0; i < items.length; i++) {
				var item = items[i]
				if (item.product_id == product.product_id){
					if (item.num_items >= product.num_items_limit) {
						return true
					}
					if (item.num_items >= product.inventory) {
						return true
					}

				}
			}
		}
		return false
	}


	render() {    	
    	var variant_select = this.getVariantSelect.bind(this)(this.props.product)
    	var quantity_options = []
    	for (var i = 1; i <= this.props.product.num_items_limit; i++){
			quantity_options.push(<option value={i}>{i}</option>)
    	}

    	var add_to_cart_disabled = this.addToCartDisabled.bind(this)(this.props.product)
    	var disabled_class = add_to_cart_disabled || !this.props.item_in_stock ? ' quantity-select-disabled ' : ''

    	
		return (
			<li className="colorsWithAddToCart reg-prod-pg">
				{variant_select}
				<div className="quantitySelBlock hidden-xs">
					<select 
						name = "quantity_dropdown"
						value = {this.state.quantity}
						disabled = {add_to_cart_disabled || !this.props.item_in_stock}
						onChange = {this.onQuantityChange.bind(this)}
						tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" 
						className={'quantityPgSizeDD def_select quantityDPP ' + disabled_class}>
						{quantity_options}
					</select>
				</div>

				<div className="prodPgAddcartButton clear">
					{this.props.item_in_stock && !add_to_cart_disabled ?
						<a tabindex="3" onClick = {this.addToCartClick.bind(this)}
						 className="btn btn-default-red prodPgAddcartAchrButton edgarSubmitBtn addToCart round5 noShadow edgarGrad noPadding ">
							<div className="add-to-bag-btn-ct">
								<span className="shop-bag-icon-white add-bag-btn-img"></span>
								<span>&nbsp;&nbsp;&nbsp;Add to Cart</span>
							</div>
						</a>
						:
						<a tabindex="3" className="soldOut btn btn-default-red prodPgAddcartAchrButton edgarSubmitBtn addToCart round5 noShadow edgarGrad noPadding ">
							<div className="add-to-bag-btn-ct">
								<span className="shop-bag-icon-white add-bag-btn-img"></span>
								<span>&nbsp;&nbsp;&nbsp;Add to Cart</span>
							</div>
						</a>
					}

					{add_to_cart_disabled &&
					<div style = {{'paddingTop' : '64px'}}>
						<span style = {{'color' : 'red'}}>You can't buy more than {this.props.product.num_items_limit} of this item</span>
					</div>
					}
					<FadingText show = {this.state.show_error_text} height_transition = {false}>
						<div style = {{'paddingTop' : '64px'}}>
							<span style = {{'color' : 'red'}}>{this.state.error_text}</span>
						</div>	
					</FadingText>
					


					<div className="clear"/>
				</div>
				<div className="clear"/>
			</li>
		)
	}
}