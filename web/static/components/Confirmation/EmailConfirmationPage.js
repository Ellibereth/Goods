var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
import {} from 'react-bootstrap';
var Config = require('Config')
var url = Config.serverUrl


export default class EmailConfirmationPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email_confirmation_id : this.props.params.email_confirmation_id,
			display : "failure"
		}
	}
	
	componentDidMount(){	
		var form_data = JSON.stringify({
			"email_confirmation_id" : this.props.params.email_confirmation_id
		})

		$.ajax({
			type: "POST",
			url: url + "/confirmEmail",
			data: form_data,
			success: function(data) {
				if (data.success){
					// maybe do something to display if not confirmed
					this.setState({display : "confirmed"})
				}
				// redirect if something is wrong 
				else {
					// redirect to '/'
					console.log("redirect to index")
				}
			},
			error: function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {

		return (
				<div id = "confirmation_page_container">
						<h1>
							{this.props.params.email_confirmation_id} <br/>
							Thank you for confirming your e-mail! <br/>
							Click <a href ="/"> here </a> to return to the home page.
						</h1>
				</div>
		);
	}
}