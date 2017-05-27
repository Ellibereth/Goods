var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import {Form, FormGroup, Col, Button} from 'react-bootstrap'

const form_labels = ["Password", "Password Confirm"]
const form_inputs = ["password", "password_confirm"]
const input_types = ['password', 'password']

export default class RecoveryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_valid : false,
			password : "",
			password_confirm : ""
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	componentDidMount(){
		this.checkRecovery.bind(this)()
	}

	checkRecovery() {
		var form_data = JSON.stringify({
			recovery_pin : this.props.params.recovery_pin
		})
		$.ajax({
			type: "POST",
			url: "/checkRecoveryInformation",
			data: form_data,
			success: function(data) {
				if (data.success){
					this.setState({is_valid : true})
				}
				else {
					swal({
						title : data.error,
						type : "error"
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

	onSubmitPassword(){
		var form_data = JSON.stringify({
			recovery_pin : this.props.params.recovery_pin,
			password : this.state.password,
			password_confirm : this.state.password_confirm
		})
		$.ajax({
			type: "POST",
			url: "/recoverySetPassword",
			data: form_data,
			success: function(data) {
				if (data.success){
					swal({
						title: "Password has been set",
						// text: "You will not be able to recover this imaginary file!",
						type: "success",
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Return to home page to login",
						closeOnConfirm: true,
					}, function(isConfirm){
						browserHistory.push('/')
					})
				}
				else {
					swal({
						title : data.error,
						type : "error"
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

	onKeyPress(e){
		if (e.key == "Enter"){
			this.onSubmitPassword.bind(this)()
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
			<PageContainer component = {

				<div className = "container">
					{ this.state.is_valid &&
						<Form onSubmit = {this.onSubmitPassword.bind(this)} horizontal>
							{text_inputs}
							<FormGroup controlId = "submit_button">
								<Col smOffset={0} sm={10}>
									<Button onClick = {this.onSubmitPassword.bind(this)}>
										Change Password
									</Button>
								</Col>
							</FormGroup>
						</Form>
					}
				</div>
			}/>
		)
	}
}

