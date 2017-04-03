var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import LoginForm from './LoginForm'
import TopNavBar from '../../Misc/TopNavBar'



export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {

		return (
			<div>

				<TopNavBar />
				<div className = "container">
					<LoginForm />
					<a href = "/register"> Don't have an account yet? </a>
				</div>
			</div>	
		)
	}
}

