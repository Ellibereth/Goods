var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import TextInput from '../../Input/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ['Name', "Email", "Password", "Confirm Password"]
const form_inputs = ["name", "email", "password", "password_confirm"]
const input_types = ['text', 'text', 'password', 'password']

export default class RegisterAccountForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			password: "",
			password_confirm : "",
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
		  title: "Ready?",
		  text: "Is all your information correct?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
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
				url: "/registerUserAccount",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error in your submission! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						AppActions.addCurrentUser(data.user, data.jwt)
						swal({
							title: "Thank you!", 
							text : "Your account has been created. You should receive a confirmation email shortly",
							type: "success"},
							function () {
								browserHistory.push("/")
							}.bind(this)
						)
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
		if (e.key === 'Enter') {
      		this.onSubmitPress.bind(this)()
    	}
	}

	render() {

		var text_inputs = form_inputs.map((form_input, index) => {
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]} index = {index}
				onKeyPress = {this.onKeyPress.bind(this)}
				/>)
		})

		return (
			<Form onSubmit = {this.onSubmitPress.bind(this)} horizontal>
				{text_inputs}
				<FormGroup controlId = "submit_button">
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

