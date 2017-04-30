var React = require('react');
var ReactDOM = require('react-dom');

import {Button, Grid, Row, Col} from 'react-bootstrap';
import StripeButton from './ProductPayment/StripeButton.js'
import AddToCartButton from './ProductPayment/AddToCartButton.js'
import ProductImages from './ProductImages'
import AppStore from '../../stores/AppStore'



export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			selected_image: null,
			items : [],
			price : null,
			cart_item : [],
			is_loading : true

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
		this.initializeProductInformation.bind(this)()
		this.refreshUserInformation.bind(this)()
		
	}

	initializeProductInformation(){
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
				this.setState({
								invalid_product : false,
								product: data.product,
				 				selected_image :main_image_id
				 			})
			}
			this.setState({is_loading : false})
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	refreshUserInformation() {
		// this.setState({is_loading : true})
		$('#product-page-container').addClass("faded");
			var form_data = JSON.stringify({
			"account_id" : AppStore.getCurrentUser().account_id,
			"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/getCheckoutInformation",
				data: form_data,
				success: function(data) {
					if (data.success) {
						this.setState({
							items: data.cart.items, 
							price : data.cart.price,
						})
						for (var i = 0; i < data.cart.items.length; i++){
							if (data.cart.items[i].product_id == this.state.product.product_id){
								this.setState({cart_item : data.cart.items[i]})
							}
						}		
					}
					else {
						console.log("an error")
					}
				$('#product-page-container').removeClass("faded");
				this.setState({is_loading : false})
				}.bind(this),
				error : function(){
					console.log("an internal server error")
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
		if (this.state.is_loading){
			return <div/>
		}

		var STORY_PHOTO_SRC = "https://c.o0bg.com/rf/image_960w/Boston/2011-2020/2017/01/24/BostonGlobe.com/Metro/Images/davis_brady_2002_super_bowl.jpg"

		var story_style = {
			backgroundImage : "url(" + STORY_PHOTO_SRC + ")",
			backgroundSize : "cover",
			maxHeight : "700px",
			height : "700px"
		}

	
		
		return (
			<div className = "faded" id = "product-page-container">
				{this.state.invalid_product ?
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				:
					<div>
						<div className = "contianer fluid">
							<div className = "row">
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
										<AddToCartButton cart_item = {this.state.cart_item}
										refreshUserInformation = {this.refreshUserInformation.bind(this)}
										product = {this.state.product}/>
									</span>
									<hr/>
									<span className = "product-description-text"> Product Description </span>
										<div className="panel-body">{this.state.product.description}</div>
									<span className = "product-manufacturer-text"> Manufacturer </span>
										<div className="panel-body">{this.state.product.manufacturer}</div>
									<hr/>
									<span className = "product-more-images-header"> More Images (Click to View) </span>
									<ProductImages selectImage = {this.selectImage.bind(this)} product = {this.state.product}/>
								</Col>
							</div>
						</div>
						<div className ="row">
							<div className = "top-buffer"/>
						</div>
						<div className = "row" style = {story_style} id = "image_story">

							
					        <div className ="col-md-6 col-lg-6 col-md-offset-2 col-lg-offset-2 story-overlay-container">
								<div className = "panel panel-default story-panel">
									<div> This is the story all about how great this product is. </div>
									<div> Proudly made in America! </div>
									<div> A sure buy! </div>
								</div>
							</div>
						</div>
					</div>

				}	
			</div>
		)
	}
}