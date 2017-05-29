var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions.js';
import TextInput from '../../Input/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ['Name', "Email", "Password", "Confirm Password"]
const form_inputs = ["name", "email", "password", "password_confirm"]
const input_types = ['text', 'text', 'password', 'password']
const popover_text = [null, null, "Passwords must be at least 6 characters" , null]
var Link = require('react-router').Link
import AccountInput from '../AccountInput'

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
		if (!this.state.disabled) {
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
	
	}

	onKeyPress(e){
		if (e.key === 'Enter') {
			this.onSubmitPress.bind(this)()
		}
	}

	componentDidMount(){
		$(document).ready(function(){
			$('[data-toggle="popover"]').popover(); 
		});

		
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
						popover_text = {popover_text[index]}
					/>
		})

		return (
			<div className = "panel panel-primary account-panel">
				<div className = "panel-body account-panel-body">
					<h2 className = "account-header"> Create Account </h2>
					<Form onSubmit = {this.onSubmitPress.bind(this)} horizontal>
						{text_inputs}
						<div className = "form-group row">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								<Button disabled = {this.state.disabled}
								 className = "account-button" onClick = {this.onSubmitPress.bind(this)}>
									Sign Up
								</Button>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								By creating an account you agree to Edgar USA's 
								<Link to = "/terms"> {"Terms of Service"} </Link>
							</div>
						</div>

						<div className = "form-group row text-center">
							<div className = "col-sm-12 col-md-12 col-lg-12">
								Already have an account? 
								<Link to = "/login"> {"Log in"} </Link>
							</div>
						</div>

					</Form>
				</div>
			</div>
		)
	}
}

