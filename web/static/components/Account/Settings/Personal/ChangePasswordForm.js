var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../../actions/AppActions.js';
import AppStore from '../../../../stores/AppStore.js';
import TextInput from '../../../Input/TextInput.js'
import {Grid, Form, Row, Col, FormGroup, Button, ControlLabel} from 'react-bootstrap'
const form_labels = ['New Password', "Confirm Your New Password", "Confirm Current Password"]
const form_inputs = ["password", "password_confirm", "old_password"]
const input_types = ['password', 'password', 'password']

export default class ChangePasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: "",
			password_confirm : "",
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
		  text: "Are you sure you want to change your password?",
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
		this.setState({name : current_user.name, email : current_user.email})
	}

	updatePassword(){
			var form_data = JSON.stringify({
				"password" : this.state.password,
				"password_confirm" : this.state.password_confirm,
				"old_password" : this.state.old_password,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/changePassword",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user, data.jwt)
						this.setState({
							password_confirm : "",
							password : "",
							old_password : ""
						})
						setTimeout(function() {
							browserHistory.push(`/settings`)
						}, 2000)

						swal({
						  title: "Thank you!",
						  text: "Your password has been changed! You will be redirected to settings shortly...",
						  type: "success",
						  confirmButtonText: "Ok!",
						  closeOnConfirm: true,
						})

					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	changeSettings(){
		browserHistory.push(`/updateSettings`)
	}



	submitData() {
		// first check the password
		var form_data = JSON.stringify({
			"jwt" : localStorage.jwt,
			"password" : this.state.old_password
		})
		$.ajax({
				type: "POST",
				url: "/checkPassword",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Your password was incorrect. Please try again!", "warning")
					}
					else {
						this.updatePassword.bind(this)()
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
								<Button onClick = {this.changeSettings.bind(this)}>
									Change other Settings
								</Button>
							</Col>
					</FormGroup>
					

				</Form>
			</Grid>
		)
	}
}

