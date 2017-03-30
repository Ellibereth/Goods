var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {} from 'react-bootstrap';
import ProductImageDisplay from './ProductImageDisplay.js'

export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_image : 0
		}
	}

	selectImage(i){
		this.setState({selected_image : i})
	}

	render() {
		var product = this.props.product
		if (product == null || product.product_id == null) return <div/>;
		// something better needs to be done about bad pages, but I'll figure something out soon
		var images = []
		for (var i = 0; i < product.num_images; i++){
			var src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" + product.product_id + "_" + i
			images.push(
				<img src = {src} height = {30} width = {30} id = {i} onClick = {this.selectImage.bind(this, i)}/>
			)
		}

		var big_image_scr = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" + product.product_id + "_" + this.state.selected_image
		var big_image = <img src = {big_image_scr} className = "product-image"/>
		console.log(product)
		return (
			<div>
				<div>
					{big_image}
				</div>
				<div>
					{images}
				</div>
			</div>
		)
	}
}