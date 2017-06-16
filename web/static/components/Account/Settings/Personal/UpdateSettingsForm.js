var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../../actions/AppActions.js';
import AppStore from '../../../../stores/AppStore.js';
import TextInput from '../../../Input/TextInput.js'
const form_labels = ['Name', "Email", "Confirm Password"]
const form_inputs = ["name", "email", "password"]
const input_types = ['text', 'text', 'password']

const required_input = ["password"]

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

	onSubmitPress(event){
		event.preventDefault()
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
		function (isConfirm) {
			if (isConfirm){
				this.submitData.bind(this)()				
			}
			swal.close()
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
					new_settings[key] = this.state[key]
				}
			}

			var form_data = JSON.stringify({
				"new_settings" : new_settings,
				"password" : this.state.password,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/updateSettings",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal(data.error.title, data.error.text , data.error.type)
					}
					else {
						AppActions.removeCurrentUser()
						AppActions.addCurrentUser(data.user, data.jwt)
						this.setState({
							name : data.user.name,
							email : data.user.email,
				 			password : ""
						})
						// reloads in 1 second
						setTimeout(function() {
							window.location = `/settings`
						}, 2000)

						swal({
						  title: "Thank you!",
						  text: "Your changes have been saved! You will be returned to settings shortly...",
						  type: "success",
						  confirmButtonText: "Ok!",
						  closeOnConfirm: true,
						})
					
					}
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'updateSettings',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	updatePassword(event) {
		event.preventDefault()
		window.location = `/changePassword`
	}


	submitData() {
		// first check the password
		var form_data = JSON.stringify({
			"jwt" : localStorage.jwt,
			"password" : this.state.password
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
						this.updateSettings.bind(this)()
						// swal(title: "Thank you!", text : "Your changes have been made",type: "success")
					}
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'checkPassword',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});

	}

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			if (required_input.indexOf(form_input) > -1) {
				var required = true;
			}
			else {
				var required = false
			}
			return (<TextInput colSize = {"8"} onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]}
				required = {required}/>
			)
		})

		return (
				<form onSubmit = {this.onSubmitPress.bind(this)} className = "form-horizontal" >
					<br/>
					{text_inputs}
					

					<div className = "form-group">
						
							<div className = "col-sm-4 col-md-4 col-lg-4">
								<button className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
									Submit!
								</button>
							</div>
							<div className = "col-sm-4 col-md-4 col-lg-4 text-right">
								<button className = "btn btn-default" onClick = {this.updatePassword.bind(this)}>
									Click to change password
								</button>
							</div>
					</div>
					

				</form>
		)
	}
}

