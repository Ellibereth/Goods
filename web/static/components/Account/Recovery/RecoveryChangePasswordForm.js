var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import AccountInput from '../../Input/AccountInput'
import Button from 'react-bootstrap/lib/Button'
import AppActions from '../../../actions/AppActions'

import {AlertMessages} from '../../Misc/AlertMessages'
const form_labels = ["Password", "Password Confirm"]
const form_inputs = ["password", "password_confirm"]
const input_types = ['password', 'password']

export default class RecoveryChangePasswordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password : "",
			password_confirm : "",
			is_valid : false
		}
	}

	// handle the text input changes
	onTextChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	componentDidMount(){
		AppActions.removeCurrentUser()
		this.checkRecovery.bind(this)()
	}

	checkRecovery() {
		var form_data = JSON.stringify({
			recovery_pin : this.props.recovery_pin
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
					window.location = '/'
				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'checkRecoveryInformation'
					});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	submitData(event){
		event.preventDefault()
		this.props.setLoading(true)
		var form_data = JSON.stringify({
			recovery_pin : this.props.recovery_pin,
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
						swal(AlertMessages.NEW_PASSWORD_HAS_BEEN_SET, function(isConfirm){
							window.location = '/'
						})
					}
					else {
						swal(data.error.title, data.error.text , data.error.type)
					}
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'recoverySetPassword',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			this.submitData.bind(this)(e)
		}
	}

	render() {
		return (
			
			<div>
				<div className="inviteBlock newLoginProcess edgar-col-sm-30" id="resInviteForm">
					<div className='loginFormNew floatLeft'>

					<form onSubmit = {this.submitData.bind(this)} onKeyPress = {this.onKeyPress.bind(this)} 
					className="newInviteWrap" id="uSignup">
						<div id="invSignUpWrap" style= {{"display": "block"}}>
							<h2 className="mainIndexTitle reqAccess">Join Today!</h2>
							<div className="edgar-row" id="errBar" style= {{"*position" : "relative", "display":"none"}}>
								<div className=" err-from-login edgar-col-xs-60" style = {{"padding": "10px 0"}}>
									<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px",width: "100%"}}>
									</div>
								</div>
							</div>

							<label for="user[un_or_email]">PASSWORD (AT LEAST 6)</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							name="password" 
							placeholder="Password" tabindex="1" type="password" value= {this.state.password}/>

							<label for="user[un_or_email]">CONFIRM PASSWORD</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							name="password_confirm" 
							placeholder="Password Confirm" tabindex="1" type="password" value= {this.state.password_confirm}/>


							<div className="signUpBtnWrap">
								<input onClick = {this.submitData.bind(this)} className="edgarSubmitBtn edgarGradNew borderR3 noShadow" id="reqSubmit" type="submit" value="Recover Account"/> 
							</div>

							<a href = "/login" id="forgotPW" style= {{"marginTop" : "6px", "lineHeight" : "32px", display: "block"}}>Know your password?</a>
						</div>
					</form>
				</div>
			</div>
		</div>
		)
	}
}