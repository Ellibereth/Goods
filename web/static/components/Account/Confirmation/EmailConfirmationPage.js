var React = require('react');
var ReactDOM = require('react-dom');

import PageContainer from '../../Misc/PageContainer.js'
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../actions/AppActions'
var Link = require('react-router').Link
import AppStore from '../../../stores/AppStore'

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

		if (AppStore.getCurrentUser().email_confirmed){
			window.location = '/'
		}

		else {
			$.ajax({
				type: "POST",
				url: "/confirmEmail",
				data: form_data,
				success: function(data) {
					if (data.success){
						// maybe do something to display if not confirmed
						this.setState({valid_user : true})
						AppActions.addCurrentUser(data.user, data.jwt)
					}

					// redirect if something is wrong 
					else {
						// redirect to '/'
						window.location = `/miscPage`
						this.setState({valid_user : false})
					}
				}.bind(this),
				error: function(){
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	}

	render() {

		return (
				<PageContainer>
							<h3>
								Welcome to Edgar USA! <br/>
								Your account has been confirmed <br/>
								Click <a className = "edgar-link" href ="/">here</a> to start shopping now
							</h3>
					
				</PageContainer>
		);
	}
}