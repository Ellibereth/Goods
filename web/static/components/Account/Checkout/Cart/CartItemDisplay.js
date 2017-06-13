var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
var browserHistory = require('react-router').browserHistory;
import {formatPrice} from '../../../Input/Util'

export default class CartItemDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	serverUpdateQuantity(new_quantity){
		var form_data = JSON.stringify({
				"jwt" : localStorage.jwt,
				"new_num_items" : new_quantity,
				"cart_item" : this.props.item
			})
			$.ajax({
				type: "POST",
				url: "/updateCartQuantity",
				data: form_data,
				success: function(data) {
					if (data.success){
						AppActions.updateCurrentUser(data.user)
					}
					else {
						swal("Sorry", "Something went wrong." + data.error, "error")
					}
					
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'updateCartQuantity',
						eventLabel: AppStore.getCurrentUser().email
					});
					swal("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		this.props.refreshCheckoutInformation()
	}

	handleQuantityChange(event){
		var new_num_items = event.target.value
		this.serverUpdateQuantity.bind(this)(new_num_items)
	}

	// removing item is the same as setting quatity to zero
	removeItem(){
		swal({
		  title: "You sure?",
		  text: "Are you sure you want to remove this item from your cart?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.serverUpdateQuantity.bind(this)(0)
		}.bind(this))	
	}






	render() {
		// will be updating this to have a better display in the near future
		// need photo, price, etc
		var item = this.props.item
		if(item.images.length == 0) {
			var image_display = <div> No Image Exists for this product </div>
		}

		else {
			var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
			var image_display = <img className = "cart-image-display" src = {src_base + item.main_image} />
		}

		var num_items_options = []
		var limit = this.props.item.num_items_limit ? Math.min(this.props.item.num_items_limit, this.props.item.inventory) : this.props.item.inventory
		limit = Math.max(limit, this.props.item.num_items)
		for (var i = 1; i <= limit; i++){
			if (this.props.item.num_items == i){
				num_items_options.push(<option selected value = {i}> {i} </option>)
			}
			else {
				num_items_options.push(<option value = {i}> {i} </option>)
			}
		}	
		return (
				<div className = "row cart-checkout-preview"> 
					<hr/>
					<div className = "top-buffer"/>
						<div onClick = {() => window.location = `/eg/` + this.props.item.product_id}
						className = "col-xs-4 col-sm-4 col-md-4 col-lg-4">
							<div className = "row">
								<div className = "col-sm-4 col-md-4 col-lg-4">
									{image_display}
								</div>
								<div className = "col-sm-8 col-md-8 col-lg-8">
									<span className = "cart-item-text clickable-text"> {item.name} </span>
								</div>
							</div>
						</div>

						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 cart-item-price-text vcenter hcenter">
							<span className = "cart-item-text"> ${formatPrice(item.price)} </span>
						</div>

						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter hcenter">
							<form>
								<div class="form-group">
								  <select onChange = {this.handleQuantityChange.bind(this)} class="form-control">
								    {num_items_options}
								  </select>
								</div>
							</form>
						</div>
						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 cart-item-price-text vcenter hcenter">
							<span className = "cart-item-text"> ${formatPrice(item.price *  item.num_items)}  </span>
						</div>
						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter hcenter">
							 <span onClick = {this.removeItem.bind(this)} className="glyphicon glyphicon-remove cart-remove-item-icon" />
						</div>
						
					<div className = "top-buffer"/>
			</div>	
		)
	}
}

