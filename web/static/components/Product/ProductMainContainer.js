var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import ProductImages from './ProductImages'
import AppStore from '../../stores/AppStore'
import AddToCartButton from './ProductPayment/AddToCartButton.js'



export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image : null,
			items : [],
			price : null,
			cart_item : [],
			is_loading : true
		}
	}


	startLoading(){
		$('#product-page-container').addClass("faded")
	}

	endLoading(){
		$('#product-page-container').removeClass("faded");
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
		this.refreshUserInformation.bind(this)()
	}

	selectImage(image_id){
		this.setState({selected_image : image_id})
	}

	componentWillReceiveProps(nextProps){
		this.setState({selected_image : this.getMainImageId(nextProps.product)})
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
							if (data.cart.items[i].product_id == this.props.product.product_id){
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


	render() {
		// keep in mind for the fade on loading
		// this wasn't working last I checked
		// if (this.props.is_loading){
		// 	this.startLoading()
		// }
		// else {	
		// 	this.endLoading()
		// }

		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		if (this.props.is_loading){
			return <div/>
		}

		var src_story_base = "https://s3-us-west-2.amazonaws.com/storyphotos/"
		var STORY_PHOTO_SRC = src_story_base +  this.props.product.story_image_id
		var story_style = {
			backgroundImage : "url(" + STORY_PHOTO_SRC + ")",
			maxHeight : "700px",
			height : "700px",
			backgroundRepeat: "no-repeat",
			backgroundSize: "100% 100%"
		}

	
		
		return (
			<div className = "" id = "product-page-container">
				{this.props.invalid_product ?
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>
				:
					<div>
						<div className = "container-fluid">
							<div className = "row">
								<div className = "col-sm-12 col-md-12 col-lg-12 text-center" >
									<Link to = "/"> Home </Link>
								</div>
							</div>
							<hr/>
							<div className = "row">
								<div className = "col-sm-6 col-md-6 col-lg-6 text-center" >
									<img src= {src_base + this.state.selected_image} className = "img-responsive product-image-main"/>
								</div>

								<div className = "col-sm-6 col-md-6 col-lg-6">
									<div className = "row">
										<div className = "col-sm-10 col-md-10 col-lg-10">
											<span className = "product-name-text">
												{this.props.product.name} 
											</span>
										</div>
									</div>
									<hr/>
									<div className = "row">
										<div className = "col-sm-10 col-md-10 col-lg-10">
											{this.props.product.description}
										</div>
									</div>
									<hr/>									
									<div className = "row product-description-collapse-preview" data-toggle="collapse" data-target="#more_info_dropdown">
										<div className = "col-sm-6 col-md-6 col-lg-6">
											More Information
										</div>	
										<div className = "col-sm-6 col-md-6 col-lg-6">
											<span className = "glyphicon glyphicon-chevron-down pull-right"/>
										</div>	
									</div>
									<div className = "top-buffer"/>
									<div className="row" >
										<div className = "col-sm-12 col-md-12 col-lg-12">
											<div className = "collapse" id = "more_info_dropdown">
												<div className = "card">
													<div className = "card-block">
														<span> Manufacturer : {this.props.product.manufacturer} </span> <br/>
														<span> Inventory Remaining : {this.props.product.inventory} </span> <br/>
														<span> Category : {this.props.product.category} </span> <br/>
													</div>
												</div>
											</div>
										</div>
									</div>

									
									<hr/>
									<div className = "row">
										<div className = "col-sm-4 col-md-4 col-lg-4">
											<span className = "product-price-text"> 
												${this.props.product.price} 
											</span>
										</div>
										<div className = "col-sm-8 col-md-8 col-lg-8">
											<span className = "product-add-cart-span">
												<AddToCartButton cart_item = {this.state.cart_item}
												refreshUserInformation = {this.refreshUserInformation.bind(this)}
												product = {this.props.product}/>
											</span>
										</div>
									</div>
									
									<hr/>
									<div className = "row">
										<div className = "col-sm-10 col-md-10 col-lg-10">
											<span className = "product-more-images-header"> More Images (Click to View) </span>
										</div>
										<div clasName = "top-buffer"/>
									</div>
									<ProductImages selectImage = {this.selectImage.bind(this)} product = {this.props.product}/>
								</div>
							</div>
						</div>
						<div className ="row">
							<div className = "top-buffer"/>
						</div>
						<div className = "row" 
						//className = "story-image"
						 style = {story_style} id = "image_story">
							<div className ="col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 story-overlay-container">
								<div className = "panel panel-default story-panel">
									<div> 
										{this.props.product.story_text} 
									</div>
								</div>
							</div>
						</div>
					</div>

				}	
			</div>
		)
	}
}