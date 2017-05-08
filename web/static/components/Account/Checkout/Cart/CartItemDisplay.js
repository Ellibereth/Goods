var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
var browserHistory = require('react-router').browserHistory;
import {Button} from 'react-bootstrap'


export default class CartItemDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	serverUpdateQuantity(new_quantity){
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt,
				"new_num_items" : new_quantity,
				"product_id" : this.props.item.product_id

			})
			$.ajax({
				type: "POST",
				url: "/updateCartQuantity",
				data: form_data,
				success: function(data) {
					if (data.success){
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user, data.jwt)
					}
					else {
						swal("Sorry", "Something went wrong." + data.error, "error")
					}
					
				}.bind(this),
				error : function(){
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
		  text: "Removing it now will be a pain if you change your mind later",
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

		var max_items = 10
		var num_items_options = []
		for (var i = 1; i <= 100; i++){
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
						<div onClick = {() => browserHistory.push(`/eg/` + this.props.item.product_id)}
						className = "col-xs-4 col-sm-4 col-md-4 col-lg-4 clickable-text vcenter">
							{image_display} {item.name}
						</div>

						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 cart-item-price-text vcenter hcenter">
							${item.price}
						</div>

						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter hcenter">
							<form>
								<div class="form-group">
								  <select onChange = {this.handleQuantityChange.bind(this)} class="form-control">
								    {num_items_options}
								    <option value = {0}> Delete </option>
								  </select>
								</div>
							</form>
						</div>
						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 cart-item-price-text vcenter hcenter">
							${item.price *  item.num_items} 
						</div>
						<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 vcenter hcenter">
							 <span onClick = {this.removeItem.bind(this)} className="glyphicon glyphicon-remove cart-remove-item-icon" />
						</div>
						
					<div className = "top-buffer"/>
			</div>	
		)
	}
}

