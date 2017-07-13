var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore'
import AppActions from '../../../actions/AppActions'
import {AlertMessages} from '../../Misc/AlertMessages'

export default class ProductAddToCart extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			quantity: 1,
			variant : null,
			buy_disabled : false,
			variant : null,
			variant_display : this.getVariantDefaultText.bind(this)()
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


    render() {    	
    	var variant_select = this.getVariantSelect.bind(this)(this.props.product)
		return (
				<li className="colorsWithAddToCart reg-prod-pg">
					{variant_select}
					<div className="quantitySelBlock ">
						<select  onChange = {this.onQuantityChange.bind(this)}
						tabindex="-1" id="qtyDropDownOnProductPg" data-placeholder="Qty" name="qtyDropDownOnProductPg" className="quantityPgSizeDD def_select quantityDPP" >
							<option value="1">Qty. 1</option>
							<option value="2">Qty. 2</option>
							<option value="3">Qty. 3</option>
							<option value="4">Qty. 4</option>
							<option value="5">Qty. 5</option>
						</select>
					</div>

					{/* 
					<div className="productBadge">
						<span className=" dIB"></span>
						<span className="badgeRelatedContent dIB small-text-grey" style= {{"verticalAlign" : "top"}}><span className="fontB "></span> <span className="colorRed fontNr fontWeight500">FREE SHIPPING</span> above $75* <a href="/shipping-policy/?ref=product_pg"><i className="fa fa-question-circle"></i></a></span>
					</div>
					*/}
					<div className="prodPgAddcartButton clear">
						{this.props.item_in_stock ?
						<a tabindex="3" onClick = {this.addToCart.bind(this)} className="btn btn-default-red prodPgAddcartAchrButton fabSubmitBtn addToCart round5 noShadow fabGrad noPadding ">
							<div className="add-to-bag-btn-ct">
								<span className="shop-bag-icon-white add-bag-btn-img"></span>
								<span>&nbsp;&nbsp;&nbsp;Add to Cart</span>
							</div>
						</a>
						:
						<a tabindex="3" className="soldOut btn btn-default-red prodPgAddcartAchrButton fabSubmitBtn addToCart round5 noShadow fabGrad noPadding ">
							<div className="add-to-bag-btn-ct">
								<span className="shop-bag-icon-white add-bag-btn-img"></span>
								<span>&nbsp;&nbsp;&nbsp;Add to Cart</span>
							</div>
						</a>
					}

					{/* <div className="prodNavFaveCt float-left prodPageFav">
						<span data-tracker="fav_login" data-trackerevent-type="loginToFav" id="prodNavFaveImg" className="prodNavFaveImg favProduct new-heading-2 favedOnPNVC faveCountclassName" alt="Like this product? ADD TO YOUR LISTS" title="Like this product? ADD TO YOUR LISTS">
							<i id="heartContainer" className="fa fa-heart-o"></i>
							<span id="faveIconCount" style= {{"display" : "inline"}}>65</span>
						</span>
						<div className="list-dropdown-wrapper">
							<div className="arrow"></div>
							<div className="non-content">
								<div className="curtain">
									<div className="error-msg-placeholder">Oops! Something went wrong.</div></div></div><div className="view-content"><ul className="wishlists"><li><label className="wishlist master-list" for="526543_2283159"><input type="checkbox" id="526543_2283159" data-id="2283159" className="master-list"/><label for="526543_2283159"></label><span className="list-name">Faves</span><span className="list-items-count">(0)</span></label></li></ul><form className="new-list"><input type="text" className="new-list-name" placeholder="Create New List"/><input type="submit" className="listBtn createList colorfff" value="Add"/></form></div></div></div>*/}
					<div className="clear"/>
					</div>
					<div className="clear"/>
				</li>
		);
    }
}