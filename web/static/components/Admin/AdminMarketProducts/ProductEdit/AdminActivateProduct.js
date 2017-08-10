var React = require('react');
var ReactDOM = require('react-dom');
import {AlertMessages} from '../../../Misc/AlertMessages'




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
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	onDeactivatePress(){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
		function () {
			this.deactivateProduct.bind(this)()
		}.bind(this))
	}

	onActivatePress(){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
		function () {
			this.activateProduct.bind(this)()
		}.bind(this))
	}

	componentDidMount(){
		// this.getProductInformation.bind(this)()
	}

	getActiveText(product){
		var url = '/eg/' + product.product_id
		if (!product){
			return "";
		}
		else if (product.active){
			return <h2> {"This product is active at url "} <a href=  {url}> {url} </a> </h2>
		}
		else {
			return <h2> {"This product is inactive but would have url "} <a href=  {url}> {url} </a> </h2>
		}
	}

	render() {
		var text = this.getActiveText(this.props.product)
		return (
			<div className = "container">
				<div className = "row">
					{text} 
				</div>
				<div className = "row">
					<button type = "button" className = "btn btn-default" onClick = {this.onDeactivatePress.bind(this)}> Deactivate </button>
					<button type = "button" className = "btn btn-default" onClick = {this.onActivatePress.bind(this)}> Activate </button>
				</div>
			</div>
		);
	}
}