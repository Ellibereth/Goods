var React = require('react');
var ReactDOM = require('react-dom');

import {Button, Grid, Row, Col} from 'react-bootstrap';
import StripeButton from './ProductPayment/StripeButton.js'
import AddToCartButton from './ProductPayment/AddToCartButton.js'
import ProductImages from './ProductImages'




export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			selected_image: null
		}
	}

	getMainImageId(product) {
		if (product == null || product.product_id == null) return null;
		if (product.images.length == 0) return null
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		if (!product.main_image) {
			var main_image_id = product.images[0].image_id
		}
		else {
			var main_image_id = product.main_image
		}
		return main_image_id
	}

	componentDidMount(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product_id
		})
		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				var main_image_id = this.getMainImageId(data.product)
				this.setState({invalid_product : false,
								 product: data.product,
				 				selected_image :main_image_id
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

	addToCart(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product_id,
			"jwt" : localStorage.jwt,
			"account_id" : AppStore.getCurrentUser()
		})
		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
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


	selectImage(image_id){
		this.setState({selected_image : image_id})
	}

	render() {
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		return (
			<div className = "container" id = "product-page-container">
				{this.state.invalid_product ?
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				:
					<Grid className = "fluid">
						<Row>
							<Col className = "text-center"  sm = {4} md = {4} lg = {4}>
								<img src= {src_base + this.state.selected_image} className = "img-responsive product-image-main"/>
							</Col>
							<Col sm = {6} md = {6} lg = {6}>
								<span className = "product-name-text"> {this.state.product.name} </span>
								<span className = "product-price-text"> 
									${this.state.product.price} 
									{/* <StripeButton product = {this.state.product}/> */}
								</span>
								<br/>
								<span className = "product-add-cart-span">
									<AddToCartButton product = {this.state.product}/>
								</span>
								<hr/>
								<span className = "product-description-text"> PRODUCT DESCRIPTION </span>
									<div className="panel-body">{this.state.product.description}</div>
								<span className = "product-manufacturer-text"> MANUFACTURER</span>
									<div className="panel-body">{this.state.product.manufacturer}</div>
								<hr/>
								<span className = "product-more-images-header"> More Images </span>
								<ProductImages selectImage = {this.selectImage.bind(this)} product = {this.state.product}/>
							</Col>
						</Row>
					</Grid>
				}	
			</div>
		)
	}
}