var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import LoginForm from './LoginForm'
import PageContainer from '../../Misc/PageContainer'
import AppStore from '../../../stores/AppStore.js';



export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	componentWillMount() {
		var current_user = AppStore.getCurrentUser()
		if (current_user) {
			browserHistory.push(`/`)
		}
	}



	render() {

		return (
			<PageContainer component = {
				<div className = "container">
					<LoginForm target = {this.props.location.query.target}/>
					<a href = "/register"> Don't have an account yet? </a>
				</div>
			}/>
		)
	}
}

