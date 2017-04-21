var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../../actions/AppActions.js';
import AppStore from '../../../../stores/AppStore.js';
import TextInput from '../../../Misc/Input/TextInput.js'
import {Grid, Form, Row, Col, FormGroup, Button, ControlLabel} from 'react-bootstrap'
const form_labels = ['Name', "Email", "Confirm Password"]
const form_inputs = ["name", "email", "password"]
const input_types = ['text', 'text', 'password']

export default class SettingsFormPersonal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			password : ""
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
				if (key != "password"){
					if (this.state[key] && this.state[key] != "") {
					new_settings[key] = this.state[key]
					}	
				}
			}
			var form_data = JSON.stringify({
				"email" : AppStore.getCurrentUser().email,
				"new_settings" : new_settings,
				"password" : this.state.password,
				"jwt" : localStorage.jwt
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
						AppActions.addCurrentUser(data.user, data.jwt)
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
	updatePassword() {
		browserHistory.push(`/changePassword`)
	}


	onSubmitPress() {
		// first check the password
		var form_data = JSON.stringify({
			"email" : AppStore.getCurrentUser()['email'],
			"password" : this.state.password
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
			return (<TextInput colSize = {"8"} onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]}/>)
		})

		return (
			<Grid>
				<Form horizontal>
					<ControlLabel> <span id = "settings-header"> You must confirm your password to make any changes to your account </span> </ControlLabel>
					<br/>
					{text_inputs}
					

					<FormGroup controlId = "update_password">
						
							<Col sm = {4} lg = {4} md = {4}>
								<Button onClick = {this.onSubmitPress.bind(this)}>
									Submit!
								</Button>
							</Col>
							<Col pullRight className = "text-right" sm = {4} lg = {4} md = {4}>
								<Button onClick = {this.updatePassword.bind(this)}>
									Click to Update Password!
								</Button>
							</Col>
					</FormGroup>
					

				</Form>
			</Grid>
		)
	}
}

