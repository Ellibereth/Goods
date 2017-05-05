var React = require('react');
var ReactDOM = require('react-dom');

import RegisterAccountForm from './RegisterAccountForm'
import PageContainer from '../../Misc/PageContainer'


export default class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {

		return (
			<PageContainer component = {
				<div className = "container">
					<RegisterAccountForm/>
					<a href = "/login"> Already have an account? </a>
				</div>
			}/>
			
		)
	}
}

