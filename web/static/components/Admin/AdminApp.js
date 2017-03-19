var React = require('react');
var ReactDOM = require('react-dom');
import AdminLogin from './AdminLogin.js'
import AdminTools from './AdminTools.js'
import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			access_granted : false,
			current_user : {}
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
		$.ajax({
			type: "POST",
			data: form_data,
			url: real_url + "/checkAdminLogin",
			success: function(data) {
				if (data.success) {
					AppActions.addCurrentUser({isAdmin : true})
					// var test = AppStore.getCurrentUser()
					this.setState({access_granted : true})
				}
				else {
					swal("nice try!")
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}

	componentDidMount() {	
		var current_user = AppStore.getCurrentUser()
		this.setState({current_user : current_user})
		if (current_user != ""){
			if (current_user['isAdmin']){
				this.setState({access_granted : true})
			}
		}
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