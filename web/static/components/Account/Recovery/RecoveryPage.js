
var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import {Form, FormGroup, Col, Button} from 'react-bootstrap'
import AccountInput from '../AccountInput'
import Spinner from '../../Misc/Spinner'

const form_labels = ["Email"]
const form_inputs = ["email"]
const input_types = ['text']

// you type email here
export default class RecoveryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email : "",
			disabled : false,
			is_loading : false

		}
	}

	componentDidMount(){
		if (AppStore.getCurrentUser()){
			browserHistory.push('/')
		}
	}

	// handle the text input changes
	onTextInputChange(event) {
		console.log(event.target.name)
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}


	onSubmitEmail(){
		event.preventDefault()
		if (!this.state.disabled){
			this.setState({disabled: true, is_loading : true})
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
					this.setState({disabled: false, is_loading : false})
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			this.onSubmitEmail.bind(this)()
		}
	}

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			return (
					<AccountInput 
						index = {index}
						tabindex = {index}
						onKeyPress = {this.onKeyPress.bind(this)}
						field = {form_input}
						name = {form_input}
						type = {input_types[index]}
						onChange = {this.onTextInputChange.bind(this)}
						value = {this.state[form_input]} 
						label = {form_labels[index]}
					/>
				)
		})

		

		return (
			<PageContainer component = {
				<div className = "container">
					{this.state.is_loading && <Spinner />}
						<div className = "container">
							<div className = "col-md-offset-3 col-lg-offset-3 col-md-6 col-lg-6">
								<div className = "panel panel-primary account-panel">

									<div className = "panel-body account-panel-body">
										<h2 className = "account-header"> Recover Account </h2>
										<Form onSubmit = {this.onSubmitEmail.bind(this)} horizontal>
											{text_inputs}
											<div className = "form-group row">
												<div className = "col-sm-12 col-md-12 col-lg-12">
													<Button disabled = {this.state.disabled}
													 className = "account-button" onClick = {this.onSubmitEmail.bind(this)}>
														Recover Account
													</Button>
												</div>
											</div>
										</Form>
									</div>
								</div>
							</div>
						</div>
				</div>
			}/>
		)
	}
}



