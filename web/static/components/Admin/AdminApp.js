var React = require('react');
var ReactDOM = require('react-dom');
import AdminLogin from './AdminLogin.js'
import AdminTools from './AdminTools.js'

export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			access_granted : false
		}
	}

	// this has to be moved to the server side, will do when I'm back from dinner 3/11
	onLoginSubmit(event) {
		var form_data = JSON.stringify({
			'username' : this.state.username,
			'password' : this.state.password 
		})

		$.ajax({
			type: "POST",
			data: form_data,
			url: real_url + "/checkAdminLogin",
			success: function(data) {
				if (data.success) {
					this.setState({access_granted : true})
				}
				else {
					alert("nice try!")
				}
			}
		})
	}

	render() {
		return (
			<div>
				{ !this.state.access_granted && <AdminLogin onLoginSubmit = {this.onLoginSubmit.bind(this)}/> }
				{ this.state.access_granted &&  <AdminTools /> }
			</div>
		);
	}
}