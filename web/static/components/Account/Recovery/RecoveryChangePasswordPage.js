var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import {Form, FormGroup, Col, Button} from 'react-bootstrap'


// you type email here
export default class RecoveryChangePasswordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email : ""
		}
	}

	componentDidMount(){
		if (AppStore.getCurrentUser()){
			browserHistory.push('/')
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onSubmitEmail(){
		var form_data = JSON.stringify({
			email : this.state.email
		})
		$.ajax({
			type: "POST",
			url: "/setRecoveryPin",
			data: form_data,
			success: function(data) {
				swal({
					title : "A recovery email has been sent to " + this.state.email,
					type: "success"
				})
				setTimeout( function () {
					browserHistory.push('/')
				}, 2000)
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
			this.onSubmitEmail.bind(this)()
		}
	}

	render() {

		var email_input =  (
				<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.email} field = {"email"} label = {"Email"}
				onKeyPress = {this.onKeyPress.bind(this)}
				/>
			)

		return (
			<PageContainer component = {
				<div className = "container">
					<Form onSubmit = {this.onSubmitEmail.bind(this)} horizontal>
						{email_input}
					<FormGroup controlId = "submit_button">
						<Col smOffset={0} sm={10}>
							<Button onClick = {this.onSubmitEmail.bind(this)}>
								Send recovery email
							</Button>
						</Col>
					</FormGroup>
					</Form>
				</div>
			}/>
		)
	}
}

