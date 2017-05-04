var React = require('react');
var ReactDOM = require('react-dom');

import {Col, Form, FormControl, Grid, Row, FormGroup, Button} from 'react-bootstrap';

const form_fields = ['name', 'manufacturer', 'price', 'description', 'sale_end_date', 'inventory', 'story_text', 'template']
const form_labels = ['Name', 'Manufacturer', 'Price', 'Description', "Sale End Date", 'Inventory', 'Story Text', 'Template']
const input_types = ['text', 'text', 'text', 'textarea', 'datetime-local', 'text', 'textarea']
import TextInput from '../../../Misc/Input/TextInput.js'
import UploadMarketPhoto from '../ProductAdd/UploadMarketPhoto.js'
import AdminEditPhotos from './AdminEditPhotos.js' 
import UploadStoryPhoto from '../ProductAdd/UploadStoryPhoto'


export default class AdminEditProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = this.state.product
		obj[field] = value
		this.setState({product: obj})
	}

	componentDidMount(){
		this.setState({product : this.props.product})	
	}

	componentWillReceiveProps(nextProps){
		this.setState({product : nextProps.product})
	}

	onTextSubmitPress(){
		swal({
		  title: "Ready?",
		  text: "Ready to update?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.submitTextData.bind(this)()
		}.bind(this))
	}

	submitTextData(){
		var form_data = JSON.stringify({
			"product_id" : this.state.product.product_id,
			"product" : this.state.product,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/updateProductInfo",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.setState({product : data.product})
				this.props.updateProduct.bind(this)()
				swal("Complete!", "Product successfully updated", "successi")
			}
			else {
				swal("Something went wrong!", data.error, "error")
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
		// edit text fields
		// delete / add images
		// on image add/delete reload page
		var input_forms = form_fields.map((field, index) =>
				<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.product[field]} field = {field} label = {form_labels[index]}
				input_type = {input_types[index]}/>
			)
		return (
			<div className = "container" id = "admin_edit_product">
				<div className = "row" id = "add_story">
					<UploadStoryPhoto product = {this.props.product}/>
				</div>
				
				<hr/>
					<div className = "row" id = "text_edit">
					<Form horizontal>
						{input_forms}
						<FormGroup controlId = "submit_button">
						<Col smOffset={0} sm={10}>
							<Button onClick = {this.onTextSubmitPress.bind(this)}>
							Submit!
							</Button>
						</Col>
						</FormGroup>
					</Form>
				</div>
				
				<div className = "row" id = "image_edit">
					<UploadMarketPhoto product = {this.props.product}/>
					<AdminEditPhotos getProductInformation = {this.props.getProductInformation} 
						product = {this.props.product}/>
				</div>
			</div>
		)
	}
}