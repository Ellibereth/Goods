var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
import AppStore from '../../../stores/AppStore'

const LOGIN_STATE = 0
const REGISTER_STATE = 1

export default class LoginBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			is_loading : false
		}
	}

	componentDidMount(){

	}



	render() {
		var register_styles = this.props.form_state == REGISTER_STATE ? {'display' :'block'} : {display : 'none'}
		var login_styles = this.props.form_state == LOGIN_STATE ? {'display' :' block'} : {display : 'none'}
		return (
			<div className="inviteBlock edgar-col-sm-30" id="resInviteMsg">
				<h1 style= {{'lineHeight':'41px', 'fontSize': '31px'}}><span className="color333 fontW300">Edgar is Everyday American.</span>
				</h1>

					
				<p style= {{'paddingBottom': '1.250em', 'marginTop':'2.6em'}}>Free Membership.</p>
				<input style = {register_styles} onClick = {this.props.setFormState.bind(this, LOGIN_STATE)} className={' font13 edgarSubmitBtn edgarGradNew borderR3 noShadow'} id="requestInvite" type="button" value="Sign Up"/>
				

				<div style = {login_styles} id="aMWrap">
					<span className="lockIconWrap" style= {{'color': '#000'}}>Already a member?</span> <span id="reLogin" style= {{'marginLeft': '5px', 'cursor': 'pointer'}}>
						<span className="lockIcon edgarShopSprite"></span> 
						<a onClick = {this.props.setFormState.bind(this, REGISTER_STATE)} href="javascript:void(0)" style= {{'color': '#333'}}>Login</a></span>
				</div>
			</div>

				
		)
	}
}

