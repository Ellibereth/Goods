var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';


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
		if (product.images.length == 0) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		var product_images = product.images.map((image, index) => {
				return (
						<div className = "col-md-3 col-sm-3 col-lg-3 product-image-more-container">
							<img className = "img-responsive product-image-more"
							src= {src_base + image.image_id} id = {index} 
							onClick = {this.selectImage.bind(this, image.image_id)}/>
						</div>
					)
			})

		
		return (
			<div id = "image_display" className = "row row-eq-height product-image-more-row">
				  {product_images} 	
			</div>
		)
	}
}