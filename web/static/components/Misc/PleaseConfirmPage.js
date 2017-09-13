var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from './PageContainer'
var browserHistory = require('react-router').browserHistory
import AppStore from '../../stores/AppStore'
import {AlertMessages} from '../Misc/AlertMessages'
import FadingText from '../Misc/FadingText'

export default class PleaseConfirmPage extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
			error_text : "",
			show_error_text : false
		}
		this.setErrorMessage = this.setErrorMessage.bind(this)
	}

	setErrorMessage(error_text) {
		this.setState({
			show_error_text : true, 
			error_text : error_text
		})
	}

	resendConfirmation(){
		var form_data = JSON.stringify({
			"jwt" : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/resendConfirmationEmail",
			data: form_data,
			success: function(data) {
				if (data.success){
					this.setErrorMessage((AlertMessages.CONFIRMATION_EMAIL_SENT(AppStore.getCurrentUser().email).title))
				}
				else {
					this.setErrorMessage(data.error.title)
				}
			}.bind(this),
			error: function(){
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		if (AppStore.getCurrentUser().email_confirmed){
			window.location = '/'
		}
	}


	render() {
	return (
			<PageContainer>
				<div className = "container">
					<h3>Please confirm your email to continue</h3>
					<h3>{"If you need confirmation email to be resent click "}
						<span className = "clickable-text" onClick = {this.resendConfirmation}>here</span>
					</h3>
					<br/>

					<FadingText show = {this.state.show_error_text} height_transition = {false}>
						<span style = {{"fontSize" : "16px", "color" : "#183048"}}>
							{this.state.error_text}
						</span>
					</FadingText>
				</div>
			</PageContainer>
		);
	}
}