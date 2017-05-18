var React = require('react');
var ReactDOM = require('react-dom');

import {Col} from 'react-bootstrap';


// props are
// function : selectImage
// dictionary : product
export default class ProductImages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}

	selectImage(image_id){
		this.props.selectImage(image_id)
	}

	render() {
		var product = this.props.product
		if (product == null || product.product_id == null) return <div/>;

		// only show the main image
		if (product.images.length == 1 ) return <div/>
		if (product.images.length == 0 ) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

		if (product.images.length == 2){
			var front_padding = 3
			var back_padding = 3
		}

		else if (product.images.length == 3) {
			var front_padding = 1;
			var back_padding = 2
		}

		else {
			var front_padding = 0;
			var back_padding = 0;
		}

		var product_images = []


	 	for (var i = 0; i < product.images.length; i++){
	 		var image = product.images[i]
	 		var this_image = (
						<div className = 
							{this.props.selected_image == image.image_id 
							?	"col-md-3 col-sm-3 col-lg-3 product-image-more-container-selected"
							:	"col-md-3 col-sm-3 col-lg-3 product-image-more-container"}>
							<img className = "img-responsive product-image-more"
							src = {src_base + image.image_id} id = {i} 
							onClick = {this.selectImage.bind(this, image.image_id)}/>
						</div>
					)
	 		if (this.props.product.main_image == image.image_id) {
	 			product_images.unshift(this_image)
	 		}
	 		else {
	 			product_images.push(this_image)
	 		}
	 	}

		product_images.unshift(
				<Col md = {front_padding} lg = {front_padding} sm = {front_padding}/>
			)

		product_images.push(
				<Col md = {back_padding} lg = {back_padding} sm = {back_padding}/>
			)
		
		return (
			<div id = "image_display" className = "row row-eq-height product-image-more-row">
				  {product_images} 	
			</div>
		)
	}
}