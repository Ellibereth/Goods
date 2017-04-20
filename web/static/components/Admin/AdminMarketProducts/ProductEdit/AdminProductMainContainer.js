var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Grid, Row, Col} from 'react-bootstrap';
import StripeButton from '../../../Product/ProductPayment/StripeButton.js'
import AdminProductImageDisplay from './AdminProductImageDisplay.js'
import AdminEditProductInformation from './AdminEditProductInformation.js'

export default class AdminProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
	  		invalid_product: true
		}
	}

	componentDidMount(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: url + "/getMarketProductInfo",
	  	data: form_data,
	  	success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({invalid_product : false})
				this.setState({product: data.product})
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
  	}
  	updateProduct(product) {
  		console.log(this.state.product)
  		this.setState({product : product})
  	}



  render() {
	return (
	  <div className = "container" id = "product-page-container">
		{this.state.invalid_product ?
		  <h3>
			You've reached a bad product page! Click <a href = "/"> here </a> to return home.
		  </h3>

		:
			<div>
		  <Grid className = "fluid">
			<Row>
			  <Col className = "text-center"  sm = {4} md = {4} lg = {4}>
				<div className = "product-page-left "> 
				  <AdminProductImageDisplay product = {this.state.product}/>
				  <StripeButton product = {this.state.product}/>
				</div>
			  </Col>
			  <Col sm = {6} md = {6} lg = {6}>
				<span className = "product-name-text"> {this.state.product.name} </span>
				<span className = "product-price-text"> ${this.state.product.price} </span>
				<hr/>
				<span className = "product-description-text"> PRODUCT DESCRIPTION </span>
				  <div className="panel-body">{this.state.product.description}</div>
				<span className = "product-manufacturer-text"> MANUFACTURER</span>
				  <div className="panel-body">{this.state.product.manufacturer}</div>
			  </Col>
			</Row>

		  	</Grid>
			<hr/>
			<AdminEditProductInformation product = {this.state.product} updateProduct = {this.updateProduct.bind(this)}/>
		  	</div>
		} 
	  </div>
	)
  }
}