var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link

import {Button, Grid, Row, Col} from 'react-bootstrap';
import ProductImages from '../../../Product/ProductImages'




export default class AdminProductPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image : null
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
		
	}

	selectImage(image_id){
		this.setState({selected_image : image_id})
	}

	componentWillReceiveProps(nextProps){
		this.setState({selected_image : this.getMainImageId(nextProps.product)})
	}

	render() {
		// keep in mind for the fade on loading
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
								<div className = "col-sm- 12 col-md-12 col-lg-12 text-center" >
									<Link to = "/"> Home </Link>
								</div>
							</div>
							<hr/>
							<div className = "row">
								<div className = "col-sm-6 col-md-6 col-lg-6" >
									<img src= {src_base + this.state.selected_image} className = "img-responsive product-image-main"/>
								</div>

								<div className = "col-sm-6 col-md-6 col-lg-6">
									<div className = "row">
										<div className = "col-md-10 col-lg-10">
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
										<div className = "col-sm-4 col-md-8 col-lg-8">
											<span className = "product-add-cart-span">
												<Button onClick = {() => swal("This is a dummy add to cart button")}>
													Add to Cart!
												</Button>
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