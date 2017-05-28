var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import TextInput from '../../Input/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ['Name', "Email", "Password", "Confirm Password"]
const form_inputs = ["name", "email", "password", "password_confirm"]
const input_types = ['text', 'text', 'password', 'password']
var Link = require('react-router').Link

export default class RegisterAccountForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			password: "",
			password_confirm : "",
			disabled: false
		}
	}

	// handle the text input changes
	onTextInputChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	onSubmitPress(){
		swal({
			title: "Ready?",
			text: "Is all your information correct?",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			cancelButtonText: "No",
			closeOnConfirm: false,
			closeOnCancel: true
		},
		function () {
			this.props.setLoading(true)
			setTimeout(function (){
				this.submitData.bind(this)()
			}.bind(this),100)
			swal.close()
		}.bind(this))
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
				url: "/registerUserAccount",
				data: form_data,
				success: function(data) {
					this.props.setLoading(false)
					if (!data.success) {
						swal({
							title : data.error,
							text: "Please try again",
							type: "warning"
						})
					}
					else {

						AppActions.addCurrentUser(data.user, data.jwt)
						swal({
							title: "Thank you", 
							text : "Your account has been created. You should receive a confirmation email shortly",
							type: "success"},
							function () {
								browserHistory.push("/")
							}.bind(this)
						)

					}
					
					
					this.setState({disabled : false})
				}.bind(this),
				error : function(){
					console.log("error")
					this.setState({disabled : false})
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

	generateInput(label, field, index){
		return (
			<div className="form-group row">
				<div className="col-lg-12 col-md-12 col-sm-12">
					<input 
						tabindex = {index}
						onKeyPress = {this.onKeyPress.bind(this)}
						field = {field}
						name = {field}
						className="form-control input-lg" type= {input_types[index]}
						onChange = {this.onTextInputChange.bind(this)}
						value = {this.state[field]} 
						placeholder = {label}
						/>
				</div>
			</div>
		)
	}

	render() {

		var text_inputs = form_inputs.map((form_input, index) => {
			return this.generateInput(form_labels[index], form_input, index)
		})

		return (
			<div className = "panel panel-primary account-panel">
				<div className = "panel-heading account-panel-heading">
					<div className = "text-center "> Register Today </div>
				</div>
				<div className = "panel-body account-panel-body">
					<Form onSubmit = {this.onSubmitPress.bind(this)} horizontal>
						{text_inputs}
						<div className = "form-group row">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Button disabled = {this.state.disabled}
								 className = "account-button" onClick = {this.onSubmitPress.bind(this)}>
									Submit
								</Button>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Link to = "/terms"> By registering you agree to Edgar USA's terms of service and privacy policy </Link>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Link to = "/login"> Already have an account? </Link>
							</div>
						</div>

					</Form>
				</div>
			</div>
		)
	}
}

