var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import AppStore from '../../../stores/AppStore.js'
import {Button} from 'react-bootstrap'
var Config = require('Config')
var url = Config.serverUrl


// takes the price of the good as prop for now
export default class AddToCartButton extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {

		}
	}
	addToCart(product){
		$.ajax({
		  type: "POST",
		  url: url + "/addItemToCart",
		  data: JSON.stringify({
		  	"product_id" : this.props.product.product_id, 
		  	"account_id" : AppStore.getCurrentUser().account_id,
		  	"jwt" : localStorage.jwt
		  }),
		  success: function(data) {
		  	 	swal("Succesfully added to your cart!")
			},
		  error : function(){
				console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		// var user = AppStore.getCurrentUser()
		return (
			<Button onClick = {this.addToCart.bind(this)}> Add To Cart </Button>
		);
  	}
}