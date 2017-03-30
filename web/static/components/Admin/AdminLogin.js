var React = require('react');
var ReactDOM = require('react-dom');
import TextInput from '../Misc/Input/TextInput.js'

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
	onLoginSubmit() {
		this.props.onLoginSubmit(this.state.username, this.state.password)
	}

	onTextInputChange(field, value) {
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	render() {
		return (
			<div>
				<h2> Heathcliffe required </h2>
				<TextInput label = "Username" onTextInputChange = {this.onTextInputChange.bind(this)}
					 value = {this.state.username} field = "username" input_type = "text"/>
				<TextInput label = "Password" onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.password} field = "password" input_type = "password"/>
				<div>
					<button onClick = {this.onLoginSubmit.bind(this)}> Admin Login </button>
				</div>
			</div>
		);
	}
}