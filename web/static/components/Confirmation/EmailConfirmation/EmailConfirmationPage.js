var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';
import PageContainer from '../../Misc/PageContainer.js'
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions'

export default class EmailConfirmationPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email_confirmation_id : this.props.params.email_confirmation_id,
			valid_user : false
		}
	}
	
	componentDidMount(){	
		var form_data = JSON.stringify({
			"email_confirmation_id" : this.props.params.email_confirmation_id
		})

		$.ajax({
			type: "POST",
			url: "/confirmEmail",
			data: form_data,
			success: function(data) {
				if (data.success){
					// maybe do something to display if not confirmed
					this.setState({valid_user : true})
					AppActions.addCurrentUser(data.user, data.jwt)
					console.log(data)
				}

				// redirect if something is wrong 
				else {
					// redirect to '/'
					browserHistory.push(`/miscPage`)
					this.setState({valid_user : false})
				}
			}.bind(this),
			error: function(){
				console.log("error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {

		return (
				<PageContainer component = {
						<div className = "container">
							<h1>
								{this.props.params.email_confirmation_id} <br/>
								Thank you for confirming your e-mail! <br/>
								Click <a href ="/"> here </a> to return to the home page.
							</h1>
						</div>
					}
				/>
		);
	}
}