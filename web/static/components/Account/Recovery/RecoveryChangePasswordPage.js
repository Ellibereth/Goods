var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import {Form, FormGroup, Col, Button} from 'react-bootstrap'
import AccountInput from '../AccountInput'
import Spinner from '../../Misc/Spinner'

const form_labels = ["Password", "Password Confirm"]
const form_inputs = ["password", "password_confirm"]
const input_types = ['password', 'password']

export default class RecoveryChangePasswordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			disabled : false,
			password : "",
			password_confirm : "",
			is_loading: false

		}
	}

	// handle the text input changes
	onTextInputChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
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
					browserHistory.push('/')
				}
			}.bind(this),
			error : function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	submitData(){
		this.setState({is_loading : true})
		this.setState({disabled : true})
		var form_data = JSON.stringify({
			recovery_pin : this.props.params.recovery_pin,
			password : this.state.password,
			password_confirm : this.state.password_confirm
		})
		if (!this.state.disabled) {
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
					this.setState({is_loading : false, disabled : false})
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
			this.submitData.bind(this)()
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
						className="form-control input-lg" 
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
									<div className = "panel-heading account-panel-heading">
										<div className = "text-center "> Reset Account </div>
									</div>
									<div className = "panel-body account-panel-body">
										<Form onSubmit = {this.submitData.bind(this)} horizontal>
											{text_inputs}
											<div className = "form-group row">
												<div className = "col-sm-12 col-md-12 col-lg-12">
													<Button disabled = {this.state.disabled}
													 className = "account-button" onClick = {this.submitData.bind(this)}>
														Set Password
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