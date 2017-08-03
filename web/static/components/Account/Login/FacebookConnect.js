var React = require('react');
var Link = require('react-router').Link;
import AppActions from '../../../actions/AppActions';
import { browserHistory } from 'react-router';
import AppStore from '../../../stores/AppStore';
import FacebookLogin from 'react-facebook-login';

const appId = "120813588560588"
const testAppId = "301430330267358"

export default class FacebookConnect extends React.Component {
		constructor() {
		super();
		this.state = {
			fb_first_name 		: "",
			fb_last_name		: "",
			fb_email			: "",
			fb_id 				: "",
			fb_username 		: "",
		};
	}
	
	handleFacebookLoginClick() {
		this.setState({status : "clicked"})
	}
		
	// handle the faceobok login
	responseFacebook(response) {
		var obj = {
			fb_response 		: response,
			jwt  				: localStorage.jwt
		};
		$.ajax({
			type: "POST",
			url : '/handleFacebookUser',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function (data){
				console.log(data)
				if (data.success) {
					AppActions.addCurrentUser(data.user, data.jwt)
					window.location = "/"
				} 
				else {
					swal(data.error)
				}
			}.bind(this)
		});
	}
	
	render() {	
		return (
			<FacebookLogin
				appId= {testAppId}
				autoLoad={false}
				fields="first_name,email, last_name, name"
				onClick={this.handleFacebookLoginClick.bind(this)}
				callback={this.responseFacebook.bind(this)}
				icon="fa-facebook"
				cssClass = "fb-connect-button"
				textButton = "Connect with Facebook" />
		)
	}
}
