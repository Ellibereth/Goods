
var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import AccountInput from '../../Input/AccountInput'
import {AlertMessages} from '../../Misc/AlertMessages'
import FadingText from '../../Misc/FadingText'

const form_labels = ["Email"]
const form_inputs = ["email"]
const input_types = ['text']

// you type email here
export default class RecoveryForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email : "",
			disabled : false,
			is_loading : false,
			error_text: "",
			show_error_text: false
		}
		this.setErrorMessage = this.setErrorMessage.bind(this)
	}

	setErrorMessage(error_text) {
		this.setState({
			show_error_text : true, 
			error_text : error_text
		})
		setTimeout(function(){
			this.setState({show_error_text :false})
		}.bind(this), 4000)
	}

	componentDidMount(){
		if (AppStore.getCurrentUser()){
			window.location = '/'
		}
	}

	// handle the text input changes
	onTextChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}


	onSubmitEmail(event){
		event.preventDefault()
		if (!this.state.disabled){
			this.props.setLoading(true)
			var form_data = JSON.stringify({
				email : this.state.email
			})
			$.ajax({
				type: "POST",
				url: "/setRecoveryPin",
				data: form_data,
				success: function(data) {
					if (data.success){
						this.setErrorMessage(AlertMessages.RECOVERY_PIN_SENT(this.state.email).title)
						this.setState({email : ""})
					}
					else {
						this.setErrorMessage(AlertMessages.RECOVERY_PIN_NOT_SENT(this.state.email).title)
					}
					this.setState({disabled : false})
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'setRecoveryPin'
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			this.onSubmitEmail.bind(this)(e)
		}
	}

	render() {
		
		return (
			<div>
				<div className="inviteBlock newLoginProcess edgar-col-sm-30" id="resInviteForm">
					<div className='loginFormNew floatLeft'>


					<form onSubmit = {this.onSubmitEmail.bind(this)}
					 onKeyPress = {this.onKeyPress.bind(this)} 
					 className="newInviteWrap" id="uSignup">
						<div id="invSignUpWrap" style= {{"display": "block"}}>
							<h2 className="mainIndexTitle reqAccess">Forgot Password?</h2>
							<div className="edgar-row" id="errBar" style= {{"*position" : "relative", "display":"none"}}>
								<div className=" err-from-login edgar-col-xs-60" style = {{"padding": "10px 0"}}>
									<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px",width: "100%"}}>
									</div>
								</div>
							</div>

							<label>RECOVER ACCOUNT</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							name="email" 
							placeholder="Email" tabindex="1" type="text" value= {this.state.email}/>


							<div className="signUpBtnWrap">
								<input onClick = {this.onSubmitEmail.bind(this)} className="edgarSubmitBtn edgarGradNew borderR3 noShadow" id="reqSubmit" type="submit" value="Recover Account"/> 
							</div>

							<a href = "/login" id="forgotPW" style= {{"marginTop" : "6px", "lineHeight" : "32px", display: "block"}}>Remember your password? Sign in</a>
							<FadingText show = {this.state.show_error_text} height_transition = {true}>
								<span className = "login-error-alert-text register-success" style= {{"textDecoration" : "none", "marginTop" : "10px", display: "block"}}>{this.state.error_text}</span>
							</FadingText>


						</div>
					</form>
				</div>
			</div>
		</div>
		)
	}
}



