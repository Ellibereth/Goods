var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
import {} from 'react-bootstrap';


export default class EmailConfirmationPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmation_id : this.props.params.confirmation_id,
			display : "failure"
		}
	}
	
	componentDidMount(){	
		var test_url = "http://127.0.0.1:5000"
		var real_url = "https://whereisitmade.herokuapp.com"
		var form_data = JSON.stringify({
			"confirmation_id" : this.props.params.confirmation_id
		})

		$.ajax({
			type: "POST",
			url: real_url + "/confirmRequest",
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
							{this.props.params.confirmation_id} <br/>
							Thank you for confirming your request! <br/>
							Click <a href ="/"> here </a> to return to the home page.
						</h1>
				</div>
		);
	}
}