var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import TextInput from '../../Input/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ["Email", "Password"]
const form_inputs = ["email", "password"]
const input_types = ['text', 'password']
var Link = require('react-router').Link
import AccountInput from '../AccountInput'

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


	submitData(){
		this.setState({disabled : true})
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
					swal("Sorry!", "It seems there was an error in your submission. Please try again!", "warning")
				}
				else {
					AppActions.addCurrentUser(data.user, data.jwt)
					if (!this.props.target){
						browserHistory.push('/')
					}
					else {
						browserHistory.push('/' + this.props.target)
					}
				}
				this.setState({disabled : false})
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
			this.submitData.bind(this)()
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

		return (
			<div className = "panel panel-primary account-panel">
				<div className = "panel-heading account-panel-heading">
					<div className = "text-center "> Login </div>
				</div>
				<div className = "panel-body account-panel-body">
					<Form onSubmit = {this.submitData.bind(this)} horizontal>
						{text_inputs}
						<div className = "form-group row">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Button disabled = {this.state.disabled}
								 className = "account-button" onClick = {this.submitData.bind(this)}>
									Login
								</Button>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Link to = "/recoverAccount"> Forgot your password? </Link>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Link to = "/register"> New to Edgar USA? Register here </Link>
							</div>
						</div>

					</Form>
				</div>
			</div>
		)
	}
}


