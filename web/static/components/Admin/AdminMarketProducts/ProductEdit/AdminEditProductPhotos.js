var React = require('react');
var ReactDOM = require('react-dom');

import {Grid, Row, Col, Button} from 'react-bootstrap';
import AdminProductImageDisplay from './AdminProductImageDisplay.js'
var browserHistory = require('react-router').browserHistory;

export default class AdminEditProductPhotos extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		this.setState({product : this.props.product})
	}

	setMainPhoto(image_id, index){
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"image_id" : image_id,
			"jwt" : localStorage.jwt
		})

		$.ajax({
			type: "POST",
			url: "/setMainProductPhoto",
			data: form_data,
			success: function(data) {
				var obj = this.props.product
				for (var i = 0; i < obj.images.length; i++){
					obj.images[i].main_image = false
				}
				obj.images[index].main_image = true
				this.props.getProductInformation(obj)
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
			});
	}

	deletePhoto(image_id, index){
		// ajax to delete photo 
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"image_id" : image_id,
			"jwt" : localStorage.jwt
		})

		$.ajax({
			type: "POST",
			url: "/deleteProductPhoto",
			data: form_data,
			success: function(data) {
				var obj = this.props.product
				obj.images.splice(index, 1);
				this.props.getProductInformation(obj)
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
			});
	}

	getProductInformation(){
		this.props.getProductInformation.bind(this)()
	}


	render() {
		// image display
		// select as main
		// delete button
		var product = this.props.product
		if (product == null || product.product_id == null) return <div/>;
		if (product.images.length == 0) return <h4> No images are listed for this product </h4>
		// something better needs to be done about bad pages, but I'll figure something out soon
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

		var images = product.images.map((image, index) => {
				var label = (image.image_id == product.main_image) ? "Main Image" : "Not Main"
				return (	
					<div className="item col-lg-3 col-md-3 col-sm-3">
						<div className = "row">
							<h3> {label} </h3>
						</div>
						<div className = "row">
							<img src= {src_base + image.image_id} id = {index} className = "admin-product-image"/>
						</div>
						<div className = "row">
							<Button onClick = {this.deletePhoto.bind(this, image.image_id, index)}> Delete Photo </Button>
						</div>
						<div className = "row">
							<Button onClick = {this.setMainPhoto.bind(this, image.image_id, index)}> Set as Main Photo </Button>
						</div>
					</div>
				)
			})
		


		return (
			<div>
				<h3> This Products Images </h3>
				<div className = "row">
					{images}
				</div>
			</div>
		)
}
}