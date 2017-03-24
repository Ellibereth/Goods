var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
import {} from 'react-bootstrap';
import TopNavBar from '../Navbar/TopNavBar.js'
var Config = require('Config')
var url = Config.serverUrl

export default class EmailConfirmationPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmation_id : this.props.params.confirmation_id,
			display : "failure"
		}
	}
	
	componentDidMount(){	
		var form_data = JSON.stringify({
			"confirmation_id" : this.props.params.confirmation_id
		})

		$.ajax({
			type: "POST",
			url: url + "/confirmProductRequest",
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
					<TopNavBar/>
						<h3>
							Thank you for sending us a request! <br/>
							We'll get back to you as soon as possible with suggestions or further questions! <br/>
							Click <a href ="/"> here </a> to return to the home page.
						</h3>
				</div>
		);
	}
}