var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap';





export default class AdminActivateProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	activateProduct(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/activateProduct",
		  data: form_data,
		  success: function(data) {

		  	location.reload()
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}


	deactivateProduct(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/deactivateProduct",
		  data: form_data,
		  success: function(data) {

		  	location.reload()
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	onDeactivatePress(){
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to take this item off the market? Don't worry, it will still be saved.",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.deactivateProduct.bind(this)()
		}.bind(this))
	}

	onActivatePress(){
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to put this product on the market?", 
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.activateProduct.bind(this)()
		}.bind(this))
	}

	componentDidMount(){
		// this.getProductInformation.bind(this)()
	}

	getActiveText(product){
		if (!product){
			return "";
		}
		else if (product.active){
			return "This product is active"
		}
		else {
			return "This product is inactive"
		}
	}

	render() {
		var text = this.getActiveText(this.props.product)
		return (
			<div className = "container">
				<div className = "row">
					<h2> {text} </h2>
				</div>
				<div className = "row">
					<Button onClick = {this.onDeactivatePress.bind(this)}> Deactivate </Button>
					<Button onClick = {this.onActivatePress.bind(this)}> Activate </Button>
				</div>
			</div>
		);
	}
}