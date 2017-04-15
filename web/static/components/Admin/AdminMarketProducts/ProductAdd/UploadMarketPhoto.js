var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Form, Col, FormGroup, Button} from 'react-bootstrap'

export default class ProductRequestForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image_data : ""
		}
	}


	onSubmitPress(){
		swal({
		  title: "Confirm",
		  text: "Are you ready to submit this photo?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.uploadImage.bind(this)()
		}.bind(this))
	}
	handleImageChange(product_id) {
		var input_id = product_id + "_upload"
		// tried jquery but got a little messed up
		// also couldn't figure out how to use states to do it
		// with event.target.value just got the URL and couldn't get image data from it
		var file = document.getElementById(input_id).files[0];
		var fr = new FileReader();
		fr.onload = function(e){
			var data = e.target.result
			// we trim this to get just the image data
			// not the headers 
    		var trim_image_data = data.split(',')[1]
			this.setState({image_data : trim_image_data})
		}.bind(this)
		//fr.readAsText(file);
		fr.readAsDataURL(file);
	}

	uploadImage(){
			var data = {
				"image_data" : this.state.image_data,
				"product_id" : this.props.product.product_id
			}
			
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: url  + "/uploadMarketProductImage",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong", "warning")
					}
					else {
						swal("Thank you!", "Image uploaded!"
							, "success")
					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	render() {
		var product = this.props.product
		return (
			<Form horizontal>
				<div className="col-sm-4">
			  		Upload a photo!
		  		</div>
				<input type = "file" placeholder="Image" id= {product.product_id + "_upload"} className="form-control"
				accept="image/*" 
				onChange = {() => this.handleImageChange.bind(this)(product.product_id)} />
				<FormGroup controlId = "submit_buton">
				<Col smOffset={0} sm={10}>
					<Button onClick = {this.onSubmitPress.bind(this)}>
						Submit!
					</Button>
				</Col>
				</FormGroup>
			</Form>
		)
	}
}

