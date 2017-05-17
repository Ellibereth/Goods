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
			variant : null
		}
	}

	handleQuantityChange (event){
		this.setState({quantity : event.target.value})
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
		  		else  {
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
	}

	onNonUserClick(){
		swal("You must sign in before you can add this to your cart!")	
	}

	render() {
		var quantity_options = []
		var num_in_cart = 0
		var cart_item = this.props.cart_item
		if (this.props.cart_item.length != 0) {
			var num_in_cart = cart_item.num_items
			var num_can_add = cart_item.num_items_limit - cart_item.num_items
			
			for (var i = 1; i <= num_can_add && i <= 20; i++){
				quantity_options.push(
						i == 1 ? <option selected value = {i}> {i} </option>  : <option value = {i}> {i} </option> 
					)
			}	
			var select_quantity = (
					<select className = "selectpicker" id = "test_id" onChange = {this.handleQuantityChange.bind(this)}>
						{quantity_options}
					</select>
				)
		}

		else {
			for (var i = 1; i <= 10; i++) {
				quantity_options.push(
						i == 1 ? <option selected value = {i}> {i} </option>  : <option value = {i}> {i} </option> 
					)
			}	
			var select_quantity = (
					<div className ="form-group row row-eq-height">
						<label className = "col-md-1 col-lg-1 col-sm-1 col-form-label vcenter">
							Qty
						</label>
						<div className = "col-md-6 col-lg-6 col-sm-6">
							<select className ="form-control"
							 onChange = {this.handleQuantityChange.bind(this)}>
						  		{quantity_options}
							</select>
						</div>
					</div>
				)
		}


		var variant_options = []
		this.props.product.variants.map((variant, index) => 
					variant_options.push(
						<option value = {variant.variant_id}> {variant.variant_type} </option>
					)
			)

		var variant_type_selector = (
				<select onChange = {this.handleVariantChange.bind(this)}>
					{variant_options}
				</select>
			)

		var user = AppStore.getCurrentUser()
		return (
				<div >
					{ user ?
					<div>
						{select_quantity}
					

						{ this.props.product.has_variants &&
						<div className = "row">
							<span className = "block-span">
								Type: {variant_type_selector}
							</span>
						</div>
						}

						<div className = "row">
							<button onClick = {this.addToCart.bind(this)} 
							className="btn add-to-cart-button">
								<span className = "add-to-cart-text block-span">
							    	<b> Buy It  </b>  <br/>
							    </span>
							</button>
						</div>

						
					</div>
					:
					<div>
						<span>
							<button onClick = {this.onNonUserClick.bind(this)} 
							className="btn add-to-cart-button">
								<div id = "add-to-cart-text">
							    	<b> Add to cart </b> 
							    </div>
							</button>
						</span>
					</div>
					}
				</div>
		);
  	}
}