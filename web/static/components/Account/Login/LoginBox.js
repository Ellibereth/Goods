var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'
import AppActions from '../../../actions/AppActions'
import LoginBoxLeft from './LoginBoxLeft'
import {getParameterByName} from '../../Input/Util'
import {AlertMessages} from '../../Misc/AlertMessages'
import FacebookConnect from './FacebookConnect'
import FadingText from '../../Misc/FadingText'

const LOGIN_STATE = 0
const REGISTER_STATE = 1

export default class LoginBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false,
			password : "",
			login_email : "",
			register_email : "",
			name : "",
			register_password : "",
			disabled : false,
			register_password_confirm: "",
			login_faded_text : "",
			register_faded_text : "",
		}
	}

	componentDidMount(){

	}

	onTextChange(event) {
		var obj = this.state
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	loginUser(event){
		event.preventDefault()
		if (!this.state.disabled) {
			this.setState({disabled : true})
			this.props.setLoading(true)

			var data = {
				'email' : this.state.login_email,
				'password' : this.state.login_password,
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
						this.setState({login_faded_text : data.error.title})
						setTimeout(function(){this.setState({login_faded_text : ""})}.bind(this), 5000)
					}
					else {
						ga('send', 'event', {
								eventCategory: 'Account',
								eventAction: 'Login',
								eventLabel: data.user.email
						});

						AppActions.addCurrentUser(data.user, data.jwt)
						var target = getParameterByName('target')
						if (!target){
							window.location = '/'
						}
						else {
							window.location = '/' + target
						}
					}
					this.setState({disabled : false})
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					this.props.setLoading(false)
					this.setState({disabled : false})
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	}

	onLoginKeyPress(event){
		if (event.key === 'Enter') {
			this.loginUser.bind(this)(event)
		}
	}


	registerUser(event){
		event.preventDefault()

		if (!this.state.disabled) {
			this.props.setLoading(true)
			this.setState({disabled : true})
			var data = {}
			data = {
				password : this.state.register_password,
				password_confirm : this.state.register_password_confirm,
				email : this.state.register_email,
				name : this.state.name
			}

			var user = AppStore.getCurrentUser() 
			if (user.is_guest) {
				data['guest_jwt'] = localStorage.jwt
			} 

			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/registerUserAccount",
				data: form_data,
				success: function(data) {
					// this.props.setLoading(false)
					if (!data.success) {
						this.setState({register_faded_text : data.error.title})
						setTimeout(function() {this.setState({register_faded_text : ""})},bind(this), 5000)
					}
					else {
						ga('send', 'pageview', 'register-complete');
						AppActions.addCurrentUser(data.user, data.jwt)
						swal(AlertMessages.ACCOUNT_REGISTRATION_SUCCESS,
							function () {
								window.location = '/'
							}.bind(this)
						)
					}
					this.setState({disabled : false})
					this.props.setLoading(false)
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'registerUserAccount'
					});
					this.props.setLoading(false)
					// this.props.setLoading(false)
					this.setState({disabled : false})
				}.bind(this),
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	
	}

	onRegisterKeyPress(event){
		// e.preventDefault()
		if (event.key === 'Enter') {
			this.registerUser.bind(this)(event)
		}
	}



	render() {
		var register_styles = this.props.form_state == REGISTER_STATE ?  {display : "none"} :{"display" :"block"}
		var login_styles = this.props.form_state == LOGIN_STATE ? {display : "none"} : {"display" :" block"} 


		return (
			<div>
				<div className="inviteBlock newLoginProcess edgar-col-sm-30 edgar-col-md-30 edgar-col-lg-30 " id="resInviteForm">
					<div className='loginFormNew floatLeft'>
						<div style = {login_styles} className="loginFormNew floatLeft" id="loginWrap" >
							<div id="LoginScreen">
								<form onSubmit = {this.loginUser.bind(this)} onKeyPress = {this.onLoginKeyPress.bind(this)}>
									<h2 className="mainIndexTitle" style={{"color":"#333"}}>Member Sign In</h2>
									<div className="edgar-row" id="errBar" style= {{"*position" : "relative"}}>
										<div className=" err-from-login edgar-col-xs-60" style={{"padding": "10px 0"}}>
											<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px","width": "100%"}}>
											</div>
										</div>
									</div>
									<label>
										EMAIL
									</label>
									<input 
									onChange = {this.onTextChange.bind(this)}
									className="inputBoxNew borderR3 NewLPUserName" id="userId" 
									name="login_email" placeholder="Email address" type="text" value= {this.state.login_email}/>
									  

									<label for="user[password]" style= {{"marginTop" : "8px"}}>PASSWORD <em className="requestMemHelp hide fontIt font11 fontFamG color999 fontLtr" style={{"fontSize": "10px","fontWeight": "normal"}}>(5 character or more)</em></label> 
									<input 
									onChange = {this.onTextChange.bind(this)}
									className="inputBoxNew borderR3 NewLPPwd"
									id="password" name="login_password" type="password"
									value = {this.state.login_password}/> 

							


									<div id="loginAndFbButtons" style= {{"position": "relative", "marginTop": "20px"}}>
										<input className="edgarSubmitBtn edgarGradNew borderR3 noShadow" id="reqSubmit"  type="submit" value="Login"/> 

										<div style= {{" clear": "both"}}>
										</div>
										<span id="login_user_loader" style={{"bottom":"17px",position:"absolute",left:"99px","*bottom": "21px","*left": "140px"}}></span>
										<span className = "hidden-xs">
											<div style = {{"float" : "right"}}>
												{/* <FacebookConnect  
												setLoading = {this.props.setLoading}
												button_text = "LOGIN WITH FACEBOOK"/> */}
											</div>
										</span>
										<span className = "hidden-sm hidden-md hidden-lg">
											<div style=  {{"paddingTop" : "48px"}}>
												{/* <FacebookConnect setLoading = {this.props.setLoading}
												 button_text = "LOGIN WITH FACEBOOK"/> */}
											</div>
										</span>
									</div>
								</form>
								
								<a href = "/recoverAccount" className = "hidden-xs" id="forgotPW" style= {{"textDecoration" : "none", "marginTop" : "70px", "lineHeight" : "32px", display: "block"}}>Forgot your password?</a>
								<a href = "/recoverAccount" className = "hidden-sm hidden-md hidden-lg" id="forgotPW" style= {{"textDecoration" : "none", "marginTop" : "10px", "lineHeight" : "32px", display: "block"}}>Forgot your password?</a>
								<a href= "/register" className = "hidden-xs" id="forgotPW" style= {{"textDecoration" : "none", "lineHeight" : "32px", display: "block"}}>Don't have an account yet? Register today</a>
								<a href= "/register" className = "hidden-sm hidden-md hidden-lg" id="forgotPW" style= {{"textDecoration" : "none", "lineHeight" : "32px", display: "block"}}>Register</a>
								<FadingText show = {Boolean(this.state.login_faded_text)}>
									<span href = "/recoverAccount" className = "hidden-xs login-error-alert-text" style= {{"textDecoration" : "none", "marginTop" : "10px", "lineHeight" : "32px", display: "block"}}>{this.state.login_faded_text}</span>
								</FadingText>
							</div>
						</div>


					<form onSubmit = {this.registerUser.bind(this)} onKeyPress = {this.onRegisterKeyPress.bind(this)}
					 style = {register_styles} className="newInviteWrap" id="uSignup">
						<div id="invSignUpWrap" style= {{"display": "block"}}>
							<h2 className="mainIndexTitle reqAccess">Join Today!</h2>


							<div className="edgar-row" id="errBar" style= {{"*position" : "relative", "display":"none"}}>
								<div className=" err-from-login edgar-col-xs-60" style = {{"padding": "10px 0"}}>
									<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px",width: "100%"}}>
									</div>
								</div>
							</div>

							<label for="user[un_or_email]">NAME</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							id="user_email" name="name" 
							placeholder="" tabindex="1" type="text" value= {this.state.name}/>

							 <label for="user[un_or_email]">EMAIL</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							 id="user_email" name="register_email" 
							 placeholder="" tabindex="2" type="text" value={this.state.register_email}/>

							 <label for="user[un_or_email]">PASSWORD (AT LEAST 6 CHARACTERS)</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							 id="user_email" name="register_password" 
							 placeholder="" tabindex="3" type="password" value= {this.state.register_password}/> 

							 <label for="user[un_or_email]">CONFIRM PASSWORD</label>
							<input 
							style = {{"marginBottom" : "12px"}}
							onChange = {this.onTextChange.bind(this)}
							className="inputBoxNew borderR3 NewLPUserName"
							 id="user_email" name="register_password_confirm" 
							 placeholder="" tabindex="4" type="password" value= {this.state.register_password_confirm}/>

							<div className="signUpBtnWrap">
								<input onClick = {this.registerUser.bind(this)} className="edgarSubmitBtn edgarGradNew borderR3 noShadow" id="reqSubmit" type="submit" value="Sign Up"/> 
								<span className = "hidden-xs">
									<div style = {{"float" : "right"}}>
										 {/* <FacebookConnect 
										 setLoading = {this.props.setLoading}
										  button_text = "LOGIN WITH FACEBOOK"/> */}
									</div>
								</span>
								<span className = "hidden-sm hidden-md hidden-lg">
									<div style=  {{"paddingTop" : "12px"}}>
										{/* <FacebookConnect  
										setLoading = {this.props.setLoading}
										button_text = "LOGIN WITH FACEBOOK"/>  */}
									</div>
								</span>
							</div>

							<a href = "/login" id="forgotPW" style= {{"textDecoration" : "none", "marginTop" : "6px", "lineHeight" : "32px", display: "block"}}>Already have an account?</a>

							<FadingText show = {Boolean(this.state.register_faded_text)}>
								<span href = "/recoverAccount" className = "hidden-xs login-error-alert-text" style= {{"textDecoration" : "none", "marginTop" : "10px", "lineHeight" : "32px", display: "block"}}>{this.state.register_faded_text}</span>
							</FadingText>

						</div>
					</form>
				</div>
			</div>
		</div>
			
		)
	}
}

