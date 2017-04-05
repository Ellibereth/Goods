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
			selected_image : -1,
			product : {}

		}
	}

	selectImage(i){
		this.setState({selected_image : i})
	}

	componentDidMount(){
		this.setState({product : this.props.product})
		var product = this.state.product
		if (! ("images" in product)) return;

		// update the selected image
		var images = product.images
		for (var i = 0; i < images.length; i++){
			if (images[i]['main_image']){
				this.setState({selected_image : i})
			}
		}
		if (this.state.selected_image == -1) {
			this.setState({selected_image : 0})
		}
	}

	componentWillReceiveProps(nextProps){
		this.setState({product : nextProps.product})
		var product = nextProps.product
		if (!("images" in product)) return;

		// update the selected image
		var images = product.images
		for (var i = 0; i < images.length; i++){
			if (images[i]['main_image']){
				this.setState({selected_image : i})
			}
		}
		if (this.state.selected_image == -1) {
			this.setState({selected_image : 0})
		}
	}

	render() {

		var product = this.state.product
		if (product == null || product.product_id == null) return <div/>;
		if (product.images.length == 0) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		var images = product.images.map((image, index) =>
				<img src = {src_base + image.image_id} height = {30} width = {30} id = {index} onClick = {this.selectImage.bind(this, index)}/>
			)

		if (this.state.selected_image == -1){
			var big_image = <div/>
		}
		else {
			var big_image_src = src_base + product.images[this.state.selected_image].image_id
			var big_image = <img src = {big_image_src} className = "product-image"/>
		}
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