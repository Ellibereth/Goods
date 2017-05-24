var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
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
    	console.log(AppStore.getCurrentUser().email)
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
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
    }

    componentDidMount(){
    	if (AppStore.getCurrentUser().email_confirmed){
    		browserHistory.push('/')
    	}
    }


    render() {
	// class size 30 and centered 
	var component = (
			<div className = "container">
				<h3> Please confirm your account! </h3>
				<h3> Check your e-mail </h3>
				<h3> Click  <span className = "clickable-text" onClick = {this.resendConfirmation}> here </span>
				to have the email sent again </h3>
				
			</div>
		)
	return (
		<PageContainer component = {component} />
		);
    }
}