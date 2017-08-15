var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore'
import AppActions from '../../../actions/AppActions'
import {AlertMessages} from '../../Misc/AlertMessages'
import {formatPrice} from '../../Input/Util'

export default class ProductAddToCart extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			quantity: 1,
			variant : null,
			buy_disabled : false,
			variant : null,
			variant_display : this.getVariantDefaultText.bind(this)(),
			add_to_cart_success: null
		}
    }

    getVariantById(product, variant_id) {
		if (product.has_variants) {
			for (var i = 0; i < product.variants.length; i++){
				if (product.variants[i].variant_id == variant_id){
					return product.variants[i];
				}
			}
		}
	}




	// edit this to allow user to checkout as guest
	onNonUserClick(){
		$.ajax({
			type: "POST",
			url: "/createGuestUser",
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
					eventLabel: AppStore.getCurrentUser().email
				});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
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
			("Select a " + this.props.product.variant_type_description + "...") :
			"Select a Type..."
		return VARIANT_TEXT
	}


    addToCart(){
    	if (!this.props.item_in_stock) {
    		return;
    	}

		if (this.props.product.has_variants && !this.state.variant) {
			swal(AlertMessages.MUST_SELECT_VARIANT(this.props.product.variant_type_description))
		}

		else {
			this.props.setLoading(true)
			this.setState({buy_disabled : true})
			$.ajax({
				type: "POST",
				url: "/addItemToCart",
				data: JSON.stringify({
					"quantity" : this.state.quantity,
					"product_id" : this.props.product.product_id, 
					"jwt" : localStorage.jwt,
					"variant" : this.state.variant
				}),
				success: function(data) {
					if (data.success){
						$("#add_to_cart_success_text").toggleClass("add-to-cart-success-text-hidden add-to-cart-success-text");
						// setTimeout(function() {this.setState({add_to_cart_success : null})}.bind(this), 2000)
						// swal(AlertMessages.ITEM_ADDED_TO_CART,
						// function(isConfirm){
						// 	if (isConfirm){
						// 		window.location =  '/myCart'
						// 	}
						// });
						AppActions.updateCurrentUser(data.user)
						ga('ec:addProduct', {
							'id': this.props.product.product_id.toString(),
							'name': this.props.product.name,
							'brand': this.props.product.manufacturer,
							'price': formatPrice(this.props.product.price),
							'quantity': this.state.quantity,
							'variant' : this.state.variant ? this.state.variant.variant_type : "none"
						});
						ga('ec:setAction', 'add')
						ga('send', 'event', 'UX', 'click', 'add to cart');
						this.props.getProductInformation()
					}
					else {
						this.setState({quantity : 1})
						swal(data.error.title, data.error.text , data.error.type)
					}
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					swal(AlertMessages.INTERNAL_SERVER_ERROR)
					ga('send', 'event', {
						eventCategory: 'server-error',
						eventAction: 'add-to-cart',
						eventLabel : AppStore.getCurrentUser().email
					});
					// this.props.setLoading(false)
					this.setState({buy_disabled : false})
				}.bind(this),
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});	
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
		if ((AppStore.getCurrentUser() && !AppStore.getCurrentUser().is_guest)) {
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
				tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" className="quantityPgSizeDD def_select quantityDPP" >
					{product.variants.map((variant,index) => 
							<option name = "name" value= {variant.variant_id}>{variant.variant_type}</option>
						)}
				</select>
			</div>
		)
	}

	addToCartDisabled(product) {
		var user = AppStore.getCurrentUser()
		if (!user || !user.cart || !user.cart.items) return false;
		var cart = user.cart
		var items = user.cart.items
		if (product.has_variants){
			for (var i = 0; i < items.length; i++) {
				var item = items[i]
				if (item.product_id == product.product_id){
					if (item.variant_id == this.state.variant.variant_id) {
						if (item.num_items >= this.state.variant.inventory) {
							return true
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
    	var disabled_class = add_to_cart_disabled || !this.props.item_in_stock ? " quantity-select-disabled " : ""

    	
		return (
				<li className="colorsWithAddToCart reg-prod-pg">
					{variant_select}
					<div className="quantitySelBlock hidden-xs">
						<select 
						value = {this.state.quantity}
						disabled = {add_to_cart_disabled || !this.props.item_in_stock}
						onChange = {this.onQuantityChange.bind(this)}
						tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" 
						className={"quantityPgSizeDD def_select quantityDPP " + disabled_class}>
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
					<div style = {{"paddingTop" : "64px"}}>
						<span style = {{"color" : "red"}}>Sorry, but we're cutting you off at {this.props.product.num_items_limit} of this item</span>
					</div>
					}
					
					<div style = {{"paddingTop" : "64px"}}>
						<span id ="add_to_cart_success_text" 
						className = "add-to-cart-success-text-hidden">
							Item added to cart
						</span>
					</div>

						<div className="clear"/>
					</div>
					<div className="clear"/>
				</li>
		);
    }
}