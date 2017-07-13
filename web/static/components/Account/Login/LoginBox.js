var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore'


export default class LoginBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			is_loading : false
		}
	}

	componentDidMount(){

	}



	render() {

		return (
			<div>
				<div className="inviteBlock fab-col-sm-30 hidden-xs" id="resInviteMsg">
					<h1 style= {{"lineHeight":"41px", "fontSize": "31px"}}><span className="color333 fontW300">Fab is Everyday Design.</span>
					</h1>


					<p style= {{"paddingBottom": "1.250em", "marginTop":"2.6em"}}>Free Membership.</p>
					<input className="font13 fabSubmitBtn fabGradNew borderR3 noShadow" id="requestInvite" style= {{"display": "none"}} type="button" value="Sign Up"/>

					<div className="displayNone" id="aMWrap" style= {{"display": "block"}}>
						<span className="lockIconWrap" style= {{"color": "#000"}}>Already a member?</span> <span id="reLogin" style= {{"marginLeft": "5px", "cursor": "pointer"}}>
						<span className="lockIcon fabShopSprite"></span> 
						<a href="javascript:void(0)" style= {{"color": "#333"}}>Login</a></span>
					</div>
				</div>

				<div className="inviteBlock newLoginProcess fab-col-sm-30" id="resInviteForm">
					<div className='loginFormNew floatLeft'>
						<div className="loginFormNew floatLeft" id="loginWrap" style= {{"display": "none"}}>
							<div className="hide" id="EuroVisitor">
								<h2 className="mainIndexTitle" style= {{"marginBottom": "10px"}}>Greetings European Visitor</h2>


								<h3 className="font20" style= {{"fontWeight": "normal", "marginBottom": "16px"}}>What would you like to do?</h3>


								<div style= {{"position" : "relative", "marginTop" : "15px", "float" : "left", "margin" : "0"}}>
									<span className="fabSubmitBtn fabGradNew borderR3 noShadow font15" id="fabUSASelected" style={{"padding": "8px 62px"}}>Visit U.S. Store</span>
								</div>


								<div style={{"position": "relative", "margin" : "8px 0 0px", float: "left", margin: "0", padding: "8px 0 7px"}}>
									<span className="fabSubmitBtn fabGradNew borderR3 noShadow font15" data-redirect="https://eu.fab.com/?___store=fab_en&amp;___from_store=default&amp;cpla=1" id="fabEuropeOtherSelected" style= {{"padding": "8px 42px 8px 47px", "*padding": "10px 41px 10px 41px"}}>Visit European Store</span>
								</div>


								<div className="floatLeft">
									<input className="uiInputLabelCheckbox" id="rememberUSAGerChoice" name="persistent" onclick="if (this.checked) { $('#rememberUSAGerChoice').attr('checked', 'checked') } else { $('#rememberUSAGerChoice').removeAttr('checked') }" style= {{"borderColor" : "#000"}} type="checkbox"/> <label style= {{"marginLeft": "5px", "display": "inlineBlock", "fontWeight" : "normal", "verticalAlign" : "top"}}>Remember my choice</label>
								</div>
							</div>


							<div id="LoginScreen">
								<form accept-charset="UTF-8" action="https://fab.com/login/?" id="uLogin" method="post" name="uLogin">

									<h2 className="mainIndexTitle" style={{"color":"#333"}}>Member Sign In</h2>


									<div className="fab-row" id="errBar" style= {{"*position" : "relative", "display":"none"}}>
										<div className=" err-from-login fab-col-xs-60" style={{"padding": "10px 0"}}>
											<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px","width": "100%"}}>
											</div>
										</div>
									</div>
									<label>
										EMAIL
									</label>
									<input className="inputBoxNew borderR3 NewLPUserName" id="userId" name="user[un_or_email]" placeholder="Email address or username" type="text" value=""/>
									  

									<label for="user[password]" style= {{"marginTop" : "8px"}}>PASSWORD <em className="requestMemHelp hide fontIt font11 fontFamG color999 fontLtr" style={{"fontSize": "10px","fontWeight": "normal"}}>(5 character or more)</em></label> 
									<input className="inputBoxNew borderR3 NewLPPwd" id="password" name="user[password]" type="password"/> 

							


									<div id="loginAndFbButtons" style= {{"position": "relative", "marginTop": "20px"}}>
										<input className="fabSubmitBtn fabGradNew borderR3 noShadow" id="reqSubmit"  type="submit" value="Login"/> 
											<a className="fbconnectBtn fbGradNew borderR3 noShadow floatLeft" id="fbConnectButton" style={{" marginLeft": "6px"}}><span className=" fbBannerFblogin" style= {{"position": "relative","top": "-7px",left: "-3px"}}><i className="fa fa-facebook"></i></span> <span className="fblogindivider"></span> <span className="fblogwithface">Login with Facebook</span></a>

										<div style= {{" clear": "both"}}>
										</div>
										<span id="login_user_loader" style={{"bottom":"17px",position:"absolute",left:"99px","*bottom": "21px","*left": "140px"}}></span>
									</div>
									<span className="fbconnectBtn fbGradNew borderR3 noShadow" id="fbConnectButton2" style= {{"marginTop": "8px", "display":"none", "position":"relative"}}>
										<span className=" fbBannerFblogin fabShopSprite" style={{"position": "relative","top": "2px", "left" : '1px'}}/> 
										<span className=" fbBannerFblogin" style= {{"position": "relative", "top": "0px","left": "-4px"}}>
											<i className="fa fa-facebook"></i>
										</span>
										<span className="fblogindivider"></span>
										<span className="fblogwithface">Login with Facebook</span> 
										<input style= {{"color": "transparent", "height": "33px", "left": "0", "opacity": "0","position": "absolute","top": "0","width": "162px"}} type="submit" value=""/>
									</span>
								</form>


								<form accept-charset="UTF-8" id="resForgotPWBlock" method="post" name="resForgotPWBlock">
									<div className="displayNone" id="forgotPWBlock" style= {{"display" : "none"}}>
										<p style= {{"color":"#333", "fontSize" : "12px", margin:  "20px 0 10px"}}>Please enter your email address below. We will send you an email to confirm your password.</p>
										<input className="inputBoxNew borderR3" id="resResetPWEmail" name="email" placeholder="Email address" style= {{"marginBottom" : "10px"}} type="text"/>

										<div style= {{"position": "relative"}}>
											<input className="fabSubmitBtn fabGreenGradNew borderR3 noShadow" id="reset-pw-from-reauth" type="submit" value="Submit"/> <span id="reset_user_pwd_loader" style= {{"bottom":"17px","position":"absolute","left":"120px"}}/>
										</div>
									</div>
								</form>
								<a  id="forgotPW" style= {{"marginTop" : "10px", display: "block"}}>Forgot your password?</a>
							</div>
						</div>


					<form accept-charset="UTF-8" action="https://fab.com/login/?" className="newInviteWrap" id="uSignup" method="post" name="uSignup">
						<div id="invSignUpWrap" style= {{"display": "block"}}>
							<h2 className="mainIndexTitle reqAccess">Join Today!</h2>


							<div className="fab-row" id="errBar" style= {{"*position" : "relative", "display":"none"}}>
								<div className=" err-from-login fab-col-xs-60" style = {{"padding": "10px 0"}}>
									<div className="errorMessage errorMessageNew loginErr" style={{"padding":"0 6px",width: "100%"}}>
									</div>
								</div>
							</div>
							<label for="user[un_or_email]">EMAIL</label>
							<input className="inputBoxNew borderR3 NewLPUserName" id="user_email" name="user[email]" placeholder="Email address" tabindex="1" type="text" value=""/> 

							<div className="signUpBtnWrap">
								<input className="fabSubmitBtn fabGradNew borderR3 noShadow" id="reqSubmit" type="submit" value="Sign Up"/> 
								<span className="or-devider color999 fontB font12 dB">Or</span> <a className="fbconnectBtn fbGradNew borderR3 noShadow" id="fbSignupButton"><span className=" fbBannerFblogin" style= {{"position" : "relative", "top": "-8px","left": "-4px"}}><i className="fa fa-facebook"></i></span> <span className="fblogindivider singn-up"></span> <span className="fblogwithface" style={{"top":"-13px"}}>Login with Facebook</span></a> <span id="user_signup_loader" style={{"bottom":"17px","position":"absolute", "left":"190px"}}></span>
							</div>
						</div>
						<input name="authenticity_token" type="hidden" value="yRdD9G3diPhfSB2j4pZdUmGA7ZgnE5egpYXOaRGSqkbInKBSR29lhKy/kfRDVm2uxu8Gq25qEknqFWRBUaTNBg=="/>
					</form>
				</div>
			</div>
		</div>
			
		)
	}
}

