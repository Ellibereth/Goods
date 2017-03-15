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
	onLoginSubmit(username, password) {
		var form_data = JSON.stringify({
			'username' : username,
			'password' : password 
		})
		var real_url = "https://whereisitmade.herokuapp.com"
		var test_url = "http://127.0.0.1:5000"
		var that = this
		$.ajax({
			type: "POST",
			data: form_data,
			url: real_url + "/checkAdminLogin",
			success: function(data) {
				if (data.success) {
					that.setState({access_granted : true})
				}
				else {
					alert("nice try!")
				}
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
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