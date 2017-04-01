var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import RegisterAccountForm from './RegisterAccountForm'
import TopNavBar from '../../Misc/TopNavBar'


export default class RegisterPage extends React.Component {
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
					<RegisterAccountForm/>
					<a href = "/login"> Already have an account? </a>
				</div>
			</div>	
		)
	}
}

