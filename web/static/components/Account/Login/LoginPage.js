var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
var browserHistory = require('react-router').browserHistory;
import LoginForm from './LoginForm'
import TopNavBar from '../../Misc/TopNavBar'
import AppStore from '../../../stores/AppStore.js';



export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	componentWillMount() {
		var current_user = AppStore.getCurrentUser()
		if (current_user || current_user != {}){
			browserHistory.push(`/`)
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

