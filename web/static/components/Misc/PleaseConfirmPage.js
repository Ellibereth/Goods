var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from './PageContainer'
var browserHistory = require('react-router').browserHistory
import AppStore from '../../stores/AppStore'

export default class PleaseConfirmPage extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		// show_modal: false
		}
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
					swal(
						"Confirmation email resent to " + AppStore.getCurrentUser().email,
						"Check your email again",
						"success"
					)
				}
				else {
					swal("Oh no!", data.error, "error")
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
	// class size 30 and centered 
	var component = (
			<div className = "container">
				<h3> Please confirm your email to continue </h3>
				<h3> If you need confirmation email to be resent click
					<span className = "clickable-text" onClick = {this.resendConfirmation}> here </span>
				</h3>
				
			</div>
		)
	return (
		<PageContainer component = {component} />
		);
	}
}