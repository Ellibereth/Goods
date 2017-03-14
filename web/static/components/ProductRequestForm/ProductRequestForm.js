var React = require('react');
var ReactDOM = require('react-dom');
import ProductRequestTextInput from './ProductRequestFormTextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'


var real_url = "https://whereisitmade.herokuapp.com"
var test_url = "http://0.0.0.0:5000"
const form_labels = ['What is your name?', "What is your email?", "Phone Number? (Optional)", "How much would you like to pay?", "What are you looking for?"]
const form_inputs = ["name", "email", "phone_number", "price_range", "product_description"]


export default class ProductRequestForm extends React.Component {
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
			var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: real_url  + "/addProductRequest",
				data: form_data,
				success: function(data) {

					if (!data.success) {
						alert(data.error)
					}
					else {
						console.log(data)
					}
				},
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	getTextInputs(){
		var text_inputs = []
		for (var i = 0; i < form_inputs.length; i++){
		var this_input = form_inputs[i]
			text_inputs.push(
				
			)
		}
		return text_inputs
	}

	render() {
		var text_inputs = form_inputs.map((form_input, index) =>
			<ProductRequestTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}/>
			)

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

