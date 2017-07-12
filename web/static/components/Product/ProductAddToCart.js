var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../stores/AppStore'
import {AlertMessages} from '../Misc/AlertMessages'

export default class ProductAddToCart extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			quantity: 1,
			variant : null,
			buy_disabled : false
		}
    }

    onQuantityChange(event){

    	var new_quantity = event.target.value
    	this.setState({quantity : new_quantity})
    }


    addToCart(){
    	if (!this.props.item_in_stock) {
    		return;
    	}
		if (this.props.product.has_variants && !this.state.variant) {
			swal(AlertMessages.MUST_SELECT_VARIANT(this.props.product.variant_type_description))
		}

		else {

			// this.props.setLoading(true)
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
					// this.props.getProductInformation()
					// setTimeout(function () {
					// 	this.props.checkItemInStock(this.props.product, this.state.variant)
					// }.bind(this), 1000)
					// this.setState({buy_disabled : false},
					// 	() => this.props.setLoading(false)
					// )
						
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


    render() {    	
    	console.log(this.props.item_in_stock)
		return (
				<div>
					<div className="quantitySelBlock">
						<select onChange = {this.onQuantityChange.bind(this)} tabindex="2" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" className="quantityPgSizeDD def_select quantityDPP">
							{/* quantity select options */}
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</select>
					</div>
					<div className= {this.props.item_in_stock ? "prodPgAddcartButton clear" : "prodPgAddcartButton soldOut clear"}>
						<a onClick = {this.addToCart.bind(this)} tabindex="3" href="javascript:void(0)" className="prodPgAddcartAchrButton fabSubmitBtn addToCart round5 noShadow fabGrad">
							Add to Cart
						</a>
					</div>
					<div className="clear"></div>
					<div className="productBadge">
						<span className="fabShopSprite2 fabproductBigSizeLogo dIB"></span>
						<span className="badgeRelatedContent font12 dIB"><span className="font14 fabProductTextColor">FAB PLUS</span> – This product ships immediately. <span className="colorRed font12 fontNr fontWeight500 free-shipping-link">FREE SHIPPING</span> above $49.</span>
						<span data-badgetype="fabproduct_morecontentLeftopen" className=" productBadgeQuestionMark dIB fabShopSpriteNew productBadgeTooltipHandler">
						</span> 
					</div>
				</div>
		);
    }
}