var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Misc/Input/TextInput.js'
import AppActions from '../../../actions/AppActions.js';
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ["Email", "Password"]
const form_inputs = ["email", "password"]

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

	onLoginAttempPress(){
			var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: url  + "/checkLogin",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error in your submission! Please try again!", "warning")
					}
					else {
						AppActions.addCurrentUser(data.user_info)
						// returns to whatever page they were on? 
						// or should we just go to the home page?
						browserHistory.pop()
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
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_type}/>)
		})

		return (
			<Form horizontal>
				{text_inputs}
				<FormGroup controlId = "submit_button">
				<Col smOffset={0} sm={10}>
					<Button onClick = {this.onSubmitPress.bind(this)}>
					Log In!
					</Button>
				</Col>
				</FormGroup>
			</Form>
		)
	}
}

