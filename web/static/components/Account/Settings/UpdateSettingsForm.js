var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import AppStore from '../../../stores/AppStore.js';
import TextInput from '../../Misc/Input/TextInput.js'
import {Form, Col, FormGroup, Button, ControlLabel} from 'react-bootstrap'
const form_labels = ['Name', "Email", "New Password" , "Confirm New Password", "Confirm Old Password"]
const form_inputs = ["name", "email", "new_password" , "new_password_confirm", "old_password"]
const input_types = ['text', 'text', 'password', 'password', 'password']

export default class SettingsFormPersonal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			new_password: "",
			new_password_confirm : "",
			old_password : ""
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

	componentDidMount(){
		var current_user = AppStore.getCurrentUser()
		this.setState({name : current_user.name})
		this.setState({email : current_user.email})
	}

	updateSettings(){
			var new_settings = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				if (key != "old_password"){
					if (this.state[key] && this.state[key] != "") {
					new_settings[key] = this.state[key]
					}	
				}
			}
			var form_data = JSON.stringify({
				"user" : AppStore.getCurrentUser(),
				"new_settings" : new_settings
			})
			$.ajax({
				type: "POST",
				url: url  + "/updateSettings",
				data: form_data,
				success: function(data) {
					console.log(data)
					if (!data.success) {
						swal("Sorry!", "It seems there was an error in your submission! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user)
						swal({title: "Thank you!", text : "Your changes have been made",type: "success"})
					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	onSubmitPress() {
		// first check the password
		var form_data = JSON.stringify({
			"email" : AppStore.getCurrentUser()['email'],
			"password" : this.state.old_password
		})
		$.ajax({
				type: "POST",
				url: url  + "/checkLogin",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Your password was incorrect. Please try again!", "warning")
					}
					else {
						this.updateSettings.bind(this)()
						// swal(title: "Thank you!", text : "Your changes have been made",type: "success")
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
				input_type = {input_types[index]}/>)
		})

		return (
			<Form horizontal>
				<ControlLabel> <h2> You must confirm your password to make any changes to your account </h2> </ControlLabel>
				<br/>
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

