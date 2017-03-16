var React = require('react');
var ReactDOM = require('react-dom');
import TextInput from '../TextInput/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'


var real_url = "https://whereisitmade.herokuapp.com"
var test_url = "http://0.0.0.0:5000"
const form_labels = ['What is your name?', "What is your email?", "What should we know?"]
const form_inputs = ["name", "email", "feedback"]


export default class ProductRequestForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			feedback: ""
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
				url: test_url  + "/addFeedback",
				data: real_url,
				success: function(data) {

					if (!data.success) {
						alert(data.error)
					}
					else {
						alert("thank you for the submission!")
					}
				},
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			var input_type = (form_input == "feedback") ? "textarea" : "text"
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_type}/>)
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

