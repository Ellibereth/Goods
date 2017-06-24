var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js'
import AppActions from '../../../../actions/AppActions.js'
import {formatPrice} from '../../../Input/Util.js'
import {AlertMessages} from '../../../Misc/AlertMessages'

var browserHistory = require('react-router').browserHistory


// takes the price of the good as prop for now
export default class AddToCartButton extends React.Component {
		constructor(props) {
		super(props);
		this.state = {
			quantity : 1,
			buy_disabled : false,
			quantity_display : "1",
			variant : null,
			variant_display : this.getVariantDefaultText.bind(this)()

		}
	}

	getVariantDefaultText(){
		var VARIANT_TEXT  = this.props.product.variant_type_description ?  
			("Select a " + this.props.product.variant_type_description + "...") :
			"Select a Type..."
		return VARIANT_TEXT
	}

	handleQuantityChange (quantity){
		this.setState({quantity_display : quantity, quantity : quantity})
		$("#quantity_dropdown").removeClass('open')
	}

	handleVariantChange(variant){
		this.setState({
			variant : variant,
			variant_display : variant.variant_type
		}, this.props.checkItemInStock(this.props.product, variant))
		$("#variant_dropdown").removeClass('open')

	}


	addToCart(){
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
							swal(AlertMessages.ITEM_ADDED_TO_CART,
							function(isConfirm){
								if (isConfirm){
									window.location =  '/myCart'
								}
							});
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
						}
						else {
							swal(data.error.title, data.error.text , data.error.type)
						}
						this.props.getProductInformation()
						setTimeout(function () {
							this.props.checkItemInStock(this.props.product, this.state.variant)
						}.bind(this), 1000)
						this.setState({buy_disabled : false},
							() => this.props.setLoading(false)
						)
						
						
				}.bind(this),
				error : function(){
					swal(AlertMessages.INTERNAL_SERVER_ERROR)
					ga('send', 'event', {
						eventCategory: 'server-error',
						eventAction: 'add-to-cart',
						eventLabel : AppStore.getCurrentUser().email
					});
					this.props.setLoading(false)
					this.setState({buy_disabled : false})
				}.bind(this),
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});	
		}

		

	}

	componentDidMount(){
		this.props.refreshUserInformation()
		if (!this.props.product.has_variants) {
			this.props.checkItemInStock(this.props.product, null)
		}
	}

	// edit this to allow user to checkout as guest
	onNonUserClick(){
		
		this.props.setLoading(true)
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

	render() {
		var quantity_options = []
		var num_in_cart = 0
		var cart_item = this.props.cart_item
		var num_in_cart = cart_item.num_items
		var num_can_add = cart_item.num_items_limit - cart_item.num_items
		var user = AppStore.getCurrentUser()

		var button_disabled = this.state.buy_disabled || (!this.props.item_in_stock)

		for (var i = 1; i <= Math.min(10, this.props.product.inventory); i++) {
			quantity_options.push(
					<li style= {{"cursor" : "pointer"}}  
						onClick = {this.handleQuantityChange.bind(this, i)}> 
						<a> {i} </a>
					 </li>
				)
		}



		var variant_options = []
		this.props.product.variants.map((variant, index) => {

					var variant_option = (
						<li>
							<a className = {variant.inventory > 0 ? "dropdown-item" 
							: "dropdown-item sold-out"}
							style= {{"cursor" : "pointer"}} 
							onClick = {this.handleVariantChange.bind(this, variant)}>
							 {variant.variant_type} 
							</a>
						</li>
					)
					if (variant.inventory > 0) {
						variant_options.unshift(variant_option)
					}
					else {
						variant_options.push(variant_option)
					}
			})





		return (
				<div >
						{ this.props.product.has_variants &&
							<div className = "row">
								<div id = "variant_dropdown" className="dropdown">
									<button  className="btn dropdown dropdown-toggle variant-select-button " 
										type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
										<span className =" pull-left">
											<span> 
												{this.props.item_in_stock ?
													<b>  {this.state.variant_display} </b>
													:
													<b> <strike> {this.state.variant_display} </strike> </b>
												}
											</span>
										</span>
										<span className = "pull-right"> 
											<span className= "caret"/>
										</span>
									</button>
									<ul className="dropdown-menu variant-dropdown" aria-labelledby="dropdownMenu1">
										<li> 
											<a onClick = {() => this.setState({variant : null, variant_display : this.getVariantDefaultText.bind(this)()})}>
												 {this.getVariantDefaultText.bind(this)()}
											</a> 
										</li>
										<li role="separator" className="divider"></li>
										{variant_options}
									</ul>
								</div>
							</div>
						}

						<div className = "small-buffer"/>
						
						
						

						<div className = "row">
							<div className = "btn-group">
								<div id = "quantity_dropdown" className="btn-group dropdown">
									<button  type="button" disabled = {button_disabled}
									 className= {button_disabled ? "btn quantity-button dropdown-toggle vertical-button-divider disabled"
									 : "btn quantity-button dropdown-toggle vertical-button-divider"}
										data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											<span className = "block-span">
												<span> {this.state.quantity_display} </span>
												<span className="caret"/>
											</span>
											<span className = "block-span">
												Qty.
											</span>	
										
										
									</button>
									<ul className="dropdown-menu quantity-dropdown">
										{quantity_options}
									</ul>
								</div>
								<button type = "button" 
								disabled = {button_disabled}
									onClick = {user ? this.addToCart.bind(this) 
										: this.onNonUserClick.bind(this)} 
									className= {button_disabled ? "btn add-to-cart-button disabled"
									 : "btn add-to-cart-button"}>
									<span className = "add-to-cart-text block-span">
										<b> Add to Cart </b>
									</span>
								</button>
							</div>
						</div>
						
				</div>

		);
	}
}