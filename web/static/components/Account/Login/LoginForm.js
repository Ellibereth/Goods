var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import AppStore from '../../../stores/AppStore.js'
import TextInput from '../../Input/TextInput.js'
const form_labels = ["Email", "Password"]
const form_inputs = ["email", "password"]
const input_types = ['text', 'password']
var Link = require('react-router').Link
import AccountInput from '../../Input/AccountInput'
import {getParameterByName} from '../../Input/Util'

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			disabled: false
		}
	}

	// handle the text input changes
	onTextInputChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}


	submitData(event){
		event.preventDefault()
		this.setState({disabled : true})
			var data = {}
		for (var i = 0; i < form_inputs.length; i++){
			var key = form_inputs[i]
			data[key] = this.state[key]
		}

		var user = AppStore.getCurrentUser() 
		if (user.is_guest) {
			data['guest_jwt'] = localStorage.jwt
		} 

		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/checkLogin",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal(data.error.title, data.error.text, data.error.type)
				}
				else {
					ga('send', 'event', {
							eventCategory: 'Account',
							eventAction: 'Login',
							eventLabel: data.user.email
					});

					AppActions.addCurrentUser(data.user, data.jwt)
					if (!this.props.target){
						window.location = '/'
					}
					else {
						window.location = '/' + this.props.target
					}
				}
				this.setState({disabled : false})
			}.bind(this),
			error : function(){
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});

	}

	onKeyPress(e){
		if (e.key === 'Enter') {
			this.submitData.bind(this)(e)
		}
	}


	render() {

		var text_inputs = form_inputs.map((form_input, index) => {
			return <AccountInput 
						index = {index}
						tabindex = {index}
						onKeyPress = {this.onKeyPress.bind(this)}
						field = {form_input}
						name = {form_input}
						className="form-control input-lg" 
						type = {input_types[index]}
						onChange = {this.onTextInputChange.bind(this)}
						value = {this.state[form_input]} 
						label = {form_labels[index]}

					/>
		})

		var target = getParameterByName('target')

		return (

			<div className = "panel panel-primary account-panel">

				<div className = "panel-body account-panel-body">
					<h2 className = "account-header text-center"> Login </h2>
					<form className = "form-horizontal" onSubmit = {this.submitData.bind(this)} >
						{text_inputs}
						<div className = "form-group row">
							<div className = "col-sm-12 col-md-12 col-lg-12 text-center">
								<button className = "btn btn-default" disabled = {this.state.disabled}
								 className = "account-button" onClick = {this.submitData.bind(this)}>
									Login
								</button>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<a className = "account-notice" href = "/recoverAccount"> Forgot your password? </a>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<a className = "account-notice" href = {target ? "/register" + "?target=" + target : "/register"}>
									New to Edgar USA? Register here 
								</a>
							</div>
						</div>

					</form>
				</div>
			</div>
		)
	}
}


