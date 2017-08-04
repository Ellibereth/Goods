var React = require('react');
var Link = require('react-router').Link;
import AppActions from '../../../actions/AppActions';
import { browserHistory } from 'react-router';
import AppStore from '../../../stores/AppStore';
import FacebookLogin from 'react-facebook-login';

export default class FacebookConnect extends React.Component {
		constructor() {
		super();
		this.state = {
			app_id : null,
		};
	}

	componentDidMount() {
		this.getFbAppId.bind(this)()
	}

	getFbAppId(){
		$.ajax({
			type: "POST",
			url : '/getFbAppId',
			// data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function (data){
				if (data.success) {
					this.setState({app_id : data.app_id})
				} 
			}.bind(this)
		});
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
					// window.location = "/"
				} 
				// else {
				// 	swal(data.error)
				// }
			}.bind(this)
		});
	}
	
	render() {	
		
		return (	
			<span>
			{this.state.app_id ? 
				<FacebookLogin
					appId= {this.state.app_id}
					autoLoad={false}
					fields="first_name,email, last_name, name"
					onClick={this.handleFacebookLoginClick.bind(this)}
					callback={this.responseFacebook.bind(this)}
					icon="fa-facebook fb-icon"
					cssClass = "fb-connect-button"
					textButton = {this.props.button_text} />
					:
					<div/>
			}
			</span>
		)
	}
}
