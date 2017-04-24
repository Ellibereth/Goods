var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';


export default class ProductImages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			selected_image : null

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
		if (product.images.length == 0) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		var product_images = product.images.map((image, index) => {
				console.log(image)
				return (
						<img className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 img-responsive product-image-more"
						src= {src_base + image.image_id} id = {index} 
						onClick = {this.selectImage.bind(this, image.image_id)}/>
					)
			})

		
		return (
			<div id = "image_display" className = "row row-eq-height">
				  {product_images} 	
			</div>
		)
	}
}