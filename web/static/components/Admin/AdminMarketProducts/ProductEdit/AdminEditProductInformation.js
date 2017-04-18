var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Col, Form, FormControl, Grid, Row, FormGroup, Button} from 'react-bootstrap';

const form_fields = ['name', 'manufacturer', 'price', 'description', 'sale_end_date']
const form_labels = ['Name', 'Manufacturer', 'Price', 'Description', "Sale End Date"]
const input_types = ['text', 'text', 'text', 'textarea', 'datetime-local']
import TextInput from '../../../Misc/Input/TextInput.js'
import UploadMarketPhoto from '../ProductAdd/UploadMarketPhoto.js'
import AdminEditPhotos from './AdminEditPhotos.js' 


export default class AdminEditProductInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
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
			"product_id" : this.props.product_id,
			"product" : this.state.product,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: url + "/updateProductInfo",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.setState({product : data.product})
				this.props.updateProduct.bind(this)(data.product)
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
			<Grid id = "admin_edit_product">
				<Row id = "text_edit">
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
				</Row>
				<Row id = "image_edit">
					<UploadMarketPhoto product = {this.props.product}/>
					<AdminEditPhotos updateProduct = {this.props.updateProduct} 
						product = {this.props.product}/>
				</Row>
			</Grid>
		)
	}
}