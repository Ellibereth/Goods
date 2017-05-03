var React = require('react');
var ReactDOM = require('react-dom');

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

		console.log(this.props.product)

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
						<div className = "contianer fluid">
							<div className = "row">
								<Col className = "text-center"  sm = {4} md = {4} lg = {4}>
									<img src= {src_base + this.state.selected_image} className = "img-responsive product-image-main"/>
								</Col>
								<Col sm = {6} md = {6} lg = {6}>
									<span className = "product-name-text"> {this.props.product.name} </span>
									<span className = "product-price-text"> 
										${this.props.product.price} 
										{/* <StripeButton product = {this.props.product}/> */}
									</span>
									<br/>
									<span className = "product-add-cart-span">
										{
										
										}
										<Button onClick = {() => swal("This is a dummy add to cart button")}>
											Add to Cart
										</Button>	
									</span>
									<hr/>
									<span className = "product-description-text"> Product Description </span>
										<div className="panel-body">{this.props.product.description}</div>
									<span className = "product-manufacturer-text"> Manufacturer </span>
										<div className="panel-body">{this.props.product.manufacturer}</div>
									<hr/>
									<span className = "product-more-images-header"> More Images (Click to View) </span>
									<ProductImages selectImage = {this.selectImage.bind(this)} product = {this.props.product}/>
								</Col>
							</div>
						</div>
						<div className ="row">
							<div className = "top-buffer"/>
						</div>
						<div className = "row" 
						//className = "story-image"
						 style = {story_style} id = "image_story">
					        <div className ="col-md-4 col-lg-4 col-md-offset-2 col-lg-offset-2 story-overlay-container">
								<div className = "panel panel-default story-panel">
									<div> {this.props.product.story_text} 
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