var React = require('react');
var ReactDOM = require('react-dom');
import AdminLoginTextInput from './AdminLoginTextInput.js'
import AdminTools from './AdminTools.js'

export default class AdminLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username : "",
			password : "",
			access_granted : false
		}
}

	// this has to be moved to the server side, will do when I'm back from dinner 3/11
	onLoginSubmit(event) {
		this.props.onLoginSubmit()
	}

	render() {
		return (
			<div>
				<h2> Heathcliffe required </h2>
				<AdminLoginTextInput lable = "Username" value = {this.state.username} key = "username"/>
				<AdminLoginTextInput lable = "Password" value = {this.state.password} key = "password"/>
				<div>
					<button type = "submit" onPress = {this.onLoginSubmit.bind(this)}> Admin Login </button>
				</div>
			</div>
		);
	}
}