var React = require('react');
var ReactDOM = require('react-dom');
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
import TextInput from '../TextInput/TextInput.js'
const form_inputs = ['name', 'description', 'manufacturer', 'brand', 'price', 'category']
const form_labels = ["Product Name", "Product Description", "Manufacturer", "Brand", "Price", "Category"]
var Config = require('Config')
var url = Config.serverUrl

export default class AddProductForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			phone_number : "",
			price_range: "",
			product_description : "",
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onSubmitPress(){
		swal({
		  title: "Confirm",
		  text: "Do you really want to show this product on the market?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.submitData.bind(this)()
		}.bind(this))
	}

	submitData(){
			var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: url  + "/addMarketProduct",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong!", "warning")
					}
					else {
						this.props.toggleAddProductModal()
						swal("Nice man!", "You just added this product to the market"
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
		var text_inputs = form_inputs.map((form_input, index) => {
			var input_type = form_input == "description" ? "textarea" : "text"
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_type}/>
			)
		})

		return (
			<Form horizontal>
				{text_inputs}
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

