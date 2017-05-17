var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import AppStore from '../../../../stores/AppStore.js'
import AppActions from '../../../../actions/AppActions.js'
import {Button} from 'react-bootstrap'
import {formatPrice} from '../../../Input/Util.js'



// takes the price of the good as prop for now
export default class AddToCartButton extends React.Component {
		constructor(props) {
		super(props);
		this.state = {
			quantity : 1,
			variant : null,
			quantity_display : "1"
		}
	}

	handleQuantityChange (quantity){
		this.setState({quantity_display : quantity, quantity : quantity})
	}

	handleVariantChange(event){
		this.setState({variant : event.target.value})
	}


	addToCart(product){
		$.ajax({
			type: "POST",
			url: "/addItemToCart",
			data: JSON.stringify({
				"quantity" : this.state.quantity,
				"product_id" : this.props.product.product_id, 
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt,
				"variant" : this.state.variant
			}),
			success: function(data) {
					if (data.success){
						swal("Succesfully added to your cart!")
						this.props.refreshUserInformation.bind(this)()
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user, data.jwt)
					}
					else    {
						swal({title: "Problem",     
								text: data.error,     
								type: "error" 
							})
					
					}
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		this.props.refreshUserInformation()
		if (this.props.product.variants) {
			this.setState({
				variant : this.props.product.variants[0]
			})
		}

		// $(".dropdown-menu li").click(function() {
		// 	console.log("clicked!")
		//     $(this).parent().closest(".dropdown-menu").prev().dropdown("toggle");
		// });
	}

	onNonUserClick(){
		swal("You must sign in before you can add this to your cart!")	
	}

	render() {
		var quantity_options = []
		var num_in_cart = 0
		var cart_item = this.props.cart_item
		var num_in_cart = cart_item.num_items
		var num_can_add = cart_item.num_items_limit - cart_item.num_items
		var user = AppStore.getCurrentUser()

		for (var i = 1; i <= 10; i++) {
			quantity_options.push(
					<li onClick = {this.handleQuantityChange.bind(this, i)}> <a> {i} </a> </li>
				)
		}


		var select_quantity = (
			<div className = "row">
				<div className = "btn-group">
					<div className="btn-group">
						<button type="button"
						 className="btn quantity-button dropdown-toggle vertical-button-divider"
						  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						  	<span className = "block-span">
						  		{this.state.quantity_display}
								<span className="caret"/>
						  	</span>
						  	<span className = "block-span" styles>
						  		Qty.
						  	</span>	
							
							
						</button>
						<ul className="dropdown-menu quantity-dropdown">
							{quantity_options}
						</ul>
					</div>
					<button type = "button"
						onClick = {user ? this.addToCart.bind(this) 
							: this.onNonUserClick.bind(this)} 
						className="btn add-to-cart-button ">
						<span className = "add-to-cart-text block-span">
								<b> Buy It    </b>    <br/>
							</span>
					</button>
				</div>
			</div>
		)


		var variant_options = []
		this.props.product.variants.map((variant, index) => 
					variant_options.push(
						<option value = {variant.variant_id}> {variant.variant_type} </option>
					)
			)


		


		return (
				<div >
						{ this.props.product.has_variants &&
							<div className ="form-group row row-eq-height">
								<label for = "type" 
								className = "col-md-1 col-lg-1 col-sm-1 col-form-label vcenter quantity-label">
									Type
								</label>
								<div className = "col-md-6 col-lg-6 col-sm-6">
									<select id = "type" className ="form-control"
									 onChange = {this.handleVariantChange.bind(this)}>
											{variant_options}
									</select>
								</div>
							</div>
						}

						<div className = "small-buffer"/>
						
						
						

						{select_quantity}

						
				</div>

		);
		}
}