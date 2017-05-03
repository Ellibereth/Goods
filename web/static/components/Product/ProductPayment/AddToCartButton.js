var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import AppStore from '../../../stores/AppStore.js'
import {Button} from 'react-bootstrap'


// takes the price of the good as prop for now
export default class AddToCartButton extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			quantity : 1,
		}
	}

	handleQuantityChange (event){
		this.setState({quantity : event.target.value})
	}

	addToCart(product){
		$.ajax({
		  type: "POST",
		  url: "/addItemToCart",
		  data: JSON.stringify({
		  	"quantity" : this.state.quantity,
		  	"product_id" : this.props.product.product_id, 
		  	"account_id" : AppStore.getCurrentUser().account_id,
		  	"jwt" : localStorage.jwt
		  }),
		  success: function(data) {
		  		if (data.success){
		  			swal("Succesfully added to your cart!")
		  			this.props.refreshUserInformation.bind(this)()
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
					<select onChange = {this.handleQuantityChange.bind(this)}>
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
					<select onChange = {this.handleQuantityChange.bind(this)}>
						{quantity_options}
					</select>
				)
		}
		
		
		var user = AppStore.getCurrentUser()
		return (
				<div>{ user ?

					<span>
						<div>
							<span> Quantity:  
								{select_quantity}
							</span>
						</div>
						<button onClick = {this.addToCart.bind(this)} className="btn btn-xlarge btn-primary">
							<div id = "buy_now_button_text">
						    	<b> Add to cart </b> 
						    </div>
						</button>
						<div>
							(Curretly {num_in_cart} in cart)
						</div>
						
					</span>
					:
					<span>
						<button onClick = {this.onNonUserClick.bind(this)} className="btn btn-xlarge btn-primary">
							<div id = "buy_now_button_text">
						    	<b> Add to cart </b> 
						    </div>
						</button>
					</span>
					}
				</div>
		);
  	}
}