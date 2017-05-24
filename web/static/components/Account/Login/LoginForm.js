var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput.js'
import AppActions from '../../../actions/AppActions.js';
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ["Email", "Password"]
const form_inputs = ["email", "password"]
const input_types = ['text', 'password']

export default class RegisterAccountForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onLoginAttemptPress(){
		var data = {}
		for (var i = 0; i < form_inputs.length; i++){
			var key = form_inputs[i]
			data[key] = this.state[key]
		}
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/checkLogin",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal("Sorry!", "It seems there was an error in your submission! " + data.error + ". Please try again!", "warning")
				}
				else {
					AppActions.addCurrentUser(data.user, data.jwt)
					browserHistory.push('/')
				}
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			this.onLoginAttemptPress.bind(this)()
		}
	}

	render() {
		var input_type = "text"
		var text_inputs = form_inputs.map((form_input, index) => {
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]} index = {index}
				onKeyPress = {this.onKeyPress.bind(this)}
				/>)
		})

		return (
			<Form onSubmit = {this.onLoginAttemptPress.bind(this)} horizontal>
				{text_inputs}
				<FormGroup controlId = "submit_button">
				<Col smOffset={0} sm={10}>
					<Button onClick = {this.onLoginAttemptPress.bind(this)}>
						Log In!
					</Button>
				</Col>
				</FormGroup>
			</Form>
		)
	}
}

